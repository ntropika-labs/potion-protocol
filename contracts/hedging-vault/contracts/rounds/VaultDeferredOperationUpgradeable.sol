// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./VaultWithReceiptsUpgradeable.sol";
import "../interfaces/IVaultDeferredOperationUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable-4.7.3/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC4626Upgradeable.sol";

/**
    @dev Deferred operations vault that takes care of handling deposits/withdrawals for a target vault.
    It receives and accumulates deposits and then forwards them to the target vault when the `_operate` function
    is called.

    @dev Upon deposit in this vault, the proxy will mint a receipt to the depositor containing the amount of assets
    deposited and an id that can be used to identify extra information relative to the deposit: for example it can
    encode the round number in which the deposit was made for a vault that runs cyclically with rounds.

    @dev A vault typically manages 2 types of assets: the underlying and the shares. The deferred operations vault
    is aimed at exchanging between these 2 assets when the main vault cannot exchange them directly all the time
    (because it is locked, or the assets are not present all the time, etc...).

    @dev This vault extends from the ERC4626MultiToken contract, and the underlying asset should be configured as
    either the underlying of the target vault or the shares of the target vault.

    @dev After calling `_operate`, the proxy will exchange the corresponding amount of this vault's underlying
    for the other asset in the target vault: this is, if this vault's underlying is the target vault's shares,
    it will exchange these shares for the target vault's underlying. If this vault's underlying is the target vault's
    underlying, it will exchange this underlying for the target vault's shares.
 
    @author Roberto Cano <robercano>
 */
abstract contract VaultDeferredOperationUpgradeable is
    Initializable,
    VaultWithReceiptsUpgradeable,
    IVaultDeferredOperationUpgradeable
{
    // STORAGE
    IERC4626Upgradeable private _proxiedVault;

    // UPGRADABLE INITIALIZER

    /**
     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
     */
    function __VaultDeferredOperation_init(address proxiedVault) internal onlyInitializing {
        __VaultDeferredOperation_init_unchained(proxiedVault);
    }

    function __VaultDeferredOperation_init_unchained(address proxiedVault) internal onlyInitializing {
        _proxiedVault = IERC4626Upgradeable(proxiedVault);
    }

    // PUBLIC FUNCTIONS

    /** @dev See {IVaultDeferredOperationUpgradeable-vault} */
    function vault() public view returns (address vaultAddress) {
        return address(_proxiedVault);
    }

    /**
        @notice Proxies the call to the target vault to get the current underlying-to-shares ratio

        @dev See {IVaultDeferredOperationUpgradeable-convertToShares}
    */
    function convertToShares(uint256 assets) public view virtual override returns (uint256 shares) {
        return _proxiedVault.convertToShares(assets);
    }

    /**
        @notice Proxies the call to the target vault to get the current shares-to-underlying ratio

        @dev See {IVaultDeferredOperationUpgradeable-convertToAssets}
     */
    function convertToAssets(uint256 shares) external view returns (uint256 assets) {
        return _proxiedVault.convertToAssets(shares);
    }

    /**
        @notice Proxies the call to the target vault to get the maximum deposit that the
        target vault accepts
        
        @dev See {IERC4626MultiTokenUpgradeable-maxDeposit}
    */
    function maxDeposit(address receiver)
        public
        view
        virtual
        override(IVaultWithReceiptsUpgradeable, VaultWithReceiptsUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.maxDeposit(receiver);
    }

    /**
        @notice Proxies the call to the target vault to get the maximum mint that the
        target vault accepts

        @dev See {IVaultDeferredOperationUpgradeable-maxMint}
    */
    function maxMint(address receiver) public view virtual override returns (uint256) {
        return _proxiedVault.maxMint(receiver);
    }

    /** 
        @notice Proxies the call to the target vault to preview how many shares a deposit of underlying
        would yield

        @dev See {IVaultDeferredOperationUpgradeable-previewDeposit}
    */
    function previewDeposit(uint256 assets) public view virtual returns (uint256) {
        return _proxiedVault.convertToShares(assets);
    }

    /**
        @notice Proxies the call to the target vault to preview how much underlying the given minting of
        shares would yield

        @dev See {IVaultDeferredOperationUpgradeable-previewMint}
    */
    function previewMint(uint256 shares) public view virtual override returns (uint256) {
        return _proxiedVault.convertToAssets(shares);
    }

    /** 
        @notice Proxies the call to the target vault to preview how much underlying a withdrawal of shares
        would yield

        @dev See {IVaultDeferredOperationUpgradeable-previewRedeem}
    */
    function previewRedeem(uint256 shares) public view virtual override returns (uint256) {
        return _proxiedVault.convertToAssets(shares);
    }

    /** @dev See {IVaultDeferredOperationUpgradeable-mint} */
    function mint(uint256 shares, address receiver) public virtual override returns (uint256) {
        require(shares <= maxMint(receiver), "ERC4626MultiToken: mint more than max");

        uint256 assets = previewMint(shares);
        deposit(assets, receiver);

        return assets;
    }

    /** 
        @notice Exchanges the underlying asset for target vault shares

        @param amount The amount of underlying asset to redeem on the target vault

        @return The amount of target vault shares received
     */
    function _redeemFromTarget(uint256 amount) internal returns (uint256) {
        SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(_proxiedVault), address(_proxiedVault), amount);

        return _proxiedVault.redeem(amount, address(this), address(this));
    }

    /** 
        @notice Exchanges an amount of target vault shares for the underlying asset in the target vault

        @param amount The amount of the other asset to deposit on the target vault

        @return The amount of underlying assets received from the target vault
     */
    function _depositOnTarget(uint256 amount) internal returns (uint256) {
        SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(asset()), address(_proxiedVault), amount);

        return _proxiedVault.deposit(amount, address(this));
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
