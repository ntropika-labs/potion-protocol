/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title EmergencyLock

    @author Roberto Cano <robercano>
    
    @notice Helper contract that allows the Admin to pause all the functionality of the vault in case
    of an emergency
 */

interface IEmergencyLock {
    // FUNCTIONS

    /**
        @notice Pauses the contract
     */
    function pause() external;

    /**
        @notice Unpauses the contract
     */
    function unpause() external;
}
