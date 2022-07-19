/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn contoller
*/
contract MockUniswapV3Router is ISwapRouter {
    /**
        @inheritdoc ISwapRouter
    */
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut) {
        return params.amountOutMinimum;
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut) {
        return params.amountOutMinimum;
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn) {
        return params.amountInMaximum;
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactOutput(ExactOutputParams calldata params) external payable returns (uint256 amountIn) {
        return params.amountInMaximum;
    }

    /**
        @inheritdoc IUniswapV3SwapCallback
    */
    function uniswapV3SwapCallback(
        int256, /*amount0Delta*/
        int256, /*amount1Delta*/
        bytes calldata /*data*/
    ) external {}
}
