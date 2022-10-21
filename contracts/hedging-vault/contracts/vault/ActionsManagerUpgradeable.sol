/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;
import { IActionsManager } from "../interfaces/IActionsManager.sol";
import { IAction } from "../interfaces/IAction.sol";
import { RolesManagerUpgradeable } from "../common/RolesManagerUpgradeable.sol";
import "../library/PercentageUtils.sol";

/**
    @title ActionsManagerUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Contains the list of actions that will be used to enter and exit a position in the vault

    @dev See { IActionsManager }

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract

    @dev The storage gap is not used here as this contract is not expected to change in the future
 */

contract ActionsManagerUpgradeable is RolesManagerUpgradeable, IActionsManager {
    /// STORAGE

    /**
        @notice The list of actions to be executed in the Vault.
     */
    IAction[] private _actions;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Initializes the list of actions and its percentages
        
        @param actions The list of actions to be executed in the Vault

        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize any other contract
     */
    /* solhint-disable-next-line func-name-mixedcase */
    function __ActionsManager_init_unchained(IAction[] calldata actions) internal onlyInitializing {
        _actions = new IAction[](actions.length);
        for (uint256 i = 0; i < actions.length; i++) {
            _actions[i] = actions[i];
        }

        emit ActionsAdded(_actions);
    }

    /// GETTERS

    /**
        @inheritdoc IActionsManager
    */
    function getActionsLength() public view returns (uint256) {
        return _actions.length;
    }

    /**
        @inheritdoc IActionsManager
     */
    function getAction(uint256 index) public view returns (IAction) {
        return _actions[index];
    }

    /**
       @dev This empty reserved space is put in place to allow future versions to add new
       variables without shifting down storage in the inheritance chain.
       See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     
       @dev The size of the gap plus the size of the storage variables defined
       above must equal 50 storage slots
     */
    uint256[49] private __gap;
}
