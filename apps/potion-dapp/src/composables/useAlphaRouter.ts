import { ref } from "vue";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  AlphaRouter,
  ChainId,
  CurrencyAmount,
  type SwapRoute,
} from "@uniswap/smart-order-router";
import { TradeType, Percent, Token } from "@uniswap/sdk-core";
import JSBI from "jsbi";

import { uniswapRpcUrl } from "@/helpers";

export const useAlphaRouter = (chainId: ChainId) => {
  const initAlphaRouter = () => {
    const web3Provider = new JsonRpcProvider(uniswapRpcUrl);
    return new AlphaRouter({
      chainId: chainId,
      provider: web3Provider,
    });
  };

  const routerData = ref<SwapRoute | undefined>();
  const routerPolling = ref(false);
  const routerLoading = ref(false);
  const routerError = ref<string | null>(null);

  // Toggle polling for routes
  const togglePolling = (newState?: boolean) => {
    if (newState !== undefined) {
      routerPolling.value = newState;
    } else {
      routerPolling.value = !routerPolling.value;
    }
  };

  //
  /**
   * Get a swap route from input Token to output Token for a specific amount
   *
   * @param inputToken The token to swap from
   * @param outputToken The token to swap to
   * @param tradeType Type of the trade. either EXACT_INPUT or EXACT_OUTPUT.
   * @param tokenAmount For EXACT_INPUT swaps this is the input token amount. For EXACT_OUTPUT swaps this is the output token amount to expect from the swap.
   * @param maxSplits Max number of split routes to allow
   * @param recipientAddress The address of the recipient for each trade hop
   * @param deadlineTimestamp
   * @param slippageToleranceInteger
   *
   */
  const getRoute = async (
    inputToken: Token,
    outputToken: Token,
    tradeType: TradeType,
    tokenAmount: number,
    maxSplits: number,
    recipientAddress: string,
    deadlineTimestamp: number,
    slippageToleranceInteger = 1
  ) => {
    routerError.value = null;
    routerLoading.value = true;

    try {
      const inputTokenSwap =
        tradeType === TradeType.EXACT_INPUT ? inputToken : outputToken;
      const outputTokenSwap =
        tradeType === TradeType.EXACT_INPUT ? outputToken : inputToken;

      const tokenAmountWithDecimals =
        Math.ceil(tokenAmount) * 10 ** inputTokenSwap.decimals;
      const deadline =
        deadlineTimestamp !== undefined
          ? deadlineTimestamp
          : Math.floor(Date.now() / 1000 + 1800);

      const currencyAmount = CurrencyAmount.fromRawAmount(
        inputTokenSwap,
        JSBI.BigInt(tokenAmountWithDecimals.toString()) // TODO check
      );

      console.log(
        "QUERY ALPHA FOR AMOUNT",
        tokenAmount,
        currencyAmount.currency.name
      );
      const alphaRouter = initAlphaRouter();
      const route = await alphaRouter.route(
        currencyAmount,
        outputTokenSwap,
        tradeType,
        {
          recipient: recipientAddress,
          slippageTolerance: new Percent(slippageToleranceInteger, 100),
          deadline: deadline,
        },
        {
          maxSplits: maxSplits,
        }
      );

      if (!route) {
        throw new Error("No route found");
      }

      // Ugly hack to fix typescript typing
      routerData.value = route || undefined;
    } catch (error) {
      routerError.value =
        error instanceof Error
          ? `Cannot get uniswap route: ${error.message}`
          : "Cannot get uniswap route";
      routerData.value = undefined;

      console.log(error);
    } finally {
      routerLoading.value = false;
    }
  };

  return {
    routerData,
    routerPolling,
    routerLoading,
    togglePolling,
    getRoute,
  };
};
