// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ERC4626MultiTokenUpgradeable.sol";
import "./interfaces/IERC4626DepositsProxyUpgradeable.sol";
import "./interfaces/IERC4626Upgradeable.sol";

/**
    @dev Deposits proxy that takes care of handling deposits for a target vault. It accumulates the deposits
    and then forwards them to the target vault when the `depositOnproxiedVault` function is called.

    @dev Upon deposit in this vault, the proxy will mint a receipt to the depositor containing the amount of assets
    deposited and an id that can be used to identify extra information relative to the deposit: for example it can
    encode the round number in which the deposit was made for a vault that runs cyclically with rounds.

    @dev After calling `depositOnproxiedVault`, the proxy will receive the corresponding amount of target vault shares
    and will keep them in the contract. It is up to the derived contract to decide how to handle these shares.
 
    @author Roberto Cano <robercano>
 */
abstract contract ERC4626DepositsProxyUpgradeable is
    Initializable,
    ERC4626MultiTokenUpgradeable,
    IERC4626DepositsProxyUpgradeable
{
    IERC4626Upgradeable private _proxiedVault;

    /**
     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
     */
    function __ERC4626DeferredDeposits_init(address proxiedVault) internal onlyInitializing {
        __ERC4626DeferredDeposits_init_unchained(proxiedVault);
    }

    function __ERC4626DeferredDeposits_init_unchained(address proxiedVault) internal onlyInitializing {
        _proxiedVault = IERC4626Upgradeable(proxiedVault);
    }

    /** @dev See {IERC4626DeferredDepositsUpgradeable-vault} */
    function vault() public view returns (address vaultAddress) {
        return address(_proxiedVault);
    }

    /** @dev See {IERC4626DeferredDepositsUpgradeable-convertToShares} */
    function convertToShares(uint256 assets)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256 shares)
    {
        return _proxiedVault.convertToShares(assets);
    }

    /** @dev See {IERC4626DeferredDepositsUpgradeable-maxDeposit} */
    function maxDeposit(address receiver)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.maxDeposit(receiver);
    }

    /** @dev See {IERC4626DeferredDepositsUpgradeable-maxMint} */
    function maxMint(address receiver)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.maxMint(receiver);
    }

    /** @dev See {IERC4626DeferredDepositsUpgradeable-previewDeposit} */
    function previewDeposit(uint256 assets)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.convertToShares(assets);
    }

    /** @dev See {IERC4626DeferredDepositsUpgradeable-previewMint} */
    function previewMint(uint256 shares)
        public
        view
        virtual
        override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable)
        returns (uint256)
    {
        return _proxiedVault.convertToAssets(shares);
    }

    /**
     * @dev Deposits the available funds into the main vault, receiving back an amount
     *      of target vault shares
     */
    function _mintTargetShares() internal {
        uint256 amount = totalAssets();
        if (amount > 0) {
            SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(asset()), address(_proxiedVault), amount);
            _proxiedVault.deposit(amount, address(this));
        }
    }

    /**
     * @dev Redeems the available shares into the main vault, receiving back an amount
     *      of underlying tokens
     */
    function _redeemTargetShares() internal {
        uint256 amount = totalAssets();
        if (amount > 0) {
            SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(_proxiedVault), address(_proxiedVault), amount);
            _proxiedVault.redeem(amount, address(this), address(this));
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
