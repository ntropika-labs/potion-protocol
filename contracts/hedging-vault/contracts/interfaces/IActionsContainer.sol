/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IAction } from "../interfaces/IAction.sol";

/**
    @title IActionsContainerUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Contains the list of actions that will be used to enter and exit a position in the vault
 */
interface IActionsContainer {
    /// EVENTS
    event ActionsAdded(IAction[] actions);

    /// FUNCTIONS

    /**
        @notice Returns the number of actions available

        @return The number of actions available
    */
    function getActionsLength() external view returns (uint256);

    /**
        @notice Returns the action at the given index, starting at 0

        @param index The index of the action to return

        @return The action at the given index
     */
    function getAction(uint256 index) external view returns (IAction);
}
