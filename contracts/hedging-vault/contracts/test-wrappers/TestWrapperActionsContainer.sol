/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;
import "../vault/ActionsContainerUpgradeable.sol";

/**
    @title TestWrapperActionsContainer

    @author Roberto Cano <robercano>

    @notice Test wrapper for the ActionsManagerUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperActionsContainer is ActionsContainerUpgradeable {
    /**
        @notice Initializes the contract
     */
    function initialize(IAction[] calldata actions) external initializer {
        __ActionsContainer_init_unchained(actions);
    }
}
