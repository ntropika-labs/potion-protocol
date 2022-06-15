/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
    @title LifecycleStates

    @notice Handles the lifecycle of the hedging vault and provides the necessary modifiers
    to scope functions that must only work in certain states. It also provides a getter
    to query the current state and an internal setter to change the state

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract
 */

contract LifecycleStates is Initializable {
    /// STATES

    /**
        @notice States defined for the vault. Although the exact meaning of each state is
        dependent on the HedgingVault contract, the following assumptions are made here:
            - Unlocked: the vault accepts immediate deposits and withdrawals and the specific
            configuration of the next investment strategy is not yet known.
            - Committed: the vault accepts immediate deposits and withdrawals but the specific
            configuration of the next investment strategy is already known
            - Locked: the vault is locked and cannot accept immediate deposits or withdrawals. All
            of the assets managed by the vault are locked in it. It could accept deferred deposits
            and withdrawals though
     */
    enum LifecycleState {
        Unlocked,
        Committed,
        Locked
    }

    /// STORAGE

    /**
        The current state of the vault
     */
    LifecycleState public currentState;

    /// UPGRADEABLE INITIALIZERS
    // solhint-disable-next-line func-name-mixedcase
    function __LifecycleStates_init_unchained() internal onlyInitializing {
        currentState = LifecycleState.Unlocked;
    }

    /// MODIFIERS

    /**
        @notice Modifier to scope functions to only be accessible when the state is Unlocked
     */
    modifier onlyUnlocked() {
        require(currentState == LifecycleState.Unlocked, "Vault is not unlocked");
        _;
    }

    /**
        @notice Modifier to scope functions to only be accessible when the state is Committed
     */
    modifier onlyCommitted() {
        require(currentState == LifecycleState.Committed, "Vault is not commited");
        _;
    }

    /**
        @notice Modifier to scope functions to only be accessible when the state is Locked
     */
    modifier onlyLocked() {
        require(currentState == LifecycleState.Locked, "Vault is not locked");
        _;
    }

    /// FUNCTIONS

    /**
        @notice Function to set the new state of the vault
        @param newState The new state of the vault
     */
    function _setState(LifecycleState newState) internal {
        currentState = newState;
    }

    /**
        @notice Function to get the current state of the vault
        @return The current state of the vault
     */
    function getState() public view returns (LifecycleState) {
        return currentState;
    }
}
