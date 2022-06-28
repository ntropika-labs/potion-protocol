/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;
import { IActionsContainer } from "../interfaces/IActionsContainer.sol";
import { IAction } from "../interfaces/IAction.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
    @title ActionsContainerUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Contains the list of actions that will be used to enter and exit a position in the vault

    @dev See { IActionsContainer }

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract

    @dev The storage gap is not used here as this contract is not expected to change in the future
 */

contract ActionsContainerUpgradeable is Initializable, IActionsContainer {
    /// STORAGE

    /**
        @notice The list of actions to be executed in the Vault.
     */
    IAction[] private _actions;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Initializes the current state to Unlocked

        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize any other contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __ActionsContainer_init_unchained(IAction[] calldata actions) internal onlyInitializing {
        _actions = new IAction[](actions.length);
        for (uint256 i = 0; i < actions.length; i++) {
            _actions[i] = actions[i];
        }

        emit ActionsAdded(_actions);
    }

    /// FUNCTIONS

    /**
        @notice See { IActionsContainer }
    */
    function getActionsLength() public view returns (uint256) {
        return _actions.length;
    }

    /**
        @notice See { IActionsContainer }
     */
    function getAction(uint256 index) public view returns (IAction) {
        return _actions[index];
    }
}
