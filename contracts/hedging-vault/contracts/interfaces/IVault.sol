/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

/**  
    @title IVault

    @author Roberto Cano <robercano>

    @notice Interface for the a vault that executes investment actions on each investment cycle

    @dev An IVault represents a vault that contains a set of investment actions. When entering the
    position, all the actions in the vault are executed in order, one after the other. If all
    actions succeed, then the position is entered. Once the position can be exited, the investment
    actions are also exited and the profit/loss of the investment cycle is realized.
 */
interface IVault {
    /// EVENTS
    event VaultPositionEntered(uint256 totalPrincipalAmount, uint256 principalAmountInvested);
    event VaultPositionExited(uint256 newPrincipalAmount);

    /// FUNCTIONS
    /**
        @notice Function called to enter the investment position

        @dev When called, the vault will enter the position of all configured actions. For each action
        it will approve each action for the configured principal percentage so each action can access
        the funds in order to execute the specific investment strategy

        @dev Once the Vault enters the investment position no more immediate deposits or withdrawals
        are allowed
     */
    function enterPosition() external;

    /**
        @notice Function called to exit the investment position

        @return newPrincipalAmount The final amount of principal that is in the vault after the actions
        have exited their positions

        @dev When called, the vault will exit the position of all configured actions. Each action will send
        back the remaining funds (including profit or loss) to the vault
     */
    function exitPosition() external returns (uint256 newPrincipalAmount);

    /**
        @notice It inficates if the position can be entered or not

        @return canEnter true if the position can be entered, false otherwise

        @dev The function checks if the position can be entered for the current block. If it returns
        true then it indicates that the position can be entered at any moment from the current block.
        This invariant only takes into account the current state of the vault itself and not any external
        dependendencies that the vault or the actions may have
     */
    function canPositionBeEntered() external view returns (bool canEnter);

    /**
        @notice It indicates if the position can be exited or not

        @return canExit true if the position can be exited, false otherwise

        @dev The function checks if the position can be exited for the current block. If it returns
        true then it indicates that the position can be exited at any moment from the current block.
        This invariant only takes into account the current state of the vault itself and not any external
        dependendencies that the vault or the actions may have
     */
    function canPositionBeExited() external view returns (bool canExit);
}
