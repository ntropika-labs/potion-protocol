/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../library/PriceUtils.sol";

/**
    @title TestWrapperPriceUtils

    @author Roberto Cano <robercano>
    
    @notice Test wrapper for the PriceUtils library. This wrapper exposes
    all internal functions as external. This allows to unit test the library in isolation.
 */
contract TestWrapperPriceUtils {
    /**
        @notice See { PriceUtils }
     */
    function toOutputAmount(uint256 priceRate, uint256 inputAmount) external pure returns (uint256) {
        return PriceUtils.toOutputAmount(priceRate, inputAmount);
    }

    /**
        @notice See { PriceUtils }
     */
    function toInputAmount(uint256 priceRate, uint256 outputAmount) external pure returns (uint256) {
        return PriceUtils.toInputAmount(priceRate, outputAmount);
    }
}
