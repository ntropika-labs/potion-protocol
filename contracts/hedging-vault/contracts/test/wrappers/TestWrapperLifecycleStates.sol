/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../common/LifecycleStatesUpgradeable.sol";

/**
    @title TestWrapperLifecycleStates

    @author Roberto Cano <robercano>

    @notice Test wrapper for the LifecycleStatesUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperLifecycleStates is LifecycleStatesUpgradeable {
    /**
        @notice Initializes the contract
     */
    function initialize() external initializer {
        __LifecycleStates_init_unchained();
    }

    /**
        @notice Exposes the internal `_setLifecycleState` function
     */
    function setLifecycleState(LifecycleState newState) external {
        _setLifecycleState(newState);
    }
}
