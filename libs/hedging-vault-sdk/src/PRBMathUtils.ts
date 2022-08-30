import { toBn } from "evm-bn";
import { BigNumber } from "@ethersproject/bignumber";

/**
     @title PRBMathUtils

     @notice Helper library to convert floating point number to PRB Math format.

     @author Roberto Cano <robercano>
  */

/**
    @notice Takes a rational floating point number and returns the same number as a PRB Math UD60x18 fixed point number

    @param fpInputTokenPriceInUSD  The floating point numerator of the rate
    @param fpOutputTokenPriceInUSD  The floating point denominator of the rate
    @param inputDecimals The number of decimal positions of the numerator for the price rate
    @param outputDecimals The number of decimal positions of the denominator for the price rate

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
  fpInputTokenPriceInUSD: number,
  fpOutputTokenPriceInUSD: number,
  inputTokenDecimals = 18,
  outputTokenDecimals = 18
): BigNumber {
  if (inputTokenDecimals === outputTokenDecimals) {
    return toBn(String(fpInputTokenPriceInUSD / fpOutputTokenPriceInUSD));
  } else if (inputTokenDecimals > outputTokenDecimals) {
    return toBn(String(fpInputTokenPriceInUSD / fpOutputTokenPriceInUSD)).div(
      BigNumber.from(10).pow(inputTokenDecimals - outputTokenDecimals)
    );
  } else {
    return toBn(String(fpInputTokenPriceInUSD / fpOutputTokenPriceInUSD)).mul(
      BigNumber.from(10).pow(outputTokenDecimals - inputTokenDecimals)
    );
  }
}
