/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IRolesManager } from "../interfaces/IRolesManager.sol";
import { ILifecycleStates } from "../interfaces/ILifecycleStates.sol";
import { IEmergencyLock } from "../interfaces/IEmergencyLock.sol";
import { IRefundsHelper } from "../interfaces/IRefundsHelper.sol";
import { IFeeManager } from "../interfaces/IFeeManager.sol";

/**  
    @title IVault

    @author Roberto Cano <robercano>

    @notice Interface for the V0 of the vault that executes investment actions on each investment
            cycle
 */
interface IVaultV0 {
    /// STRUCTS

    /**
        @notice Strategy to execute when entering the position

        @dev It consists of a list of actions indexes to be executed in the order indicated in the array
             upon entering the position. This can be used to select the specific actions to be executed
             when implementing fallback strategies
     */
    struct Strategy {
        uint256[] actionsIndexes;
    }

    /// EVENTS
    event VaultPositionEntered(uint256 totalPrincipalAmount, uint256 principalAmountInvested, Strategy strategy);
    event VaultPositionExited(uint256 newPrincipalAmount, Strategy strategy);

    /// ERRORS
    error InvestmentTotalTooHigh(uint256 actualAmountInvested, uint256 maxAmountToInvest);

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
        @notice Function called to enter the investment position

        @param strategy Strategy to execute when entering the position, as a list of actions indexes

        @dev See { enterPosition } for more details

        @dev This variation of enter position allows to specify a strategy to execute when entering, as a list
             of actions indexes to be executed in the order indicated in the array. This can be used to select
                the specific actions to be executed when implementing fallback strategies
     */
    function enterPositionWith(Strategy calldata strategy) external;

    /**
        @notice Function called to exit the investment position

        @return newPrincipalAmount The final amount of principal that is in the vault after the actions
        have exited their positions

        @dev When called, the vault will exit the position of all configured actions. Each action will send
        back the remaining funds (including profit or loss) to the vault
     */
    function exitPosition() external returns (uint256 newPrincipalAmount);

    /**
        @notice It indicates if the position can be entered or not

        @return canEnter true if the position can be entered, false otherwise

        @dev The function checks if the position can be entered for the current block. If it returns
        true then it indicates that the position can be entered at any moment from the current block.
        This invariant only takes into account the current state of the vault itself and not any external
        dependendencies that the vault or the actions may have
     */
    function canPositionBeEntered() external view returns (bool canEnter);

    /**
        @notice It indicates if the position can be entered or not with the given strategy

        @return canEnter true if the position can be entered, false otherwise

        @dev The function checks if the position can be entered for the current block and the given set of
        action indexes. If it returns true then it indicates that the position can be entered at any moment
        from the current block. This invariant only takes into account the current state of the vault itself
        and not any external dependendencies that the vault or the actions may have
     */
    function canPositionBeEnteredWith(Strategy calldata strategy) external view returns (bool canEnter);

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
