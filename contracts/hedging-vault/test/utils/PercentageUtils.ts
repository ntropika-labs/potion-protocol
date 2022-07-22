import { BigNumber, BigNumberish } from "ethers";

/**
     @title PercentageUtils
     
     @notice Helper library to handle percentages in the same format as the Solidity files
     
     @author Roberto Cano <robercano>
  */

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
export const PERCENTAGE_100_BN = toSolidityPercentage(100.0);

/**
     @notice Adds the percentage to the given amount and returns the result

    @return The amount after the percentage is applied

    @dev It performs the following operation:
        (100.0 + percentage) * amount
*/
export function addPercentage(amount: BigNumber, percentage: BigNumber): BigNumber {
    return applyPercentage(amount, PERCENTAGE_100_BN.add(percentage));
}

/**
     @notice Substracts the percentage from the given amount and returns the result

    @return The amount after the percentage is applied

    @dev It performs the following operation:
        (100.0 - percentage) * amount
*/
export function substractPercentage(amount: BigNumber, percentage: BigNumber): BigNumber {
    return applyPercentage(amount, PERCENTAGE_100_BN.sub(percentage));
}

/**
    @notice Applies the given percentage to the given amount and returns the result

    @param amount The amount to apply the percentage to
    @param percentage The percentage to apply to the amount

    @return The amount after the percentage is applied
*/
export function applyPercentage(amount: BigNumber, percentage: BigNumber): BigNumber {
    return amount.mul(percentage).div(PERCENTAGE_100_BN);
}

/**
    @notice Checks if the given percentage is in range, this is, if it is between 0 and 100

    @param percentage The percentage to check

    @return True if the percentage is in range, false otherwise
*/
export function isPercentageInRange(percentage: number | BigNumber): boolean {
    if (typeof percentage === "number") {
        return percentage >= 0 && percentage <= 100;
    } else {
        return percentage.lte(PERCENTAGE_100_BN);
    }
}

/**
    @notice Transforms the given floating point percentage to the format used by the Solidity files
*/
export function toSolidityPercentage(percentage: number): BigNumber {
    return BigNumber.from(Math.floor(percentage * PERCENTAGE_FACTOR));
}

/**
    @notice Transforms a percentage in the format used by the Solidity files to a floating point percentage
*/
export function fromSolidityPercentage(percentage: BigNumber): number {
    return percentage.div(PERCENTAGE_FACTOR).toNumber();
}
