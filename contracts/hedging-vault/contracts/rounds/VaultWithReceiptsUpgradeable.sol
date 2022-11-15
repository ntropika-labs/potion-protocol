// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "../extensions/ERC1155FullSupplyUpgradeable.sol";
import "../interfaces/IVaultWithReceiptsUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

/**
    @notice Implementation of the ERC4626 "Tokenized Vault Standard", modified to emit ERC-1155 receipts.
    When depositing a receipt is generated using an id provided by implementor of this interface.
    The receipt should contain the deposit amount. The id can be used freely to identify extra information
    about the deposit.
    
    @dev The internal function `_getMintId` is added here so derived contracts can override it to provide
    the correct id to be used for minting. The function is not marked as `view` to allow for any scheme of
    ids, including generating a new id on each minting operation

    @dev See { IERC4626MultiTokenUpgradeable }
    
    @dev This contract is a copy-paste of OpenZeppelin's `ERC4626Upgradeable.sol` with some modifications to
    support the ERC-1155 receipts.

    @dev In the original ERC-4626 the caller is checked against the allowance given by the owner in the internal
    functions `_deposit` and `_withdraw`. In ERC-1155 there is no such concept and the owner just approves the caller
    for none or all of the tokens in a collection. This is used here to allow for a caller to trade on behalf of the
    owner of the receipts

    @author Roberto Cano <robercano>
 */

abstract contract VaultWithReceiptsUpgradeable is
    Initializable,
    ERC1155FullSupplyUpgradeable,
    IVaultWithReceiptsUpgradeable
{
    using MathUpgradeable for uint256;

    IERC20MetadataUpgradeable private _asset;

    /**
     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
     */
    /* solhint-disable-next-line func-name-mixedcase */
    function __VaultWithReceipts_init(IERC20MetadataUpgradeable asset_) internal onlyInitializing {
        __VaultWithReceipts_init_unchained(asset_);
    }

    /* solhint-disable-next-line func-name-mixedcase */
    function __VaultWithReceipts_init_unchained(IERC20MetadataUpgradeable asset_) internal onlyInitializing {
        _asset = asset_;
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-asset} */
    function asset() public view virtual override returns (address) {
        return address(_asset);
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-totalAssets} */
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-maxDeposit} */
    function maxDeposit(address) public view virtual override returns (uint256) {
        return type(uint256).max;
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-maxRedeem} */
    function maxRedeem(address owner) public view virtual override returns (uint256) {
        return balanceOfAll(owner);
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-deposit} */
    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        require(assets <= maxDeposit(receiver), "deposit more than max");

        _deposit(_msgSender(), receiver, assets, _getMintId());

        return assets;
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-redeem} */
    function redeem(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(amount <= maxRedeem(owner), "redeem more than max");

        _redeem(_msgSender(), receiver, owner, amount, id);

        return amount;
    }

    /** @dev See {IVaultWithReceiptsUpgradeable-redeemBatch} */
    function redeemBatch(
        uint256[] memory ids,
        uint256[] memory amounts,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(ids.length == amounts.length, "mismatch shares ids and amounts lengths");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            totalAmount += amounts[i];
        }

        require(totalAmount <= maxRedeem(owner), "redeem more than max");

        _redeemBatch(_msgSender(), receiver, owner, totalAmount, ids, amounts);

        return totalAmount;
    }

    /**
        @dev Deposit/mint common workflow
     */
    function _deposit(
        address caller,
        address receiver,
        uint256 amount,
        uint256 id
    ) private {
        // If _asset is ERC777, `transferFrom` can trigger a reenterancy BEFORE the transfer happens through the
        // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer before we mint so that any reentrancy would happen before the
        // assets are transfered and before the shares are minted, which is a valid state.
        // slither-disable-next-line reentrancy-no-eth
        SafeERC20Upgradeable.safeTransferFrom(_asset, caller, address(this), amount);
        _mint(receiver, id, amount, "");

        emit DepositWithReceipt(caller, receiver, id, amount);
    }

    /**
        @dev Redeem workflow
     */
    function _redeem(
        address caller,
        address receiver,
        address owner,
        uint256 amount,
        uint256 id
    ) private {
        if (caller != owner) {
            require(isApprovedForAll(owner, caller), "caller is not owner nor approved");
        }

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the Setransfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burn(owner, id, amount);
        SafeERC20Upgradeable.safeTransfer(_asset, receiver, amount);

        emit RedeemReceipt(caller, receiver, owner, id, amount);
    }

    /**
        @dev The caller must make sure that totalAmount is the sum of all the amounts in the amounts array
     */
    function _redeemBatch(
        address caller,
        address receiver,
        address owner,
        uint256 totalAmount,
        uint256[] memory ids,
        uint256[] memory amounts
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
        _burnBatch(owner, ids, amounts);
        SafeERC20Upgradeable.safeTransfer(_asset, receiver, totalAmount);

        emit RedeemReceiptBatch(caller, receiver, owner, ids, amounts);
    }

    /**
        @notice Returns the Id to be used for minting the receipt

        @dev This function should be overriden by the child contract to implement any desired strategy

        @dev Not marked as `view` to allow the derived contract to modify the state inside it, in case
        a different id is desired for each minting operation
     */
    function _getMintId() internal virtual returns (uint256) {
        return 0;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
