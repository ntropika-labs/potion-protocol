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
    event StrikePriceChanged(uint256 strikePrice);

    /// ERRORS
    error MaxPremiumPercentageOutOfRange(uint256 maxPremiumPercentage);
    error PremiumSlippageOutOfRange(uint256 premiumSlippage);
    error SwapSlippageOutOfRange(uint256 swapSlippage);
    error CycleDurationTooShort(uint256 cycleDurationSecs, uint256 minCycleDurationSecs);
    error StrikePriceIsZero();

    /// FUNCTIONS

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
        @notice Sets strike price denominated in USDC
     */
    function setStrikePrice(uint256 strikePriceInUSDC) external;
}
