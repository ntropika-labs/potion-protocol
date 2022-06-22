/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { IAction } from "../interfaces/IAction.sol";

/**
    @title ActionsManagerUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Base contract for the Vault contract. It serves as a commonplace to take care of
    the inheritance order and the storage order of the contracts, as this is very important
    to keep consistent in order to be able to upgrade the contracts. The order of the contracts
    is also important to not break the C3 lineralization of the inheritance hierarchy.

    @dev The IBaseVaultVx interfaces are used to make explicit any upgrades made to the BaseVault
    and Hedging Vault. For each new version, a new interface with a new version number is created
    and then added at the end of the inheritance chain. This makes sure that the storage layouts
    are compatible among the different versions.

    @dev Some of the contracts in the base hierarchy contain storage gaps to account for upgrades
    needed in those contracts. Those gaps allow to add new storage variables without shifting
    variables down the inheritance chain down. The gap is not used here and instead the versioned
    interfaces approach is chosen because it is more explicit.

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract
 */

contract ActionsManagerUpgradeable is Initializable {
    /// STORAGE

    /**
        @notice The list of actions to be executed in the Vault.
     */
    IAction[] private _actions;

    /// EVENTS
    event ActionsAdded(IAction[] actions);

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Initializes the current state to Unlocked

        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize the RolesManagerUpgradeable contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __ActionsManager_init_unchained(address[] calldata actions) internal onlyInitializing {
        _actions = new IAction[](actions.length);
        for (uint256 i = 0; i < actions.length; i++) {
            _actions[i] = IAction(actions[i]);
        }

        emit ActionsAdded(_actions);
    }

    /// FUNCTIONS

    /**
        @notice Returns the number of actions available

        @return The number of actions available
    */
    function getActionsLength() public view returns (uint256) {
        return _actions.length;
    }

    /**
        @notice Returns the action at the given index, starting at 0

        @param index The index of the action to return

        @return The action at the given index
     */
    function getAction(uint256 index) public view returns (IAction) {
        return _actions[index];
    }
}
