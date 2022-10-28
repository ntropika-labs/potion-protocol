import JSBI from "jsbi";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
  AlphaRouter,
  CurrencyAmount,
  type ChainId,
} from "@uniswap/smart-order-router";

import { uniswapRpcUrl } from "./constants";
import { runDepthRouter } from "potion-router";
import { convertCollateralToUniswapToken } from "@vault-operator-utils";

import type { DepthRouterReturn, IPoolUntyped } from "potion-router";
import type { Token as PotionToken } from "dapp-types";

import { UniswapActionType, type UniswapRouterReturn } from "@/types";
import { convertUniswapRouteToFlatRoute, Protocol } from "@/helpers/uniswap";
import { addPercentage, calculateOrderSize } from "hedging-vault-sdk";
import { BigNumber, type BigNumberish } from "ethers";

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
  outputToken: PotionToken,
  tradeType: TradeType,
  tokenAmount: number,
  maxSplits: number,
  recipientAddress: string,
  slippageToleranceInteger = 1,
  actionType: UniswapActionType = UniswapActionType.ENTER_POSITION,
  deadlineTimestamp?: number
): Promise<UniswapRouterReturn> => {
  try {
    const inputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? inputToken : outputToken;
    const outputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? outputToken : inputToken;

    const outputUniToken = convertCollateralToUniswapToken(outputTokenSwap);
    const inputUniToken = new Token(
      chainId,
      inputTokenSwap.address,
      inputTokenSwap.decimals || 0,
      inputTokenSwap.symbol,
      inputTokenSwap.name
    );

    const tokenAmountWithDecimals =
      Math.ceil(tokenAmount) * 10 ** inputUniToken.decimals;
    const deadline =
      deadlineTimestamp !== undefined
        ? deadlineTimestamp
        : Math.floor(Date.now() / 1000 + 1800);

    const currencyAmount = CurrencyAmount.fromRawAmount(
      inputUniToken,
      JSBI.BigInt(tokenAmountWithDecimals.toString())
    );

    const alphaRouter = initUniswapAlphaRouter(chainId);
    const protocols = [Protocol.V3];
    const slippageTolerance = new Percent(slippageToleranceInteger, 100);

    const route = await alphaRouter.route(
      currencyAmount,
      outputUniToken,
      tradeType,
      {
        recipient: recipientAddress,
        slippageTolerance,
        deadline,
      },
      {
        maxSplits,
        protocols,
      }
    );

    if (!route) {
      throw new Error("No route found");
    }

    return convertUniswapRouteToFlatRoute(route, actionType);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("No route found");
    }
  }
};

const runPremiumSwapRouter = async (
  hedgingRate: BigNumberish,
  strikePercent: BigNumberish,
  pools: IPoolUntyped[],
  principalHedgedAmount: number,
  strikePriceUSDC: number,
  gas: number,
  ethPrice: number,
  chainId: ChainId,
  inputToken: PotionToken,
  outputToken: PotionToken,
  tradeType: TradeType,
  maxSplits: number,
  premiumSlippage: number,
  recipientAddress: string,
  slippageToleranceInteger = 1,
  actionType: UniswapActionType = UniswapActionType.ENTER_POSITION,
  deadlineTimestamp?: number
): Promise<{
  potionRouterResult: DepthRouterReturn;
  uniswapRouterResult: UniswapRouterReturn;
}> => {
  console.table([
    { principalHedgedAmount, pools, strikePriceUSDC, gas, ethPrice },
  ]);
  // POTION ROUTER
  const potionRouterWithPremium = runDepthRouter(
    pools,
    principalHedgedAmount,
    strikePriceUSDC,
    gas,
    ethPrice
  );

  console.log(
    principalHedgedAmount,
    inputToken,
    hedgingRate,
    strikePercent,
    strikePriceUSDC,
    potionRouterWithPremium.premium
  );
  // TODO: check
  const orderSize = calculateOrderSize(
    principalHedgedAmount,
    inputToken.decimals || "6",
    hedgingRate,
    strikePercent,
    strikePriceUSDC,
    !Number.isNaN(potionRouterWithPremium.premium)
      ? potionRouterWithPremium.premium
      : 1
  );

  const potionRouter = runDepthRouter(
    pools,
    orderSize.effectiveVaultSize.toNumber(),
    strikePriceUSDC,
    gas,
    ethPrice
  );

  console.table([
    {
      inputToken: [inputToken.address, inputToken.decimals, inputToken.symbol],
      outputToken: [
        outputToken.address,
        outputToken.decimals,
        outputToken.symbol,
      ],
      chainId,
      pools: pools.map((p) => p.poolId),
      orderSize,
      routerPremium: potionRouterWithPremium,
      finalOrderSize: orderSize.effectiveVaultSize.toNumber(),
    },
  ]);

  // UNISWAP ROUTE
  const totalAmountToSwap = addPercentage(
    BigNumber.from(potionRouterWithPremium.premium),
    BigNumber.from(premiumSlippage)
  );

  const uniswapResult = await getUniswapRoute(
    chainId,
    inputToken,
    outputToken,
    tradeType,
    totalAmountToSwap.toNumber(),
    maxSplits,
    recipientAddress,
    slippageToleranceInteger,
    actionType,
    deadlineTimestamp
  );

  return {
    potionRouterResult: potionRouter,
    uniswapRouterResult: uniswapResult,
  };
};

export { getUniswapRoute, runPremiumSwapRouter };
