/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**    
    @notice Interface for the investment actions executed on each investment cycle
 */
interface IAction {
    function enterPosition() external;

    function exitPosition() external;
}
