/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "../utils/UniswapV3Path.sol";
import "hardhat/console.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn contoller
*/
contract MockUniswapV3Router is ISwapRouter {
    using UniswapV3Path for bytes;

    address[] public assets;

    constructor(address[] memory assets_) {
        for (uint256 i = 0; i < assets_.length; i++) {
            assets.push(assets_[i]);

            // Approve the deployer to spend our assets. This enables the definition of Smock
            // functions where the transfer logic is modified and run by the deployer
            IERC20(assets_[i]).approve(msg.sender, type(uint256).max);
        }
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut) {
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        IERC20(params.tokenOut).transfer(msg.sender, params.amountOutMinimum);

        return params.amountOutMinimum;
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut) {
        (address tokenIn, address tokenOut, ) = params.path.decodeFirstPool();

        IERC20(tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        IERC20(tokenOut).transfer(msg.sender, params.amountOutMinimum);

        return params.amountOutMinimum;
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn) {
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountInMaximum);
        IERC20(params.tokenOut).transfer(msg.sender, params.amountOut);

        return params.amountInMaximum;
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactOutput(ExactOutputParams calldata params) external payable returns (uint256 amountIn) {
        (address tokenIn, address tokenOut, ) = params.path.decodeFirstPool();

        console.log(tokenIn, tokenOut, params.amountInMaximum, params.amountOut);

        IERC20(tokenIn).transferFrom(msg.sender, address(this), params.amountInMaximum);
        IERC20(tokenOut).transfer(msg.sender, params.amountOut);
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
