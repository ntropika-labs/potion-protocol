/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

/**  
    @title IAction

    @author Roberto Cano <robercano>

    @notice Interface for the investment actions executed on each investment cycle

    @dev An IAction represents an investment action that can be executed by an external caller.
    This caller will typically be a Vault, but it could also be used in other strategies.

    @dev An Action receives a loan from its caller so it can perform a specific investment action.
    The asset and amount of the loan is indicated in the `enterPosition` call, and the Action can transfer
    up to the indicated amount from the caller for the specified asset, and use it in the investment.
    Once the action indicates that the investment cycle is over, by signaling it through the
    `canPositionBeExited` call, the  caller can call `exitPosition` to exit the position. Upon this call,
    the action will transfer to the caller what's remaining of the loan, and will also return this amount
    as the return value of the `exitPotision` call.

    @dev The Actions does not need to transfer all allowed assets to itself if it is not needed. It could,
    for example, transfer a small amount which is enough to cover the cost of the investment. However,
    when returning the remaining amount, it must take into account the whole amount for the loan. For
    example:
        - The Action enters a position with a loan of 100 units of asset A
        - The Action transfers 50 units of asset A to itself
        - The Action exits the position with 65 units of asset A
        - Because it was allowed to get 100 units of asset A, and it made a profit of 15,
          the returned amount in the `exitPosition` call is 115 units of asset A (100 + 15).
        - If instead of 65 it had made a loss of 30 units, the returned amount would be
          70 units of asset A (100 - 30)

    @dev The above logic helps the caller easily track the profit/loss for the last investment cycle

 */
interface IAction {
    /// EVENTS
    event ActionPositionEntered(address indexed investmentAsset, uint256 amountToInvest);
    event ActionPositionExited(address indexed investmentAsset, uint256 amountReturned);

    /// FUNCTIONS
    /**
        @notice Function called to enter the investment position

        @param investmentAsset The asset available to the action contract for the investment 
        @param amountToInvest The amount of the asset that the action contract is allowed to use in the investment

        @dev When called, the action should have been approved for the given amount
        of asset. The action will retrieve the required amount of asset from the caller
        and invest it according to its logic
     */
    function enterPosition(address investmentAsset, uint256 amountToInvest) external;

    /**
        @notice Function called to exit the investment position

        @param investmentAsset The asset reclaim from the investment position

        @return amountReturned The amount of asset that the action contract received from the caller
        plus the profit or minus the loss of the investment cycle

        @dev When called, the action must transfer all of its balance for `asset` to the caller,
        and then return the total amount of asset that it received from the caller, plus/minus
        the profit/loss of the investment cycle.

        @dev See { IAction } description for more information on `amountReturned`
     */
    function exitPosition(address investmentAsset) external returns (uint256 amountReturned);

    /**
        @notice It inficates if the position can be entered or not

        @param investmentAsset The asset for which position can be entered or not

        @return canEnter true if the position can be entered, false otherwise

        @dev The function checks if the position can be entered for the current block. If it returns
        true then it indicates that the position can be entered at any moment from the current block.
        This invariant only takes into account the current state of the action itself and not any external
        dependendencies that the action may have
     */
    function canPositionBeEntered(address investmentAsset) external view returns (bool canEnter);

    /**
        @notice It indicates if the position can be exited or not

        @param investmentAsset The asset for which position can be exited or not

        @return canExit true if the position can be exited, false otherwise

        @dev The function checks if the position can be exited for the current block. If it returns
        true then it indicates that the position can be exited at any moment from the current block.
        This invariant only takes into account the current state of the action itself and not any external
        dependendencies that the action may have
     */
    function canPositionBeExited(address investmentAsset) external view returns (bool canExit);
}
