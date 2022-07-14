/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IAction } from "../interfaces/IAction.sol";

/**
    @title IActionsManager

    @author Roberto Cano <robercano>
    
    @notice Contains the list of actions that will be used to enter and exit a position in the vault
 */
interface IActionsManager {
    /// EVENTS
    event ActionsAdded(IAction[] actions);
    event PrincipalPercentagesUpdated(uint256[] _principalPercentages);

    /// ERRORS
    error PrincipalPercentagesMismatch(
        uint256 _principalPercentagesLength,
        uint256 _principalPercentagesLengthExpected
    );
    error PrincipalPercentageOutOfRange(uint256 index, uint256 value);
    error PrincipalPercentagesSumMoreThan100(uint256 totalSumOfPercentages);

    /// FUNCTIONS

    /**
        @notice Sets the new percentages of the principal assigned to each action in the vault

        @dev Reverts if the number of percentages is not the same as the number of actions in the vault
        @dev Reverts if any of the percentages is not between 0% and 100%
        @dev Reverts if the sum of all percentages is more than 100%
        @dev Each percentage is a fixed point number with `PercentageUtils.PERCENTAGE_DECIMALS` decimals

     */
    function setPrincipalPercentages(uint256[] calldata newPrincipalPercentages) external;

    /// GETTERS

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

    /**
        @notice Returns the percentages of the principal assigned to each action in the vault

        @return The percentages of the principal assigned to each action in the vault
     */
    function getPrincipalPercentages() external view returns (uint256[] memory);

    /**
        @notice Returns the percentage of the principal assigned to the action with the given index, starting at 0

        @return The percentage of the principal assigned to the action with the given index

        @dev The percentage is stored in the form of a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
        @dev if the index is out of range the function returns 0
     */
    function getPrincipalPercentage(uint256 actionIndex) external view returns (uint256);

    /**
        @notice Returns the total sum of the percentages of the principal assigned to each action in the vault

        @return The total sum of the percentages of the principal assigned to each action in the vault
     */
    function getTotalPrincipalPercentages() external view returns (uint256);
}
