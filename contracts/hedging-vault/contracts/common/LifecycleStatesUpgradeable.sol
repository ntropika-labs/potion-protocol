/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../interfaces/ILifecycleStates.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
    @title LifecycleStatesUpgradeable

    @author Roberto Cano <robercano>
    
    @notice See { ILifecycleStates }

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract

    @dev No storage gaps have been added as the functionlity of this contract is considered to be
    final and there is no need to add more storage variables. The LifecycleState enumeration
    can be safely extended without affecting the storage
 */

contract LifecycleStatesUpgradeable is Initializable, ILifecycleStates {
    /// STORAGE

    /**
         @notice The current state of the vault
     */
    LifecycleState private _state;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Initializes the current state to Unlocked

        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize the RolesManagerUpgradeable contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __LifecycleStates_init_unchained() internal onlyInitializing {
        _state = LifecycleState.Unlocked;
    }

    /// MODIFIERS

    /**
        @notice Modifier to scope functions to only be accessible when the state is Unlocked
     */
    modifier onlyUnlocked() {
        require(_state == LifecycleState.Unlocked, "State is not Unlocked");
        _;
    }

    /**
        @notice Modifier to scope functions to only be accessible when the state is Committed
     */
    modifier onlyCommitted() {
        require(_state == LifecycleState.Committed, "State is not Commited");
        _;
    }

    /**
        @notice Modifier to scope functions to only be accessible when the state is Locked
     */
    modifier onlyLocked() {
        require(_state == LifecycleState.Locked, "State is not Locked");
        _;
    }

    /// FUNCTIONS

    /**
        @notice Function to set the new state of the vault
        @param newState The new state of the vault
     */
    function _setLifecycleState(LifecycleState newState) internal {
        LifecycleState prevState = _state;

        _state = newState;

        emit LifecycleStateChanged(prevState, newState);
    }

    /**
        @inheritdoc ILifecycleStates
     */
    function getLifecycleState() public view returns (LifecycleState) {
        return _state;
    }
}
