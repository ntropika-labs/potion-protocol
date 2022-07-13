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

    /**
        @notice Percentages of the principal assigned to each action in the vault

        @dev The percentages are stored in the form of a uint256 with
        `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    uint256[] private _principalPercentages;

    /**
        @notice Sum of all the principal percentages

        @dev Used to do sanity checks on the operations of the vault
     */
    uint256 private _totalPrincipalPercentages;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Initializes the list of actions and its percentages
        
        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize any other contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __ActionsManager_init_unchained(IAction[] calldata actions, uint256[] calldata principalPercentages)
        internal
        onlyInitializing
    {
        _actions = new IAction[](actions.length);
        for (uint256 i = 0; i < actions.length; i++) {
            _actions[i] = actions[i];
        }

        __setPrincipalPercentages(principalPercentages);

        emit ActionsAdded(_actions);
    }

    /// FUNCTIONS

    /**
        @inheritdoc IActionsManager
     */
    function setPrincipalPercentages(uint256[] calldata newPrincipalPercentages) external override onlyStrategist {
        __setPrincipalPercentages(newPrincipalPercentages);
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
        @inheritdoc IActionsManager
     */
    function getPrincipalPercentages() public view returns (uint256[] memory) {
        return _principalPercentages;
    }

    /**
        @inheritdoc IActionsManager
     */
    function getPrincipalPercentage(uint256 actionIndex) public view returns (uint256 percentage) {
        if (actionIndex < _principalPercentages.length) {
            percentage = _principalPercentages[actionIndex];
        }
    }

    /**
        @inheritdoc IActionsManager
     */
    function getTotalPrincipalPercentages() public view returns (uint256) {
        return _totalPrincipalPercentages;
    }

    /// INTERNALS

    /**
        @notice See { setPrincipalPercentages }
     */
    function __setPrincipalPercentages(uint256[] calldata newPrincipalPercentages) private {
        uint256 numActions = getActionsLength();

        if (newPrincipalPercentages.length != numActions) {
            revert PrincipalPercentagesMismatch(newPrincipalPercentages.length, numActions);
        }

        if (_principalPercentages.length != numActions) {
            _principalPercentages = new uint256[](newPrincipalPercentages.length);
        }

        _totalPrincipalPercentages = 0;

        for (uint256 i = 0; i < newPrincipalPercentages.length; i++) {
            if (newPrincipalPercentages[i] == 0 || newPrincipalPercentages[i] > PercentageUtils.PERCENTAGE_100) {
                revert PrincipalPercentageOutOfRange(i, newPrincipalPercentages[i]);
            }

            _principalPercentages[i] = newPrincipalPercentages[i];
            _totalPrincipalPercentages += newPrincipalPercentages[i];
        }

        if (_totalPrincipalPercentages > PercentageUtils.PERCENTAGE_100) {
            revert PrincipalPercentagesSumMoreThan100(_totalPrincipalPercentages);
        }

        emit PrincipalPercentagesUpdated(newPrincipalPercentages);
    }

    /**
       @dev This empty reserved space is put in place to allow future versions to add new
       variables without shifting down storage in the inheritance chain.
       See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     
       @dev The size of the gap plus the size of the storage variables defined
       above must equal 50 storage slots
     */
    uint256[47] private __gap;
}
