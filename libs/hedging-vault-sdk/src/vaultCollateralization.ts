import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseAmount, parsePercentage, parsePriceInUSDC } from "./utils";
import {
    applyPercentage,
    fromFraction,
    PERCENTAGE_100_BN,
    divByPercentage,
    toSolidityPercentage,
} from "./percentageUtils";

export const OTOKEN_DECIMALS = BigNumber.from(8);

/**
    @notice Calculates the actual order size to cover the given vault size, taking into account
    that part of the vault size will be used to pay for the premium

    @param vaultSize The current size of the vault in number of underlying tokens (`underlyingDecimals_` decimals)
    @param underlyingDecimals_ The number of decimals of the underlying token (integer number)
    @param hedgingRate The percentage of the vault size that will be protected by buying Potions
                       (fixed point number with 6 decimals)
    @param strikePercent The percentage of the spot price that is used for the strike of the Potion
                         (fixed point number with 6 decimals)
    @param spotPriceInUSDC The spot price of the underlying asset in USDC, (6 decimals)
    @param quotedPremiumInUSDC_ The premium quoted by the router for the initial vault size, in USDC,
                                (6 decimals)

    @return effectiveVaultSize The vault size to take into account when calculating the actual premium, which
                               takes into account the premium itself (`underlyingDecimals_` decimals)
    @return premiumPercent The premium percentage as the ratio between the quoted premium and the order
            size in dollars based on the initial vault size, returned as a percentage
            (fixed point number with 6 decimals)

    @dev All input parameters are accepted as number, string or BigNumber. If they are a BigNumber, they
         must have the correct number of decimals. This number of decimals is specified in the parameter
         description at the end, between parentheses. If they are a number or a string, they are parsed
         assuming the correct number of decimals. The parameters indicated as fixed point numbers are
         either passed as a BigNumber with the correct format or as a floating point number
    @dev This just applies one step of the asymptotic approximation based on the quoted premium
 */
export function calculateOrderSize(
    vaultSize_: BigNumberish,
    underlyingDecimals_: BigNumberish,
    hedgingRate_: BigNumberish,
    strikePercent_: BigNumberish,
    spotPriceInUSDC_: BigNumberish,
    quotedPremiumInUSDC_: BigNumberish,
): {
    effectiveVaultSize: BigNumber;
    premiumPercent: BigNumber;
} {
    // Convert the input parameters to the right format
    const vaultSize = parseAmount(vaultSize_, underlyingDecimals_);
    const underlyingDecimals = BigNumber.from(underlyingDecimals_);
    const hedgingRate = parsePercentage(hedgingRate_);
    const strikePercent = parsePercentage(strikePercent_);
    const spotPriceInUSDC = parsePriceInUSDC(spotPriceInUSDC_);
    const quotedPremiumInUSDC = parsePriceInUSDC(quotedPremiumInUSDC_);

    // For debugging purposes
    // console.log("calculateOrderSize");
    // console.table([
    //     {
    //         vaultSize: vaultSize.toString(),
    //         underlyingDecimals: underlyingDecimals.toString(),
    //         hedgingRate: hedgingRate.toString(),
    //         strikePercent: strikePercent.toString(),
    //         spotPriceInUSDC: spotPriceInUSDC.toString(),
    //         quotedPremiumInUSDC: quotedPremiumInUSDC.toString(),
    //     },
    // ]);

    if (vaultSize.isZero()) {
        return {
            effectiveVaultSize: vaultSize,
            premiumPercent: toSolidityPercentage(0),
        };
    }

    // Calculate the premium percent
    const premiumPercent = _calculatePremiumPercent(
        vaultSize,
        underlyingDecimals,
        hedgingRate,
        strikePercent,
        spotPriceInUSDC,
        quotedPremiumInUSDC,
    );

    //console.log("premiumPercent", premiumPercent.toString());

    const amountToProtect = applyPercentage(vaultSize, hedgingRate);

    const hedgedStrikePercent = applyPercentage(strikePercent, hedgingRate);
    const hedgedStrikePremiumPercent = applyPercentage(hedgedStrikePercent, premiumPercent);

    const denominatorPercentage = PERCENTAGE_100_BN.add(hedgedStrikePremiumPercent);
    const effectiveVaultSize = divByPercentage(amountToProtect, denominatorPercentage);

    // console.table([
    //     {
    //         amountToProtect: amountToProtect.toString(),
    //         hedgedStrikePercent: hedgedStrikePercent.toString(),
    //         hedgedStrikePremiumPercent: hedgedStrikePremiumPercent.toString(),
    //         denominatorPercentage: denominatorPercentage.toString(),
    //     },
    // ]);

    // console.log("effectiveVaultSize", effectiveVaultSize.toString());
    return {
        effectiveVaultSize: effectiveVaultSize,
        premiumPercent: premiumPercent,
    };
}

export function calculatePremiumPercent(
    vaultSize_: BigNumberish,
    underlyingDecimals_: BigNumberish,
    hedgingRate_: BigNumberish,
    strikePercent_: BigNumberish,
    spotPriceInUSDC_: BigNumberish,
    quotedPremiumInUSDC_: BigNumberish,
): BigNumber {
    // Convert the input parameters to the right format
    const vaultSize = parseAmount(vaultSize_, underlyingDecimals_);
    const underlyingDecimals = BigNumber.from(underlyingDecimals_);
    const hedgingRate = parsePercentage(hedgingRate_);
    const strikePercent = parsePercentage(strikePercent_);
    const spotPriceInUSDC = parsePriceInUSDC(spotPriceInUSDC_);
    const quotedPremiumInUSDC = parsePriceInUSDC(quotedPremiumInUSDC_);

    return _calculatePremiumPercent(
        vaultSize,
        underlyingDecimals,
        hedgingRate,
        strikePercent,
        spotPriceInUSDC,
        quotedPremiumInUSDC,
    );
}

/**
    @notice Calculates the premium percent as the ratio between the total premium quoted by the router
            and the total order size in USDC based on the initial size of the vault

    @return premiumPercent The premium percentage as the ratio between the quoted premium and the order
            size in dollars based on the initial vault size, returned as a percentage with 6 decimals
*/
function _calculatePremiumPercent(
    vaultSize: BigNumber,
    underlyingDecimals: BigNumber,
    hedgingRate: BigNumber,
    strikePercent: BigNumber,
    spotPriceInUSDC: BigNumber,
    quotedPremiumInUSDC: BigNumber,
): BigNumber {
    const strikePriceInUSDC = applyPercentage(spotPriceInUSDC, strikePercent);
    const collateralPerAssetInUSDC = applyPercentage(strikePriceInUSDC, hedgingRate);
    const downscaleFactor = BigNumber.from(10).pow(underlyingDecimals);
    const totalCollateralInUSDC = collateralPerAssetInUSDC.mul(vaultSize).div(downscaleFactor);

    return fromFraction(quotedPremiumInUSDC, totalCollateralInUSDC);
}
