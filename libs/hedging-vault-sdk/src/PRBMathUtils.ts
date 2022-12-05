import { BigNumber } from "@ethersproject/bignumber";
import { parseAmount } from "./utils";
import type { BigNumberish } from "@ethersproject/bignumber";

/**
     @title PRBMathUtils

     @notice Helper library to convert floating point number to PRB Math format.

     @author Roberto Cano <robercano>
  */

/**
    @notice Takes a rational floating point number and returns the same number as a PRB Math UD60x18 fixed point number

    @param inputTokenPriceInUSD  The floating point numerator of the rate
    @param outputTokenPriceInUSD  The floating point denominator of the rate
    @param inputTokenDecimals The number of decimal positions of the numerator for the price rate
    @param outputTokenDecimals The number of decimal positions of the denominator for the price rate

    @return The price rate in PRB Math UD60x18 format compensated for the numeratorDecimals and denominatorDecimals

    @dev Example:
            Input token: DAI
            Input price rate: 64.8 USD/DAI
            Input decimals: 18

            Output token: WETH
            Output price rate: 2.0 USD/WETH
            Output decimals: 18

            Price rate: 32.4 WETH/DAI

            UD60x18 rate 32.400000000000000000 (both have 18 decimals)

    @dev Example:
            Input token: DAI
            Input price rate: 64.8 USD/DAI
            Input decimals: 18

            Output token: USDC
            Output price rate: 2.0 USD/USDC
            Output decimals: 6

            Price rate: 32.4 USDC/DAI

            UD60x18 rate 0.000000000032400000 (divided by 10^12)

    @dev Example:
            Input token: USDC
            Input price rate: 64.8 USD/USDC
            Input decimals: 6

            Output token: WETH
            Output price rate: 2.0 USD/WETH
            Output decimals: 18

            Price rate: 32.4 WETH/USDC

            UD60x18 rate 32400000000000.000000000000000000
*/
export function getRateInUD60x18(
    inputTokenPriceInUSD_: BigNumberish,
    outputTokenPriceInUSD_: BigNumberish,
    inputTokenDecimals_: BigNumberish = 18,
    outputTokenDecimals_: BigNumberish = 18,
): BigNumber {
    const tenBn = BigNumber.from(10);

    // const fpInputTokenPriceInUSD = toNumber(inputTokenPriceInUSD, inputTokenDecimals_);
    // const fpOutputTokenPriceInUSD = toNumber(outputTokenPriceInUSD, outputTokenDecimals_);
    // const rate = toBn(String(fpInputTokenPriceInUSD / fpOutputTokenPriceInUSD));

    const inputTokenPriceInUSD = parseAmount(inputTokenPriceInUSD_, 8);
    const outputTokenPriceInUSD = parseAmount(outputTokenPriceInUSD_, 8);
    const rate = inputTokenPriceInUSD.mul(tenBn.pow(18)).div(outputTokenPriceInUSD);

    const inputTokenDecimals = BigNumber.from(inputTokenDecimals_);
    const outputTokenDecimals = BigNumber.from(outputTokenDecimals_);

    if (inputTokenDecimals.eq(outputTokenDecimals)) {
        return rate;
    }

    return inputTokenDecimals.gt(outputTokenDecimals)
        ? rate.div(tenBn.pow(inputTokenDecimals.sub(outputTokenDecimals)))
        : rate.mul(tenBn.pow(outputTokenDecimals.sub(inputTokenDecimals)));
}
