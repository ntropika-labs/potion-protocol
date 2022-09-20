/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../common/RolesManagerUpgradeable.sol";

/**
    @title TestWrapperRolesManager

    @author Roberto Cano <robercano>

    @notice Test wrapper for the RolesManagerUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperRolesManager is RolesManagerUpgradeable {
    /**
        @notice Initializes the contract
     */
    function initialize(address adminAddress, address operatorAddress) external initializer {
        __RolesManager_init_unchained(adminAddress, operatorAddress);
    }
}
