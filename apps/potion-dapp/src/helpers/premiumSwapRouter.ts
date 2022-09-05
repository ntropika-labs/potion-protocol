import JSBI from "jsbi";
import { runDepthRouter } from "potion-router";

import { JsonRpcProvider } from "@ethersproject/providers";
import { Percent, Token, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, CurrencyAmount } from "@uniswap/smart-order-router";

import { uniswapRouterUrl } from "./";

import type { IPoolUntyped } from "potion-router";
import type { ChainId } from "@uniswap/smart-order-router";

const initUniswapAlphaRouter = (chainId: ChainId) => {
  const web3Provider = new JsonRpcProvider(uniswapRouterUrl);
  return new AlphaRouter({
    chainId: chainId,
    provider: web3Provider,
  });
};

const getUniswapRoute = async (
  chainId: ChainId,
  inputToken: Token,
  outputToken: Token,
  tradeType: TradeType,
  tokenAmount: number,
  maxSplits: number,
  recipientAddress: string,
  deadlineTimestamp: number,
  slippageToleranceInteger = 1
) => {
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

    const alphaRouter = initUniswapAlphaRouter(chainId);
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

    if (!route || route === undefined) {
      throw new Error("No route found");
    }
    return route;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    {
      throw new Error("No route found");
    }
  }
};

const runPremiumSwapRouter = async (
  pools: IPoolUntyped[],
  initialOrderSize: number,
  strikePriceUSDC: number,
  gas: number,
  ethPrice: number,
  chainId: ChainId,
  inputToken: Token,
  outputToken: Token,
  tradeType: TradeType,
  maxSplits: number,
  recipientAddress: string,
  deadlineTimestamp: number,
  slippageToleranceInteger = 1
) => {
  const potionRouter = await runDepthRouter(
    pools,
    initialOrderSize,
    strikePriceUSDC,
    gas,
    ethPrice
  );
  const route = await getUniswapRoute(
    chainId,
    inputToken,
    outputToken,
    tradeType,
    potionRouter.premium,
    maxSplits,
    recipientAddress,
    slippageToleranceInteger,
    deadlineTimestamp
  );

  return { potionRouter, route };
};

export { runPremiumSwapRouter };
