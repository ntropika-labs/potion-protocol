import { ref } from "vue";
import { ChainId } from "@uniswap/smart-order-router";
import { TradeType } from "@uniswap/sdk-core";

import type { Token as PotionToken } from "dapp-types";
import { worker } from "@web-worker";
import type { UniswapActionType, UniswapRouterReturn } from "@/types";

export const useAlphaRouter = (chainId: ChainId) => {
  const routerData = ref<UniswapRouterReturn>();
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
    inputToken: PotionToken,
    outputToken: PotionToken,
    tradeType: TradeType,
    tokenAmount: number,
    maxSplits: number,
    recipientAddress: string,
    slippageToleranceInteger = 1,
    actionType: UniswapActionType,
    deadlineTimestamp?: number
  ) => {
    routerError.value = null;
    routerLoading.value = true;

    try {
      const route = await worker.getUniswapRoute(
        chainId,
        inputToken,
        outputToken,
        tradeType,
        tokenAmount,
        maxSplits,
        recipientAddress,
        slippageToleranceInteger,
        actionType,
        deadlineTimestamp
      );

      routerData.value = route;

      return route;
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
