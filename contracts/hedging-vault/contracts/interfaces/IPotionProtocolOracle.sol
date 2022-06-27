/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionLiquidityPool } from "./IPotionLiquidityPool.sol";

/**
    @title IPotionProtocolOracle

    @notice Oracle contract for the Potion Protocol potion buy. It takes care of holding the information
    about the counterparties that will be used to buy a particular potion (potion) with a maximum allowed
    premium

    @dev It is very basic and it just aims to abstract the idea of an Oracle into a separate contract
    but it is still very coupled with PotionProtocolHelperUpgradeable
 */
interface IPotionProtocolOracle {
    /**
        @notice The information required to buy a specific potion with a specific maximum premium requirement

        @custom:member potion The address of the potion (otoken) to buy
        @custom:member sellers The list of liquidity providers that will be used to buy the potion
        @custom:member expectedPremiumInUSDC The expected premium to be paid for the given order size
                       and the given sellers, in USDC
        @custom:member totalSizeInPotions The total number of potions to buy using the given sellers list
     */
    struct PotionBuyInfo {
        address potion;
        IPotionLiquidityPool.CounterpartyDetails[] sellers;
        uint256 expectedPremiumInUSDC;
        uint256 totalSizeInPotions;
    }

    /// FUNCTIONS

    /**
        @notice Sets the potion buy information for a specific potion

        @param info The potion buy information for the potion

        @dev Only the Operator can call this function

        @dev See { PotionBuyInfo }
     */
    function setPotionBuyInfo(PotionBuyInfo calldata info) external;

    /**
        @notice Gets the potion buy information for a given OToken

        @param potion The address of the potion to buy from

        @return The Potion Buy information for the given potion

     */
    function getPotionBuyInfo(address potion) external view returns (PotionBuyInfo memory);
}
