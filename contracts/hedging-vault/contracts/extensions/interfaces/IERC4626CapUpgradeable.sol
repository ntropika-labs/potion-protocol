/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IRolesManager } from "../../interfaces/IRolesManager.sol";
import { IERC4626Upgradeable } from "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC4626Upgradeable.sol";

/**
    @title IERC4626CapUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Adds a cap to the amount of principal that the vault can manage, thus imposing
    a restriction on deposits and mints

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract

    @dev No storage gaps have been added as the functionlity of this contract is considered to be
    final and there is no need to add more storage variables
 */

interface IERC4626CapUpgradeable is IERC4626Upgradeable, IRolesManager {
    // EVENTS
    event VaultCapChanged(uint256 indexed prevCap, uint256 indexed newCap);

    // FUNCTIONS

    /**
        @notice Updates the cap for the vault principal

        @param newCap New cap for the vault principal

        @dev Can only be called by the Admin
     */
    function setVaultCap(uint256 newCap) external;

    /**
        @notice Returns the current cap for the vault principal

        @return Current cap for the vault principal
     */
    function getVaultCap() external view returns (uint256);
}
