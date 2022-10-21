/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**    
    @title ISwapToUSDCActionV0
        
    @author Roberto Cano <robercano>

    @notice Interface for the SwapToUSDCAction contract
 */
interface ISwapToUSDCActionV0 {
    /// EVENTS
    event SwapSlippageChanged(uint256 swapSlippage);
    event MaxSwapDurationChanged(uint256 maxSwapDurationSecs);
    event SwapPercentageChanged(uint256 swapPercentage);

    /// ERRORS
    error SwapSlippageOutOfRange(uint256 swapSlippage);

    /// SETTERS

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
        @notice Sets the percentage of the investment asset to swap to USDC
     */
    function setSwapPercentage(uint256 swapPercentage) external;
}
