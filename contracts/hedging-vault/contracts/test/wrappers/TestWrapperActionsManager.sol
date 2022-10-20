/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;
import "../../vault/ActionsManagerUpgradeable.sol";

/**
    @title TestWrapperActionsManager

    @author Roberto Cano <robercano>

    @notice Test wrapper for the ActionsManagerUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperActionsManager is ActionsManagerUpgradeable {
    /**
        @notice Initializes the contract
     */
    function initialize(IAction[] calldata actions) external initializer {
        __ActionsManager_init_unchained(actions);
    }
}
