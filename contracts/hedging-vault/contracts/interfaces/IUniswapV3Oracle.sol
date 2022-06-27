/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title IUniswapV3Oracle

    @notice Oracle contract for Uniswap V3 swaps. It takes care of holding information about the
    path to use for a specific swap, and the expected price for a that swap.
 */
interface IUniswapV3Oracle {
    /**
        @notice The information required to perform a safe swap

        @custom:member inputToken The address of the input token in the swap
        @custom:member outputToken The address of the output token in the swap
        @custom:member expectedPriceRate The expected price of the swap as a fixed point SD59x18 number
        @custom:member swapPath The path to use for the swap as an ABI encoded array of bytes

        @dev See [Multi-hop Swaps](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps) for
        more information on the `swapPath` format
     */
    struct SwapInfo {
        address inputToken;
        address outputToken;
        uint256 expectedPriceRate;
        bytes swapPath;
    }

    /// FUNCTIONS

    /**
        @notice Sets the swap information for an input/output token pair. The information
        includes the swap path and the expected swap price

        @param info The swap information for the pair

        @dev Only the Keeper role can call this function

        @dev See { SwapInfo }
     */
    function setSwapInfo(SwapInfo calldata info) external;

    /**
        @notice Gets the swap information for the given input/output token pair

        @param inputToken The address of the input token in the swap
        @param outputToken The address of the output token in the swap

        @return The swap information for the pair

     */
    function getSwapInfo(address inputToken, address outputToken) external view returns (SwapInfo memory);
}
