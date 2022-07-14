/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IOpynController.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn contoller
*/
contract MockOpynController is IOpynController {
    function isSettlementAllowed(
        address /*_otoken*/
    ) external pure returns (bool) {
        return true;
    }
}
