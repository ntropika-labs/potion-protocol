/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { RolesManagerUpgradeable } from "./RolesManagerUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

/**
    @title EmergencyLock

    @notice Helper contract that allows the Admin to pause all the functionality of the vault in case
    of an emergency

    @dev No storage gaps have been added as the functionlity of this contract is considered to be
    final and there is no need to add more storage variables
 */

contract EmergencyLockUpgradeable is RolesManagerUpgradeable, PausableUpgradeable {
    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Unchained initializer

        @dev This contract does not need to initialize anything for itself. This contract
        replaces the Pausable contract. The Pausable contracts MUST NOT be used anywhere
        else in the inheritance chain. Assuming this, we can safely initialize the Pausable
        contract here

        @dev The name of the init function is marked as `_unchained` because we assume that the
        Pausable contract is not used anywhere else, and thus the functionality is that of an
        unchained initialization

        @dev The RolesManager contract MUST BE initialized in the Vault/Action contract as it
        it shared among other helper contracts
     */
    // solhint-disable-next-line func-name-mixedcase
    function __EmergencyLock_init_unchained() internal onlyInitializing {
        __Pausable_init_unchained();
    }

    // FUNCTIONS

    /**
        @notice Pauses the contract

        @dev Only functions marked with the `whenPaused` modifier will be executed
        when the contract is paused

        @dev This function can only be called when the contract is Unpaused
     */
    function pause() external onlyAdmin {
        _pause();
    }

    /**
        @notice Unpauses the contract

        @dev Only functions marked with the `whenUnpaused` modifier will be executed
        when the contract is unpaused

        @dev This function can only be called when the contract is Paused
     */
    function unpause() external onlyAdmin {
        _unpause();
    }
}
