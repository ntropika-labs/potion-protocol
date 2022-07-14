/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../common/EmergencyLockUpgradeable.sol";

/**
    @title TestWrapperEmergencyLock

    @author Roberto Cano <robercano>

    @notice Test wrapper for the EmergencyLockUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperEmergencyLock is EmergencyLockUpgradeable {
    /**
        @notice Initializes the contract
     */
    function initialize(
        address adminAddress,
        address strategistAddress,
        address operatorAddress
    ) external initializer {
        __RolesManager_init_unchained(adminAddress, strategistAddress, operatorAddress);
        __EmergencyLock_init_unchained();
    }
}
