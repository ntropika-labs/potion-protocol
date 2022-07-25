/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./UniswapV3OracleUpgradeable.sol";
import "../../library/UniswapV3SwapLib.sol";
import "../../library/PriceUtils.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

/**
    @title UniswapV3HelperUpgradeable

    @notice Helper contract that handles the configuration to perform Uniswap V3 multi-hop swaps. It
    uses the `UniswapV3SwapLib` to perform the swaps.

    @dev It inherits from the RolesManagerUpgradeable contract to scope the the parameters setting
    functions for only the Keeper role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the Action. The initialization will happen in the Action contract

 */
contract UniswapV3HelperUpgradeable is UniswapV3OracleUpgradeable {
    using UniswapV3SwapLib for ISwapRouter;

    /**
        @notice The address of the Uniswap V3 Router contract
     */
    ISwapRouter private _swapRouter;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice It does chain the initialization to the parent contract because both contracts
        are quite coupled and `UniswapV3OracleUpgradeable` MUST not be used anywhere else in
        the inheritance chain.
     */
    // solhint-disable-next-line func-name-mixedcase
    function __UniswapV3Helper_init_unchained(address swapRouter) internal onlyInitializing {
        __UniswapV3Oracle_init_unchained();

        _swapRouter = ISwapRouter(swapRouter);
    }

    /// FUNCTIONS

    /**
        @notice Swaps the exact given amount of input asset for some amount of output asset

        @param inputToken The address of the input token to be swapped
        @param outputToken The address of the output token to be received
        @param amountIn The exact amount of input token to be swapped
        @param slippage How much slippage is allowed on the output amount to be received, as a
        percentage with `UniswapV3SwapLib.SLIPPAGE_DECIMALS` decimals
        @param maxDuration The maximum duration of the swap, in seconds, used to calculate
        the deadline from `now`

        @dev It uses the information provided by the `UniswapV3OracleUpgradeable` contract to
        determine the path to use for the swap and the expected price for the swap.

        @dev This contract assumes that the input token is already owned by the contract itself
     */
    function _swapInput(
        address inputToken,
        address outputToken,
        uint256 amountIn,
        uint256 slippage,
        uint256 maxDuration
    ) internal returns (uint256 actualAmountOut) {
        SwapInfo memory swapInfo = getSwapInfo(inputToken, outputToken);

        require(
            swapInfo.inputToken == inputToken && swapInfo.outputToken == outputToken,
            "Swap info not found for the given token pair"
        );

        // TODO: price rate has to be passed as the price of the input token and the price of the output token
        // TODO: so the rate can be calculated inside PriceUtis
        uint256 expectedAmountOut = PriceUtils.toOutputAmount(swapInfo.expectedPriceRate, amountIn);

        UniswapV3SwapLib.SwapInputParameters memory swapParameters = UniswapV3SwapLib.SwapInputParameters({
            inputToken: inputToken,
            exactAmountIn: amountIn,
            expectedAmountOut: expectedAmountOut,
            slippage: slippage,
            maxDuration: maxDuration,
            swapPath: swapInfo.swapPath
        });

        actualAmountOut = _swapRouter.swapInput(swapParameters);
    }

    /**
        @notice Swaps some amount of input asset to obtain an exact amount of output asset

        @param inputToken The address of the input token to be swapped
        @param outputToken The address of the output token to be received
        @param amountOut The exact amount of output token to be received
        @param slippage How much slippage is allowed on the input amount to be swapped, as a
        percentage with `UniswapV3SwapLib.SLIPPAGE_DECIMALS` decimals
        @param maxDuration The maximum duration of the swap, in seconds, used to calculate
        the deadline from `now`

        @dev It uses the information provided by the `UniswapV3OracleUpgradeable` contract to
        determine the path to use for the swap and the expected price for the swap.

        @dev This contract assumes that the input token is already owned by the contract itself
        */
    function _swapOutput(
        address inputToken,
        address outputToken,
        uint256 amountOut,
        uint256 slippage,
        uint256 maxDuration
    ) internal returns (uint256 actualAmountIn) {
        SwapInfo memory swapInfo = getSwapInfo(inputToken, outputToken);

        require(
            swapInfo.inputToken == inputToken && swapInfo.outputToken == outputToken,
            "Swap info not found for the given token pair"
        );

        uint256 expectedAmountIn = PriceUtils.toInputAmount(swapInfo.expectedPriceRate, amountOut);

        UniswapV3SwapLib.SwapOutputParameters memory swapParameters = UniswapV3SwapLib.SwapOutputParameters({
            inputToken: inputToken,
            exactAmountOut: amountOut,
            expectedAmountIn: expectedAmountIn,
            slippage: slippage,
            maxDuration: maxDuration,
            swapPath: swapInfo.swapPath
        });

        actualAmountIn = _swapRouter.swapOutput(swapParameters);
    }

    /**
        @notice Returns the current swap router address
     */
    function getSwapRouter() public view returns (ISwapRouter) {
        return _swapRouter;
    }

    /**
        @notice Returns the output amount that can be received from the given input amount,
        when swapping from the input token to the output token

        @param inputToken The address of the input token to be swapped
        @param outputToken The address of the output token to be received
        @param amountIn The exact amount of input token to be swapped
     */
    function getSwapOutputAmount(
        address inputToken,
        address outputToken,
        uint256 amountIn
    ) public view returns (uint256) {
        SwapInfo memory swapInfo = getSwapInfo(inputToken, outputToken);
        return PriceUtils.toOutputAmount(swapInfo.expectedPriceRate, amountIn);
    }

    /**
        @notice Returns the input amount needed to receive the exact given output amount,
        when swapping from the input token to the output token

        @param inputToken The address of the input token to be swapped
        @param outputToken The address of the output token to be received
        @param amountOut The exact amount of output token to be received
     */
    function getSwapInputAmount(
        address inputToken,
        address outputToken,
        uint256 amountOut
    ) public view returns (uint256) {
        SwapInfo memory swapInfo = getSwapInfo(inputToken, outputToken);
        return PriceUtils.toInputAmount(swapInfo.expectedPriceRate, amountOut);
    }
}
