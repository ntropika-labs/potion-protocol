/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IOpynOracle.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn contoller
*/
contract MockOpynOracle is IOpynOracle {
    /**
        @inheritdoc IOpynOracle
     */
    function getPrice(
        address /*_asset*/
    ) external pure returns (uint256) {
        return 100000000000; // 1000.0 with 1e8 decimals
    }
}
