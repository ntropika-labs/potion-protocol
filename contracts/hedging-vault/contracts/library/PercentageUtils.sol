/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title PercentageUtils

    @author Roberto Cano <robercano>
    
    @notice Utility library to apply a slippage percentage to an input amount
 */
library PercentageUtils {
    /**
        @notice The number of decimals used for the slippage percentage
     */
    uint256 public constant PERCENTAGE_DECIMALS = 6;

    /**
        @notice The factor used to scale the slippage percentage when calculating the slippage
        on an amount
     */
    uint256 public constant PERCENTAGE_FACTOR = 10**PERCENTAGE_DECIMALS;

    /**
        @notice Percentage of 100% with the given `PERCENTAGE_DECIMALS`

        @dev As 100% is represented in decimal as 1.0, it is exactly the same as the
        `PERCENTAGE_FACTOR` constant. It is aliased here for better code documentation
     */
    uint256 public constant PERCENTAGE_100 = PERCENTAGE_FACTOR;

    /**
        @notice Adds the percentage to the given amount and returns the result
        
        @return The amount after the percentage is applied

        @dev It performs the following operation:
            (1.0 + percentage) * amount
     */
    function addPercentage(uint256 amount, uint256 percentage) internal pure returns (uint256) {
        return applyPercentage(amount, PERCENTAGE_100 + percentage);
    }

    /**
        @notice Substracts the percentage from the given amount and returns the result
        
        @return The amount after the percentage is applied

        @dev It performs the following operation:
            (1.0 + slippage) * amount
     */
    function substractPercentage(uint256 amount, uint256 percentage) internal pure returns (uint256) {
        return applyPercentage(amount, PERCENTAGE_100 - percentage);
    }

    /**
        @notice Applies the given percentage to the given amount and returns the result

        @param amount The amount to apply the percentage to
        @param percentage The percentage to apply to the amount

        @return The amount after the percentage is applied
     */
    function applyPercentage(uint256 amount, uint256 percentage) internal pure returns (uint256) {
        // TODO: used Math.mulDiv when it is released
        return (amount * percentage) / PERCENTAGE_FACTOR;
    }

    /**
        @notice Checks if the given percentage is in range, this is, if it is between 0 and 100

        @param percentage The percentage to check

        @return True if the percentage is in range, false otherwise
     */
    function isPercentageInRange(uint256 percentage) internal pure returns (bool) {
        return percentage <= PERCENTAGE_100;
    }
}
