/**
     @title PercentageUtils
     
     @notice Helper library to handle percentages in the same format as the Solidity files
     
     @author Roberto Cano <robercano>
  */
export namespace PercentageUtils {
    /**
        @notice The number of decimals used for the slippage percentage
     */
    export const PERCENTAGE_DECIMALS = 6;

    /**
         @notice The factor used to scale the slippage percentage when calculating the slippage
         on an amount
      */
    export const PERCENTAGE_FACTOR = 10 ** PERCENTAGE_DECIMALS;

    /**
         @notice Percentage of 100% with the given `PERCENTAGE_DECIMALS`
      */
    export const PERCENTAGE_100 = 100 * PERCENTAGE_FACTOR;

    /**
         @notice Adds the percentage to the given amount and returns the result
         
         @return The amount after the percentage is applied
 
         @dev It performs the following operation:
             (100.0 + percentage) * amount
      */
    export function addPercentage(amount: number, percentage: number) {
        return applyPercentage(amount, PERCENTAGE_100 + percentage);
    }

    /**
         @notice Substracts the percentage from the given amount and returns the result
         
         @return The amount after the percentage is applied
 
         @dev It performs the following operation:
             (100.0 - percentage) * amount
      */
    export function substractPercentage(amount: number, percentage: number) {
        return applyPercentage(amount, PERCENTAGE_100 - percentage);
    }

    /**
         @notice Applies the given percentage to the given amount and returns the result
 
         @param amount The amount to apply the percentage to
         @param percentage The percentage to apply to the amount
 
         @return The amount after the percentage is applied
      */
    export function applyPercentage(amount: number, percentage: number) {
        return Math.floor((amount * percentage) / PERCENTAGE_100);
    }

    /**
         @notice Checks if the given percentage is in range, this is, if it is between 0 and 100
 
         @param percentage The percentage to check
 
         @return True if the percentage is in range, false otherwise
      */
    export function isPercentageInRange(percentage: number) {
        return percentage <= PERCENTAGE_100;
    }

    /**
         @notice Transforms the given floating point percentage to the format used by the Solidity files
     */
    export function toSolidityPercentage(percentage: number) {
        return Math.floor(percentage * PERCENTAGE_FACTOR);
    }

    /**
         @notice Transforms a percentage in the format used by the Solidity files to a floating point percentage
     */
    export function fromSolidityPercentage(percentage: number) {
        return percentage / PERCENTAGE_FACTOR;
    }
}
