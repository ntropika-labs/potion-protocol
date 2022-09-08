/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionLiquidityPool } from "./IPotionLiquidityPool.sol";
import { PotionBuyInfo } from "./IPotionBuyInfo.sol";

/**
    @title IPotionProtocolOracle

    @notice Oracle contract for the Potion Protocol potion buy. It takes care of holding the information
    about the counterparties that will be used to buy a particular potion (potion) with a maximum allowed
    premium

    @dev It is very basic and it just aims to abstract the idea of an Oracle into a separate contract
    but it is still very coupled with PotionProtocolHelperUpgradeable
 */
interface IPotionProtocolOracle {
    /// FUNCTIONS

    /**
        @notice Sets the potion buy information for a specific potion

        @param info The information required to buy a specific potion with a specific maximum premium requirement

        @dev Only the Operator can call this function
     */
    function setPotionBuyInfo(PotionBuyInfo calldata info) external;

    /**
        @notice Gets the potion buy information for a given OToken

        @param underlyingAsset The address of the underlying token of the potion
        @param expirationTimestamp The timestamp when the potion expires

        @return The Potion Buy information for the given potion

        @dev See { PotionBuyInfo }

     */
    function getPotionBuyInfo(address underlyingAsset, uint256 expirationTimestamp)
        external
        view
        returns (PotionBuyInfo memory);
}
