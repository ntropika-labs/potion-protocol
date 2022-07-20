/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@prb/math/contracts/PRBMathUD60x18.sol";

import { IERC20Metadata } from "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";

/**
    @title PriceUtils

    @author Roberto Cano <robercano>
    
    @notice Utility library to convert an input amount into an output amount using
    the given priceNumerator as the conversion factor
 */
library PriceUtils {
    /**
    @notice Type for the swap priceNumerator configured by the Keeper

    @dev Internally it is represented by a PRBMathUD60x18 fixed point number
    */
    // TODO: OpenZeppelin contracts are throwing an error if we define a custom type here
    //type Price is uint256;

    using PRBMathUD60x18 for uint256;

    uint256 internal constant PRICE_RATE_DECIMALS = 8;

    /**
        @notice Given an amount of input asset it calculates how much amount of the output 
        asset will be received at the given priceNumerator rate

        @param priceRate The priceNumerator rate of as output/input in PRBMathUD60x18 format
        @param inputAmount The amount of input asset to convert, as a uint256

        @return The amount of output asset that will be received
     */
    function toOutputAmount(uint256 priceRate, uint256 inputAmount) internal pure returns (uint256) {
        return priceRate.mul(PRBMathUD60x18.fromUint(inputAmount)).toUint();
    }

    /**
        @notice Given a desired output amount it calculates how much input asset is needed
        at the current priceNumerator rate

        @param priceRate The priceNumerator rate of as input/output in PRBMathUD60x18 format
        @param outputAmount The desired amount of output asset, as a uint256

        @return The amount of input asset that will be received
     */
    function toInputAmount(uint256 priceRate, uint256 outputAmount) internal pure returns (uint256) {
        return PRBMathUD60x18.fromUint(outputAmount).div(priceRate).toUint();
    }

    /**
        @notice Converts an amount of input token to an amount of output token using the given price rate

        @param inputTokenDecimals The number of decimals of the input token
        @param outputTokenDecimals The number of decimals of the output token
        @param amount The amount of the input token to convert
        @param priceNumerator The numerator of the price rate
        @param priceDenominator The denominator of the price rate

        @return outputAmount The output amount denominated in the output token
     */
    function convertAmount(
        uint256 inputTokenDecimals,
        uint256 outputTokenDecimals,
        uint256 amount,
        uint256 priceNumerator,
        uint256 priceDenominator
    ) internal pure returns (uint256 outputAmount) {
        if (inputTokenDecimals == outputTokenDecimals) {
            outputAmount = (amount * priceNumerator) / priceDenominator;
        } else if (inputTokenDecimals > outputTokenDecimals) {
            uint256 exp = inputTokenDecimals - outputTokenDecimals;
            outputAmount = (amount * priceNumerator) / priceDenominator / (10**exp);
        } else {
            uint256 exp = outputTokenDecimals - inputTokenDecimals;
            outputAmount = (amount * priceNumerator * (10**exp)) / priceDenominator;
        }

        return outputAmount;
    }
}
