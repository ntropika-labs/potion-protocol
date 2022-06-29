/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../library/UniswapV3SwapLib.sol";

/**
    @title TestWrapperUniswapV3SwapLib

    @author Roberto Cano <robercano>

    @notice Test wrapper for the UniswapV3SwapLib library. This wrapper exposes
    all internal functions as external. This allows to unit test the library in isolation.
 */
contract TestWrapperUniswapV3SwapLib {
    /// FUNCTIONS

    /**
        @notice See { UniswapV3SwapLib }
     */
    function swapInput(ISwapRouter swapRouter, UniswapV3SwapLib.SwapInputParameters memory parameters)
        external
        returns (uint256 amountOut)
    {
        return UniswapV3SwapLib.swapInput(swapRouter, parameters);
    }

    /**
        @notice See { UniswapV3SwapLib }
     */
    function swapOutput(ISwapRouter swapRouter, UniswapV3SwapLib.SwapOutputParameters memory parameters)
        external
        returns (uint256 amountIn)
    {
        return UniswapV3SwapLib.swapOutput(swapRouter, parameters);
    }
}
