/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./BaseVaultUpgradeable.sol";
import "../versioning/HedgingVaultV0.sol";

/**
    @title HedgingVault

    @author Roberto Cano <robercano>
    
    @notice Hedging Vault contract that manages the vault and its actions...

    TODO

    @dev The HedgingVaultVx interfaces are used to make explicit any upgrades made to the HedgingVault.
    For each new version, a new interface with a new version number is created and then added at the end
    of the inheritance chain. This makes sure that the storage layouts are compatible among the different
    versions.

    @dev See {BaseVaultUpgradeable}
 */

contract HedgingVault is BaseVaultUpgradeable {
    // Empty on purpose
    uint256 public dummy;
}
