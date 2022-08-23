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
    /**
        @inheritdoc IOpynController
    */
    function isSettlementAllowed(
        address /*_otoken*/
    ) external pure returns (bool) {
        return true;
    }

    /**
        @inheritdoc IOpynController
    */
    function getPayout(
        address, /*_otoken*/
        uint256 /*_amount*/
    ) external pure returns (uint256) {
        return 30000000000; // 300.0 USDC with 8 decimals
    }

    /**
        @inheritdoc IOpynController
    */
    function operate(
        ActionArgs[] memory /*_actions*/
    ) external {
        // do nothing
    }
}