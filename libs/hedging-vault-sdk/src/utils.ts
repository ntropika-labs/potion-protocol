import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { toSolidityPercentage } from "./percentageUtils";
import type { BigNumberish } from "@ethersproject/bignumber";

const USDC_DECIMALS = BigNumber.from(6);

/**
    @notice Parses a percentage and returns the corresponding fixed point number with 6 decimals

    @param percentage The percentage to parse, as a number, a string or a BigNumber. If it is a
                      BigNumber, it is assumed it is already in the right fixed point format with
                      6 decimals

    @return The percentage as a BigNumber with 6 decimals
 */
export function parsePercentage(percentage: BigNumberish): BigNumber {
    if (typeof percentage === "number" || typeof percentage === "string") {
        return toSolidityPercentage(Number(percentage));
    } else {
        return BigNumber.from(percentage);
    }
}

/**
    @notice Parses an amount and returns the corresponding BigNumber representation with the correct
            number of decimals. If the input parameter is already a BigNumber, it is assumed it is
            already in the right format

    @param amount The amount to parse, as a number, a string or a BigNumber. If it is a
                  BigNumber, it is assumed it is already in the right format
    @param decimals The number of decimals of the amount

    @return The amount as a BigNumber with the correct number of decimals
 */
export function parseAmount(amount: BigNumberish, decimals: BigNumberish): BigNumber {
    if (typeof amount === "number" || typeof amount === "string") {
        return parseUnits(String(amount), decimals);
    } else {
        return BigNumber.from(amount);
    }
}

/**
    @notice Parses a price in USDC and returns the corresponding price in USDC with 6 decimals

    @param price The price to parse, as a number, a string or a BigNumber. If it is a
                 BigNumber, it is assumed it is already in the right USDC format with 6 decimals

    @return The percentage as a BigNumber with 6 decimals
 */
export function parsePriceInUSDC(price: BigNumberish): BigNumber {
    return parseAmount(price, USDC_DECIMALS);
}

/**
    @notice Converts an amount in the underlying asset to an amount in USDC, taking into account the
            underlying asset's decimals and the spot price in USDC

    @param amount_ The amount to convert, in the underlying asset's decimals if it is a BigNumber
*/
export function convertAmountToUSDC(
    amount_: BigNumberish,
    decimals_: BigNumberish,
    priceInUSDC_: BigNumberish,
): BigNumber {
    const amount = parseAmount(amount_, decimals_);
    const decimals = BigNumber.from(decimals_);
    const priceInUSDC = parsePriceInUSDC(priceInUSDC_);

    const amountDecimalsFactor = BigNumber.from(10).pow(decimals);

    return amount.mul(priceInUSDC).div(amountDecimalsFactor);
}
