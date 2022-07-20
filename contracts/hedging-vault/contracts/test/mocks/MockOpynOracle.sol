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
    mapping(address => uint256) public pricePerAsset;

    /**
        @inheritdoc IOpynOracle
     */
    function getPrice(address asset) external view returns (uint256) {
        return pricePerAsset[asset];
    }

    function setStablePrice(address asset, uint256 price) external {
        pricePerAsset[asset] = price;
    }
}
