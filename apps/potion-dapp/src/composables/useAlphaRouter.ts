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

import { uniswapRouterUrl } from "@/helpers";

export const useAlphaRouter = (chainId: ChainId) => {
  const initAlphaRouter = () => {
    const web3Provider = new JsonRpcProvider(uniswapRouterUrl);
    return new AlphaRouter({
      chainId: chainId,
      provider: web3Provider,
    });
  };

  const routerData = ref<SwapRoute | null>(null);
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

  // Get a swap route from input Token to output Token for the input token amount
  const getRoute = async (
    inputToken: Token,
    inputTokenAmount: number,
    outputToken: Token,
    recipientAddress: string,
    tradeType: TradeType,
    deadlineTimestamp: number,
    slippageToleranceInteger = 1
  ) => {
    routerError.value = null;
    routerLoading.value = true;
    console.log(
      "GETTING ALPHA ROUTE",
      inputToken,
      inputTokenAmount,
      outputToken
    );
    try {
      const alphaRouter = initAlphaRouter();
      const deadline =
        deadlineTimestamp !== undefined
          ? deadlineTimestamp
          : Math.floor(Date.now() / 1000 + 1800);
      const tokenAmount = CurrencyAmount.fromRawAmount(
        inputToken,
        JSBI.BigInt(Math.ceil(inputTokenAmount).toString()) // TODO check
      );

      const route = await alphaRouter.route(
        tokenAmount,
        outputToken,
        tradeType,
        {
          recipient: recipientAddress,
          slippageTolerance: new Percent(slippageToleranceInteger, 100),
          deadline: deadline,
        },
        {
          maxSplits: 1, // TODO remove: assert here theres only 1 route returned (no split routes)
        }
      );
      console.log("ALPHA ROUTER ROUTE", route);

      console.log(`Quote Exact In: ${route?.quote.toFixed(2)}`);
      console.log(
        `Gas Adjusted Quote In: ${route?.quoteGasAdjusted.toFixed(2)}`
      );
      console.log(`Gas Used USD: ${route?.estimatedGasUsedUSD.toFixed(6)}`);

      if (!route) {
        throw new Error("No route found");
      }

      // TODO remove: assert here theres only 1 route returned (no split routes)
      if (route.route.length > 1) {
        console.log(route.route);
        throw new Error("No split routes allowed for token swapping");
      }

      routerData.value = route;
    } catch (error) {
      routerError.value =
        error instanceof Error
          ? `Cannot get uniswap route: ${error.message}`
          : "Cannot get uniswap route";

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
