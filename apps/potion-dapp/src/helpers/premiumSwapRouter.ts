import JSBI from "jsbi";
import type { ChainId } from "@uniswap/smart-order-router";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Percent, Token, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, CurrencyAmount } from "@uniswap/smart-order-router";

import type { Token as PotionToken } from "dapp-types";
import { uniswapRpcUrl } from "./";
import {
  runDepthRouter,
  type DepthRouterReturn,
  type IPoolUntyped,
} from "potion-router";
import {
  convertCollateralToUniswapToken,
  convertUniswapRouteToFlatRoute,
  evaluatePremium,
} from "./vaultOperatorTokens";
import type { UniswapRouterReturn } from "@/types";

// See import { Protocol as OriginalProtocol } from "@uniswap/router-sdk";
enum Protocol {
  V2 = "V2",
  V3 = "V3",
}

const initUniswapAlphaRouter = (chainId: ChainId) => {
  const web3Provider = new JsonRpcProvider(uniswapRpcUrl);
  return new AlphaRouter({
    chainId: chainId,
    provider: web3Provider,
  });
};

const getUniswapRoute = async (
  chainId: ChainId,
  inputToken: PotionToken,
  outputToken: Token | PotionToken,
  tradeType: TradeType,
  tokenAmount: number,
  maxSplits: number,
  recipientAddress: string,
  slippageToleranceInteger = 1,
  actionType: "enter" | "exit" = "enter",
  deadlineTimestamp?: number
): Promise<UniswapRouterReturn> => {
  try {
    const inputUniToken = convertCollateralToUniswapToken(inputToken);
    const outputUniToken = new Token(
      chainId,
      outputToken.address,
      outputToken.decimals || 0,
      outputToken.symbol,
      outputToken.name
    );
    const inputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? inputUniToken : outputUniToken;
    const outputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? outputToken : inputUniToken;

    const tokenAmountWithDecimals =
      Math.ceil(tokenAmount) * 10 ** inputUniToken.decimals;
    const deadline =
      deadlineTimestamp !== undefined
        ? deadlineTimestamp
        : Math.floor(Date.now() / 1000 + 1800);

    const currencyAmount = CurrencyAmount.fromRawAmount(
      inputTokenSwap,
      JSBI.BigInt(tokenAmountWithDecimals.toString()) // TODO check
    );

    console.log(
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

    const alphaRouter = initUniswapAlphaRouter(chainId);
    const protocols: Protocol[] = [Protocol.V3];

    const route = await alphaRouter.route(
      currencyAmount,
      outputUniToken,
      tradeType,
      {
        recipient: recipientAddress,
        slippageTolerance: new Percent(slippageToleranceInteger, 100),
        deadline: deadline,
      },
      {
        maxSplits: maxSplits,
        protocols: protocols,
      }
    );

    if (!route || route === undefined) {
      throw new Error("No route found");
    }

    return convertUniswapRouteToFlatRoute(route, actionType);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
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
  inputToken: PotionToken,
  outputToken: PotionToken | Token,
  tradeType: TradeType,
  maxSplits: number,
  premiumSlippage: number,
  recipientAddress: string,
  slippageToleranceInteger = 1,
  deadlineTimestamp?: number
): Promise<{
  potionRouterResult: DepthRouterReturn;
  uniswapRouterResult: UniswapRouterReturn;
}> => {
  const potionRouter = runDepthRouter(
    pools,
    initialOrderSize,
    strikePriceUSDC,
    gas,
    ethPrice
  );

  const totalAmountToSwap = evaluatePremium(
    potionRouter.premium,
    premiumSlippage
  );

  console.log(
    "totalAmountToSwap",
    //inputToken.equals(outputToken),
    inputToken,
    outputToken,
    chainId,
    pools,
    initialOrderSize,
    strikePriceUSDC,
    gas,
    ethPrice,
    potionRouter.premium,
    totalAmountToSwap
  );

  const uniswapResult = await getUniswapRoute(
    chainId,
    inputToken,
    outputToken,
    tradeType,
    totalAmountToSwap,
    maxSplits,
    recipientAddress,
    slippageToleranceInteger,
    "enter",
    deadlineTimestamp
  );

  // Fix serialization issues, strips methods from the object
  //const serializedRoute = JSON.parse(JSON.stringify(uniswapResult));

  return {
    potionRouterResult: potionRouter,
    uniswapRouterResult: uniswapResult,
  };
};

export { getUniswapRoute, runPremiumSwapRouter };
