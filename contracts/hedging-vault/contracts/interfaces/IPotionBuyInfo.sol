/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionLiquidityPool } from "../interfaces/IPotionLiquidityPool.sol";

/**    
    @title IPotionBuyInfo
        
    @author Roberto Cano <robercano>

    @notice Structure for the PotionBuyInfo
 */

/**
        @notice The information required to buy a specific potion with a specific maximum premium requirement

        @custom:member sellers The list of liquidity providers that will be used to buy the potion
        @custom:member targetPotionAddress The address of the potion (otoken) to buy
        @custom:member underlyingAsset The address of the underlying asset of the potion (otoken) to buy
        @custom:member strikePriceInUSDC The strike price of the potion (otoken) to buy, in USDC, with 8 decimals
        @custom:member expirationTimestamp The expiration timestamp of the potion (otoken) to buy
        @custom:member expectedPremiumInUSDC The expected premium to be paid for the given order size
                       and the given sellers, in USDC
     */
struct PotionBuyInfo {
    IPotionLiquidityPool.CounterpartyDetails[] sellers;
    address targetPotionAddress;
    address underlyingAsset;
    uint256 strikePriceInUSDC;
    uint256 expirationTimestamp;
    uint256 expectedPremiumInUSDC;
}
