/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import "./PercentageUtils.sol";

/**
    @title UniswapV3SwapLib

    @author Roberto Cano <robercano>

    @notice Helper library to perform Uniswap V3 multi-hop swaps
 */
library UniswapV3SwapLib {
    using PercentageUtils for uint256;

    /// STRUCTS

    /**
        @notice The parameters necessary for an input swap

        @custom:member inputToken The token in which `amountIn` is denominated
        @custom:member exactAmountIn The exact amount of `inputToken` that will be used for the swap
        @custom:member expectedAmountOut The expected amount of output tokens to be received without taking into account slippage
        @custom:member slippage The allowed slippage for the amount of output tokens, as a percentage with 6 decimal places
        @custom:member maxDuration The maximum duration of the swap in seconds, used to calculate the deadline from `now`
        @custom:member swapPath The abi-encoded path for the swap, coming from the Router helper
    */
    struct SwapInputParameters {
        address inputToken;
        uint256 exactAmountIn;
        uint256 expectedAmountOut;
        uint256 slippage;
        uint256 maxDuration;
        bytes swapPath;
    }

    /**
        @notice The parameters necessary for an output swap

        @custom:member inputToken The token in which `amountIn` is denominated
        @custom:member swapPath The abi-encoded path for the swap, coming from the Router helper
        @custom:member exactAmountOut The exact amount of the output token that will be obtained after the swap
        @custom:member expectedAmountIn The expected amount of input tokens to be used in the swap without taking into account slippage
        @custom:member slippage The allowed slippage for the amount of input tokens that will be used for the swap,
        as a percentage with 6 decimal places
        @custom:member maxDuration The maximum duration of the swap in seconds, used to calculate the deadline from `now`
    */
    struct SwapOutputParameters {
        address inputToken;
        uint256 exactAmountOut;
        uint256 expectedAmountIn;
        uint256 slippage;
        uint256 maxDuration;
        bytes swapPath;
    }

    /// CONSTANTS
    /**
        @notice Performs a multi-hop swap with an exact amount of input tokens and a variable amount
        of output tokens

        @param swapRouter The Uniswap V3 Router contract
        @param parameters The parameters necessary for the swap

        @dev The `swapPath` is a sequence of tokenAddress Fee tokenAddress, encoded in reverse order, which are the variables
        needed to compute each pool contract address in our sequence of swaps. The multihop swap router code will automatically
        find the correct pool with these variables, and execute the swap needed within each pool in our sequence. More
        information on [Multi-hop Swaps](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps)
        

        @dev The slippage parameter is applied to the `expectedAmountOut` in order to account for slippage during the swap.
        In particular when swapping with `swapInput` the input amount of tokens is exact, and it is the output that can suffer from
        slippage. In such case the slippage is applied as the percentage that can be substracted from the ideal 100% that
         could be obtained at the output.

        @dev The `maxDuration` parameter is used to calculate the deadline from the current block timestamp
     */
    function swapInput(ISwapRouter swapRouter, SwapInputParameters memory parameters)
        internal
        returns (uint256 amountOut)
    {
        uint256 amountOutMinimum = parameters.expectedAmountOut.subtractPercentage(parameters.slippage);

        TransferHelper.safeApprove(parameters.inputToken, address(swapRouter), parameters.exactAmountIn);

        ISwapRouter.ExactInputParams memory uniswapParams = ISwapRouter.ExactInputParams({
            path: parameters.swapPath,
            recipient: address(this),
            deadline: block.timestamp + parameters.maxDuration,
            amountIn: parameters.exactAmountIn,
            amountOutMinimum: amountOutMinimum
        });

        amountOut = swapRouter.exactInput(uniswapParams);
    }

    /**
        @notice Performs a multi-hop swap for an exact amount of output tokens and a variable amount
        of input tokens

        @param swapRouter The Uniswap V3 Router contract
        @param parameters The parameters necessary for the swap

        @dev The `swapPath` is a sequence of tokenAddress Fee tokenAddress, encoded in reverse order, which are the variables
        needed to compute each pool contract address in our sequence of swaps. The multihop swap router code will automatically
        find the correct pool with these variables, and execute the swap needed within each pool in our sequence. More
        information on [Multi-hop Swaps](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps)

        @dev The slippage parameter is applied to the `expectedAmountIn` in order to account for slippage during the swap.
        In particular when swapping with `swapOutput` the output amount of tokens is exact, and it is the input that can
        suffer from slippage. In such case the slippage is applied as the percentage that can be added from the ideal 100% that
        could have been used for the input

        @dev The `maxDuration` parameter is used to calculate the deadline from the current block timestamp

        @audit `block.timestamp` is used to calculate the deadline, which is a timestamp in seconds. This is not vulnerable to
        to the `timestamp` vulnerability, as the `block.timestamp` is not used to calculate anything random
     */
    function swapOutput(ISwapRouter swapRouter, SwapOutputParameters memory parameters)
        internal
        returns (uint256 amountIn)
    {
        uint256 amountInMaximum = parameters.expectedAmountIn.addPercentage(parameters.slippage);

        TransferHelper.safeApprove(parameters.inputToken, address(swapRouter), amountInMaximum);

        // The parameter path is encoded as (tokenOut, fee, tokenIn/tokenOut, fee, tokenIn)
        // The tokenIn/tokenOut field is the shared token between the two pools used in the multiple pool swap. In this case USDC is the "shared" token.
        // For an exactOutput swap, the first swap that occurs is the swap which returns the eventual desired token.
        // In this case, our desired output token is WETH9 so that swap happpens first, and is encoded in the path accordingly.
        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: parameters.swapPath,
            recipient: address(this),
            deadline: block.timestamp + parameters.maxDuration,
            amountOut: parameters.exactAmountOut,
            amountInMaximum: amountInMaximum
        });

        // Executes the swap, returning the amountIn actually spent.
        amountIn = swapRouter.exactOutput(params);

        // If the input amount used was less than the expected maximum, approve the router for 0 tokens
        // to avoid allowing the router to transfer the remaining tokens
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(parameters.inputToken, address(swapRouter), 0);
        }
    }
}
