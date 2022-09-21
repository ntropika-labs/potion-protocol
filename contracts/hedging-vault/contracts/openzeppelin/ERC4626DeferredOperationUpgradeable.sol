// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ERC4626MultiTokenUpgradeable.sol";
import "./interfaces/IERC4626DeferredOperationUpgradeable.sol";
import "./interfaces/IERC4626Upgradeable.sol";

/**
    @dev Deferred operations proxy that takes care of handling deposits/withdrawals for a target vault.
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
abstract contract ERC4626DeferredOperationUpgradeable is
    Initializable,
    ERC4626MultiTokenUpgradeable,
    IERC4626DeferredOperationUpgradeable
{
    // STORAGE
    IERC4626Upgradeable private _proxiedVault;

    // UPGRADABLE INITIALIZER

    /**
     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
     */
    function __ERC4626DeferredOperation_init(address proxiedVault) internal onlyInitializing {
        __ERC4626DeferredOperation_init_unchained(proxiedVault);
    }

    function __ERC4626DeferredOperation_init_unchained(address proxiedVault) internal onlyInitializing {
        _proxiedVault = IERC4626Upgradeable(proxiedVault);
    }

    // PUBLIC FUNCTIONS

    /** @dev See {IERC4626MultiTokenUpgradeable-vault} */
    function vault() public view returns (address vaultAddress) {
        return address(_proxiedVault);
    }

    /** @dev See {IERC4626MultiTokenUpgradeable-convertToShares} */
    function convertToShares(uint256 assets)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256 shares)
    {
        return _proxiedVault.convertToShares(assets);
    }

    /** @dev See {IERC4626MultiTokenUpgradeable-maxDeposit} */
    function maxDeposit(address receiver)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.maxDeposit(receiver);
    }

    /** @dev See {IERC4626MultiTokenUpgradeable-maxMint} */
    function maxMint(address receiver)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.maxMint(receiver);
    }

    /** @dev See {IERC4626MultiTokenUpgradeable-previewDeposit} */
    function previewDeposit(uint256 assets)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.convertToShares(assets);
    }

    /** @dev See {IERC4626MultiTokenUpgradeable-previewMint} */
    function previewMint(uint256 shares)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.convertToAssets(shares);
    }

    /** @dev See {IERC4626MultiTokenUpgradeable-previewRedeem} */
    function previewRedeem(uint256 shares)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.convertToAssets(shares);
    }

    /** 
        @notice Exchanges the underlying asset for the other asset in the target vault

        @dev The implementation is dependent on the derived contract and the specific functionality
        required
     */
    function _operate() internal virtual;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
