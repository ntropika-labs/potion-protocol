/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @notice Utility library to apply a slippage percentage to an input amount
 */
library SlippageUtils {
    /**
        @notice The number of decimals used for the slippage percentage
     */
    uint256 public constant SLIPPAGE_DECIMALS = 6;

    /**
        @notice The factor used to scale the slippage percentage when calculating the slippage
        on an amount
     */
    uint256 public constant SLIPPAGE_FACTOR = 10**SLIPPAGE_DECIMALS;

    /**
        @notice Slippage percentage of 100% with the given `SLIPPAGE_DECIMALS`

        @dev As 100% is represented in decimal as 1.0, it is exactly the same as the
        `SLIPPAGE_FACTOR` constant. It is aliased here for better code documentation
     */
    uint256 public constant SLIPPAGE_100 = SLIPPAGE_FACTOR;

    /**
        @notice Adds the slippage percentage to the given amount and returns the result
        
        @return The amount after the slippage is applied

        @dev It performs the following operation:
            (1.0 + slippage) * amount
     */
    function addSlippage(uint256 amount, uint256 slippage) internal pure returns (uint256) {
        // TODO: used Math.mulDiv when it is released
        return (amount * (SLIPPAGE_100 + slippage)) / SLIPPAGE_FACTOR;
    }

    /**
        @notice Substracts the slippage percentage from the given amount and returns the result
        
        @return The amount after the slippage is applied

        @dev It performs the following operation:
            (1.0 + slippage) * amount
     */
    function substractSlippage(uint256 amount, uint256 slippage) internal pure returns (uint256) {
        // TODO: used Math.mulDiv when it is released
        return (amount * (SLIPPAGE_100 - slippage)) / SLIPPAGE_FACTOR;
    }
}
