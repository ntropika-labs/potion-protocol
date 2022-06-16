/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@prb/math/contracts/PRBMathUD60x18.sol";

/**
    @notice Utility library to convert an input amount into an output amount using
    the given price as the conversion factor
 */
library PriceUtils {
    /**
    @notice Type for the swap price configured by the Keeper

    @dev Internally it is represented by a PRBMathUD60x18 fixed point number
    */
    // TODO: OpenZeppelin contracts are throwing an error if we define a custom type here
    //type Price is uint256;

    using PRBMathUD60x18 for uint256;

    /**
        @notice Given an amount of input asset it calculates how much amount of the output 
        asset will be received at the given price rate

        @param priceRate The price rate of as output/input in PRBMathUD60x18 format
        @param inputAmount The amount of input asset to convert, as a uint256

        @return The amount of output asset that will be received
     */
    function toOutputAmount(uint256 priceRate, uint256 inputAmount) internal pure returns (uint256) {
        return priceRate.mul(PRBMathUD60x18.fromUint(inputAmount)).toUint();
    }

    /**
        @notice Given a desired output amount it calculates how much input asset is needed
        at the current price rate

        @param priceRate The price rate of as input/output in PRBMathUD60x18 format
        @param outputAmount The desired amount of output asset, as a uint256

        @return The amount of input asset that will be received
     */
    function toInputAmount(uint256 priceRate, uint256 outputAmount) internal pure returns (uint256) {
        return PRBMathUD60x18.fromUint(outputAmount).div(priceRate).toUint();
    }
}
