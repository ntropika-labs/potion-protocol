// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "./presets/ERC1155FullSupplyEnumerableUpgradeable.sol";
import "./ERC1155DecimalsUpgradeable.sol";
import "./ERC1155FullSupplyUpgradeable.sol";
import "./interfaces/IERC4626MultiTokenUpgradeable.sol";

/**
 * @dev Modification of the ERC4626 OpenZeppelin implementation to allow for multi-tokens to be
        minted for the shares. This multi-tokens are represented by an ERC-1155 token, instead of
        an ERC-20 token.
        
        The vault implements a system of Rounds, where each round is a period of time where the
        investors can deposit funds and the vault will mint shares for them. The ID of the ERC-1155
        token is used to represent the Round number in which the tokens were minted.
 */
abstract contract ERC4626MultiTokenUpgradeable is
    Initializable,
    ERC1155DecimalsUpgradeable,
    ERC1155FullSupplyUpgradeable,
    IERC4626MultiTokenUpgradeable
{
    using MathUpgradeable for uint256;

    IERC20MetadataUpgradeable private _asset;
    uint256 private _round; // The current invesment round

    /**
     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
     */
    function __ERC4626_init(IERC20MetadataUpgradeable asset_) internal onlyInitializing {
        __ERC4626_init_unchained(asset_);
    }

    function __ERC4626_init_unchained(IERC20MetadataUpgradeable asset_) internal onlyInitializing {
        _asset = asset_;
    }

    /** @dev See {IERC4262-asset} */
    function asset() public view virtual override returns (address) {
        return address(_asset);
    }

    /** @dev See {IERC4626MultiToken-totalAssets} */
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }

    /** @dev See {IERC4626MultiToken-convertToShares} */
    function convertToShares(uint256 assets) public view virtual override returns (uint256 shares) {
        return _convertToShares(assets);
    }

    /** @dev See {IERC4626MultiToken-convertToAssets} */
    function convertToAssets(uint256 shares) public view virtual override returns (uint256 assets) {
        return _convertToAssets(shares);
    }

    /** @dev See {IERC4626MultiToken-maxDeposit} */
    function maxDeposit(address) public view virtual override returns (uint256) {
        return _isVaultCollateralized() ? type(uint256).max : 0;
    }

    /** @dev See {IERC4626MultiToken-maxMint} */
    function maxMint(address) public view virtual override returns (uint256) {
        return type(uint256).max;
    }

    /** @dev See {IERC4626MultiToken-maxRedeem} */
    function maxRedeem(address owner) public view virtual override returns (uint256) {
        return _balanceOfPreviousRounds(owner);
    }

    /** @dev See {IERC4626MultiToken-previewDeposit} */
    function previewDeposit(uint256 assets) public view virtual override returns (uint256) {
        return _convertToShares(assets);
    }

    /** @dev See {IERC4626MultiToken-previewMint} */
    function previewMint(uint256 shares) public view virtual override returns (uint256) {
        return _convertToAssets(shares);
    }

    /** @dev See {IERC4626MultiToken-previewRedeem} */
    function previewRedeem(uint256 shares) public view virtual override returns (uint256) {
        return _convertToAssets(shares);
    }

    /** @dev See {IERC4626MultiToken-deposit} */
    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        require(assets <= maxDeposit(receiver), "ERC4626MultiToken: deposit more than max");

        uint256 shares = previewDeposit(assets);
        _deposit(_msgSender(), receiver, assets, shares);

        return shares;
    }

    /** @dev See {IERC4626MultiToken-mint} */
    function mint(uint256 shares, address receiver) public virtual override returns (uint256) {
        require(shares <= maxMint(receiver), "ERC4626MultiToken: mint more than max");

        uint256 assets = previewMint(shares);
        _deposit(_msgSender(), receiver, assets, shares);

        return assets;
    }

    /** @dev See {IERC4626MultiToken-redeem} */
    function redeem(
        uint256 sharesId,
        uint256 sharesAmount,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(sharesAmount <= maxRedeem(owner), "ERC4626MultiToken: redeem more than max");

        uint256 assets = previewRedeem(sharesAmount);
        _withdraw(_msgSender(), receiver, owner, assets, sharesId, sharesAmount);

        return assets;
    }

    /** @dev See {IERC4626MultiToken-redeemBatch} */
    function redeemBatch(
        uint256[] memory sharesIds,
        uint256[] memory sharesAmounts,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(sharesIds.length == sharesAmounts.length, "ERC4626MultiToken: mismatch shares ids and amounts lengths");

        uint256 totalShares = 0;
        for (uint256 i = 0; i < sharesIds.length; i++) {
            totalShares += sharesAmounts[i];
        }

        require(totalShares <= maxRedeem(owner), "ERC4626MultiToken: redeem more than max");

        uint256 assets = previewRedeem(totalShares);
        _withdrawBatch(_msgSender(), receiver, owner, assets, sharesIds, sharesAmounts);

        return assets;
    }

    /**
     * @dev Internal convertion function (from assets to shares) with support for rounding direction
     *
     * Will revert if assets > 0, totalSupply > 0 and totalAssets = 0. That corresponds to a case where any asset
     * would represent an infinite amout of shares.
     */
    function _convertToShares(uint256 assets) internal view virtual returns (uint256 shares) {
        uint256 supply = totalSupply();
        return
            (assets == 0 || supply == 0)
                ? (assets * (10**decimals())) / (10**_asset.decimals())
                : (assets * supply) / totalAssets();
    }

    /**
     * @dev Internal convertion function (from shares to assets) with support for rounding direction
     */
    function _convertToAssets(uint256 shares) internal view virtual returns (uint256 assets) {
        uint256 supply = totalSupply();
        return
            (supply == 0) ? (shares * (10**_asset.decimals())) / (10**decimals()) : (shares * totalAssets()) / supply;
    }

    /**
     * @dev Deposit/mint common workflow
     */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) private {
        // If _asset is ERC777, `transferFrom` can trigger a reenterancy BEFORE the transfer happens through the
        // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer before we mint so that any reentrancy would happen before the
        // assets are transfered and before the shares are minted, which is a valid state.
        // slither-disable-next-line reentrancy-no-eth
        SafeERC20Upgradeable.safeTransferFrom(_asset, caller, address(this), assets);
        _mint(receiver, _round, shares, "");

        emit Deposit(caller, receiver, assets, shares);
    }

    /**
     * @dev Withdraw/redeem common workflow
     */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 sharesId,
        uint256 sharesAmount
    ) private {
        if (caller != owner) {
            isApprovedForAll(owner, caller);
        }

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burn(owner, sharesId, sharesAmount);
        SafeERC20Upgradeable.safeTransfer(_asset, receiver, assets);

        emit Withdraw(caller, receiver, owner, assets, sharesId, sharesAmount);
    }

    function _withdrawBatch(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256[] memory sharesIds,
        uint256[] memory sharesAmounts
    ) private {
        if (caller != owner) {
            isApprovedForAll(owner, caller);
        }

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burnBatch(owner, sharesIds, sharesAmounts);
        SafeERC20Upgradeable.safeTransfer(_asset, receiver, assets);

        emit WithdrawBatch(caller, receiver, owner, assets, sharesIds, sharesAmounts);
    }

    function _isVaultCollateralized() private view returns (bool) {
        return totalAssets() > 0 || totalSupply() == 0;
    }

    function _balanceOfPreviousRounds(address account) private view returns (uint256) {
        return balanceOf(account) - balanceOf(account, _round);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
