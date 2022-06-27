/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title ILifecycleStates

    @author Roberto Cano <robercano>
    
    @notice Handles the lifecycle of the hedging vault and provides the necessary modifiers
    to scope functions that must only work in certain states. It also provides a getter
    to query the current state and an internal setter to change the state
 */

interface ILifecycleStates {
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

    /// EVENTS
    event LifecycleStateChanged(LifecycleState indexed prevState, LifecycleState indexed newState);

    /// FUNCTIONS

    /**
        @notice Function to get the current state of the vault
        @return The current state of the vault
     */
    function getLifecycleState() external view returns (LifecycleState);
}
