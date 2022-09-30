/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./interfaces/IERC4626CapUpgradeable.sol";

import { RolesManagerUpgradeable } from "../common/RolesManagerUpgradeable.sol";
import { ERC4626Upgradeable } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/extensions/ERC4626Upgradeable.sol";
import { MathUpgradeable } from "@openzeppelin/contracts-upgradeable-4.7.3/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

/**
    @title ERC4626CapUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Adds a cap to the amount of principal that the vault can manage, thus imposing
    a restriction on deposits and mints

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract

    @dev No storage gaps have been added as the functionlity of this contract is considered to be
    final and there is no need to add more storage variables
 */

contract ERC4626CapUpgradeable is ERC4626Upgradeable, RolesManagerUpgradeable, IERC4626CapUpgradeable {
    //STORAGE

    /**
        @notice Maximum amount of principal that the vault can manage
     */
    uint256 private _cap;

    // UPGRADEABLE INITIALIZER

    /**
        @notice Unchained initializer

        @dev This contract replaces the ERC4626Upgradeable contract. The ERC4626Upgradeable 
        contracts MUST NOT be used anywhere else in the inheritance chain. Assuming this,
        we can safely initialize the ERC4626Upgradeable contract here

        @dev The name of the init function is marked as `_unchained` because we assume that the
        ERC4626Upgradeable contract is not used anywhere else, and thus the functionality is 
        that of an unchained initialization

        @dev The RolesManager contract MUST BE initialized in the Vault/Action contract as it
        it shared among other helper contracts
     */
    /* solhint-disable-next-line func-name-mixedcase */
    function __ERC4626Cap_init_unchained(uint256 cap_, address asset_) internal onlyInitializing {
        __ERC4626_init_unchained(IERC20MetadataUpgradeable(asset_));

        _setVaultCap(cap_);
    }

    // FUNCTIONS

    /**
        @notice Updates the cap for the vault principal

        @param newCap New cap for the vault principal

        @dev Can only be called by the Admin
     */
    function setVaultCap(uint256 newCap) external onlyAdmin {
        _setVaultCap(newCap);
    }

    /**
        @notice Returns the current cap for the vault principal

        @return Current cap for the vault principal
     */
    function getVaultCap() external view returns (uint256) {
        return _cap;
    }

    /**
        @notice Returns the maximum amount of principal that a user can deposit into the vault at
        this moment. This is a function of the vault cap and the amount of principal that the vault
        is currently managing. As we don't want the vault to manage more than `_cap`, the
        value returned here is the difference between the cap and the current amount of principal when
        the cap is higher than the principal. It will return 0 otherwise

        @param receiver The receiver of the shares after the deposit. Only used to call the parent's
        `maxDeposit`

        @dev The only input parameter is unnamed because it is not used in the function
     */
    function maxDeposit(address receiver)
        public
        view
        virtual
        override(ERC4626Upgradeable, IERC4626Upgradeable)
        returns (uint256)
    {
        // First check if the OZ ERC4626 vault allows deposits at this time. It usually has an edge
        // case in which deposits are disabled and we want to abide by that logic. Getting the minimum here
        // ensures that we get either 0 or the amount defined in principal Cap
        uint256 currentCap = MathUpgradeable.min(super.maxDeposit(receiver), _cap);

        if (currentCap < totalAssets()) {
            return 0;
        }

        return currentCap - totalAssets();
    }

    /**
        @notice Returns the maximum amount of shares that can be minted, taking into account the
        current deposit cap

        @param receiver The receiver of the shares after the minting. Only used to call the parent's
        maxMint

        @dev If the total number of assets is grater than the cap then no more shares can be minted

        @dev The maximum number of shares is calculated from the maximum amount of principal that can
        still be deposited in the vault. This calculation rounds down to the nearest integer, ensuring
        than requesting to mint that number of shares will always require an amount equal or less than
        the current existing deposit cap
     */
    function maxMint(address receiver)
        public
        view
        virtual
        override(ERC4626Upgradeable, IERC4626Upgradeable)
        returns (uint256)
    {
        if (_cap < totalAssets()) {
            return 0;
        }

        uint256 maxAssetsAmount = MathUpgradeable.min(super.maxMint(receiver), _cap - totalAssets());

        return _convertToShares(maxAssetsAmount, MathUpgradeable.Rounding.Down);
    }

    /// INTERNALS

    /**
        @notice See { setVaultCap }
     */
    function _setVaultCap(uint256 newCap) internal {
        uint256 prevCap = _cap;

        _cap = newCap;

        emit VaultCapChanged(prevCap, newCap);
    }
}
