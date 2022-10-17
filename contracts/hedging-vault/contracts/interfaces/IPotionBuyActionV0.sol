/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**    
    @title IPotionBuyActionV0
        
    @author Roberto Cano <robercano>

    @notice Interface for the V0 of the Potion Buy Action
 */
interface IPotionBuyActionV0 {
    /// EVENTS
    event MaxPremiumPercentageChanged(uint256 maxPremiumPercentage);
    event PremiumSlippageChanged(uint256 premiumSlippage);
    event SwapSlippageChanged(uint256 swapSlippage);
    event MaxSwapDurationChanged(uint256 maxSwapDurationSecs);
    event CycleDurationChanged(uint256 cycleDurationSecs);
    event StrikePercentageChanged(uint256 strikePercentage);
    event HedgingRateChanged(uint256 hedgingRate);
    event HedgingRateSlippageChanged(uint256 hedgingRateSlippage);

    /// ERRORS
    error MaxPremiumPercentageOutOfRange(uint256 maxPremiumPercentage);
    error PremiumSlippageOutOfRange(uint256 premiumSlippage);
    error SwapSlippageOutOfRange(uint256 swapSlippage);
    error CycleDurationTooShort(uint256 cycleDurationSecs, uint256 minCycleDurationSecs);
    error StrikePercentageIsZero();
    error HedgingRateIsZero();

    error PremiumExceedsMaxPremium(uint256 premium, uint256 maxPremium);
    error HedgingRateOutOfRange(uint256 expectedHedgingRate, uint256 actualHedgingRate, uint256 hedgingRateSlippage);

    /// SETTERS

    /**
        @notice Sets the new maximum percentage of the received loan that can be used as
        premium to buy potions

        @dev Reverts if the percentage is less than 0 or greater than 100
     */
    function setMaxPremiumPercentage(uint256 maxPremiumPercentage_) external;

    /**
        @notice Sets the new slippage allowed on the premium when the potions are bought

        @dev Reverts if the percentage is less than 0 or greater than 100
     */
    function setPremiumSlippage(uint256 premiumSlippage_) external;

    /**
        @notice Sets the new slippage allowed on Uniswap when the assets are swapped

        @dev Reverts if the percentage is less than 0 or greater than 100
     */
    function setSwapSlippage(uint256 swapSlippage_) external;

    /**
        @notice Sets the maximum duration in seconds for a Uniswap swap operation
     */
    function setMaxSwapDuration(uint256 durationSeconds) external;

    /**
        @notice Sets the investment cycle duration in seconds
     */
    function setCycleDuration(uint256 durationSeconds) external;

    /**
        @notice Sets strike percentage as a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    function setStrikePercentage(uint256 strikePercentage) external;

    /**
        @notice Sets the hedging rate as a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    function setHedgingRate(uint256 hedgingRate) external;

    /**
        @notice Sets the hedging rate slippage as a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    function setHedgingRateSlippage(uint256 hedgingRateSlippage) external;

    /// GETTERS

    /**
        @notice Returns the calculated payout for the current block, and whether that payout is final or not

        @param investmentAsset The asset available to the action contract for the investment 
        
        @return isFinal Whether the payout is final or not. If the payout is final it won't change anymore. If it
                is not final it means that the potion has not expired yet and the payout may change in the future.
        @return payout The payout in the investment asset
        @return orderSize The order size in the investment asset
    */
    function calculateCurrentPayout(address investmentAsset)
        external
        view
        returns (
            bool isFinal,
            uint256 payout,
            uint256 orderSize
        );
}
