/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionLiquidityPool } from "../interfaces/IPotionLiquidityPool.sol";
import { IOtoken } from "../interfaces/IOtoken.sol";

import "./PercentageUtils.sol";

/**
    @title PotionProtocolLib

    @author Roberto Cano <robercano>

    @notice Helper library to buy potions from the Potion Protocol
 */
library PotionProtocolLib {
    using PercentageUtils for uint256;

    /// FUNCTIONS

    /**
        @notice Buys the specified amount of potions with the given parameters

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param potion Potion (otoken) to buy
        @param sellers List of sellers to buy from
        @param expectedPremium Expected premium to pay for the amount of otokens to buy
        @param slippage Slippage to apply to the premium to calculate the maximum premium allowed

        @return actualPremium The actual premium paid for the purchase of potions

        @dev Convenience function that calculates the slippage on the premium and calls the
        pool manager. Abstracted here in case it is needed to expand the logic in the future.
     */

    function _buyPotions(
        IPotionLiquidityPool potionLiquidityPoolManager,
        address potion,
        IPotionLiquidityPool.CounterpartyDetails[] memory sellers,
        uint256 expectedPremium,
        uint256 slippage
    ) internal returns (uint256 actualPremium) {
        uint256 maxPremium = expectedPremium.addPercentage(slippage);

        actualPremium = potionLiquidityPoolManager.buyOtokens(IOtoken(potion), sellers, maxPremium);
    }

    /**
        @notice Settles the specified potion after it has expired

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param potion Potion (otoken) to settle

        @dev The settlement will send back the proceeds of the expired potion to this contract

        @dev The settled amount is not available in the contract. Check the below TODO for more info
     */
    function _redeemPotions(IPotionLiquidityPool potionLiquidityPoolManager, address potion) internal {
        // TODO: There is no way to get the amount of proceeds returned by the protocol. We may
        // TODO: need to retrieve manually the USDC balance before and after in order to get it
        potionLiquidityPoolManager.settleAfterExpiry(IOtoken(potion));
    }
}
