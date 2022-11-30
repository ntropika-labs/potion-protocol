/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

import "../utils/UniswapV3Path.sol";
import "../../interfaces/IChainlinkAggregatorV3.sol";
import "../../library/PriceUtils.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Uniswap Router with support for Chainlink Oracle
*/
contract MockRouterWithOracle is ISwapRouter {
    using UniswapV3Path for bytes;

    mapping(address => address) public oracles;

    /**
        Constructor
     */
    constructor(address[] memory assets_, address[] memory oracles_) {
        require(
            assets_.length == oracles_.length,
            "MockUniswapV3RouterWithOracle: assets and oracles arrays must be the same length"
        );

        for (uint256 i = 0; i < assets_.length; i++) {
            oracles[assets_[i]] = oracles_[i];
        }
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut) {
        return _swapIn(params.tokenIn, params.tokenOut, params.amountIn, params.amountOutMinimum);
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut) {
        (address tokenIn, address tokenOut, ) = params.path.decodeFirstPool();

        return _swapIn(tokenIn, tokenOut, params.amountIn, params.amountOutMinimum);
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn) {
        return _swapOut(params.tokenIn, params.tokenOut, params.amountInMaximum, params.amountOut);
    }

    /**
        @inheritdoc ISwapRouter
    */
    function exactOutput(ExactOutputParams calldata params) external payable returns (uint256 amountIn) {
        (address tokenIn, address tokenOut, ) = params.path.decodeFirstPool();

        return _swapOut(tokenIn, tokenOut, params.amountInMaximum, params.amountOut);
    }

    function balanceOf(address asset) external view returns (uint256) {
        return IERC20(asset).balanceOf(address(this));
    }

    /**
        @inheritdoc IUniswapV3SwapCallback
    */
    function uniswapV3SwapCallback(
        int256, /*amount0Delta*/
        int256, /*amount1Delta*/
        bytes calldata /*data*/
    ) external {}

    /**
        Swap function for humans
     */
    function swap(
        address assetIn,
        address assetOut,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) external {
        _swapIn(assetIn, assetOut, amountIn, amountOutMinimum);
    }

    //
    // INTERNALS
    //
    function _swapIn(
        address assetIn,
        address assetOut,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) internal returns (uint256 amountOut) {
        address oracleIn = oracles[assetIn];
        address oracleOut = oracles[assetOut];

        require(oracleIn != address(0), "MockUniswapV3RouterWithOracle: oracle for assetIn not found");
        require(oracleOut != address(0), "MockUniswapV3RouterWithOracle: oracle for assetOut not found");

        (, int256 priceIn, , , ) = IChainlinkAggregatorV3(oracleIn).latestRoundData();
        (, int256 priceOut, , , ) = IChainlinkAggregatorV3(oracleOut).latestRoundData();

        uint8 decimalsIn = IERC20Metadata(assetIn).decimals();
        uint8 decimalsOut = IERC20Metadata(assetOut).decimals();

        amountOut = PriceUtils.convertAmount(decimalsIn, decimalsOut, amountIn, uint256(priceIn), uint256(priceOut));

        require(amountOut >= amountOutMinimum, "MockUniswapV3RouterWithOracle: amountOut < amountOutMinimum");

        IERC20(assetIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(assetOut).transfer(msg.sender, amountOut);
    }

    function _swapOut(
        address assetIn,
        address assetOut,
        uint256 amountInMaximum,
        uint256 amountOut
    ) internal returns (uint256 amountIn) {
        address oracleIn = oracles[assetIn];
        address oracleOut = oracles[assetOut];

        require(oracleIn != address(0), "MockUniswapV3RouterWithOracle: oracle for assetIn not found");
        require(oracleOut != address(0), "MockUniswapV3RouterWithOracle: oracle for assetOut not found");

        (, int256 priceIn, , , ) = IChainlinkAggregatorV3(oracleIn).latestRoundData();
        (, int256 priceOut, , , ) = IChainlinkAggregatorV3(oracleOut).latestRoundData();

        uint8 decimalsIn = IERC20Metadata(assetIn).decimals();
        uint8 decimalsOut = IERC20Metadata(assetOut).decimals();

        amountIn = PriceUtils.convertAmount(decimalsOut, decimalsIn, amountOut, uint256(priceOut), uint256(priceIn));

        require(amountIn <= amountInMaximum, "MockUniswapV3RouterWithOracle: amountIn > amountInMaximum");

        IERC20(assetIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(assetOut).transfer(msg.sender, amountOut);
    }
}
