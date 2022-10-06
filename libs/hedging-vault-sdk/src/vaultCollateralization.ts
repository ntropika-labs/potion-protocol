import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseAmount, parsePercentage, parsePriceInUSDC, convertAmountToUSDC } from "./utils";
import { applyPercentage } from "./percentageUtils";
import { formatUnits } from "@ethersproject/units";

const UPSCALE_FACTOR_DECIMALS = 18;

/**
    @notice Calculates the actual order size to cover the given vault size, taking into account the
    that part of that vault size will be used to pay for the premium

    @param vaultSize The size of the vault to cover, i.e.: the amount of underlying assets in the vault
    @param hedgingRate The percentage of the vault size that will be protected by buying Potions, as a
                       fixed Point number with 6 decimals
    @param strikePercent The percentage of the spot price that is used for the strike of the Potion
    @param spotPriceInUSDC The spot price of the underlying asset in USDC, in float format
    @param expectedPremiumInUSDC The expected premium to be paid for covering the whole vault size, in USDC,
                                 with 6 decimals

    @return The order size to cover the vault

    @dev This just applies one step of the asymptotic approximation based on the expected premium
 */
export function calculateOrderSize(
    vaultSize_: BigNumberish,
    underlyingDecimals_: BigNumberish,
    hedgingRate_: BigNumberish,
    strikePercent_: BigNumberish,
    spotPriceInUSDC_: BigNumberish,
    expectedPremiumInUSDC_: BigNumberish,
): number {
    // Convert the input parameters to the right format
    const vaultSize = parseAmount(vaultSize_, underlyingDecimals_);
    const underlyingDecimals = BigNumber.from(underlyingDecimals_);
    const hedgingRate = parsePercentage(hedgingRate_);
    const strikePercent = parsePercentage(strikePercent_);
    const spotPriceInUSDC = parsePriceInUSDC(spotPriceInUSDC_);
    const expectedPremiumInUSDC = parsePriceInUSDC(expectedPremiumInUSDC_);

    // Convert the vault size to USDC collateral taking into account the vault's underlying decimals
    const vaultSizeInUSDC = convertAmountToUSDC(vaultSize, underlyingDecimals, spotPriceInUSDC);

    // Apply the formula
    const strikePriceInUSDC = applyPercentage(spotPriceInUSDC, strikePercent);
    const hedgedAmount = applyPercentage(vaultSizeInUSDC, hedgingRate);
    const premiumForHedgedAmount = applyPercentage(expectedPremiumInUSDC, hedgingRate);

    const costPerPotionIncludingPremium = strikePriceInUSDC.add(premiumForHedgedAmount);

    const upscaleFactor = BigNumber.from(10).pow(UPSCALE_FACTOR_DECIMALS);
    const numberPutsBn = hedgedAmount.mul(upscaleFactor).div(costPerPotionIncludingPremium);

    return Number(formatUnits(numberPutsBn, UPSCALE_FACTOR_DECIMALS));
}
