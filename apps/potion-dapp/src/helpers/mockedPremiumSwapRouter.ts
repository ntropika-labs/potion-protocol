import JSBI from "jsbi";
import { BigNumber, type BigNumberish } from "ethers";
import { Token, TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";
import {
  CurrencyAmount,
  parseFeeAmount,
  type ChainId,
} from "@uniswap/smart-order-router";
import { type MethodParameters, Pool } from "@uniswap/v3-sdk";

import { runDepthRouter } from "potion-router";

import type { DepthRouterReturn, IPoolUntyped } from "potion-router";
import type { Token as PotionToken } from "dapp-types";

import { UniswapActionType, type UniswapRouterReturn } from "@/types";
import { addPercentage, calculateOrderSize } from "hedging-vault-sdk";

console.log("Running a mocked version of 'premiumSwapRouter'");

const getUniswapRoute = async (
  chainId: ChainId,
  inputToken: PotionToken,
  outputToken: PotionToken,
  tradeType: TradeType,
  tokenAmount: number,
  _maxSplits: number,
  _recipientAddress: string,
  _slippageToleranceInteger?: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _actionType: UniswapActionType = UniswapActionType.ENTER_POSITION,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _deadlineTimestamp?: number
): Promise<UniswapRouterReturn> => {
  try {
    const inputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? inputToken : outputToken;

    const inputUniToken = new Token(
      chainId,
      inputTokenSwap.address,
      inputTokenSwap.decimals || 0,
      inputTokenSwap.symbol,
      inputTokenSwap.name
    );

    const tokenAmountWithDecimals =
      Math.ceil(tokenAmount) * 10 ** inputUniToken.decimals;

    const currencyAmount = CurrencyAmount.fromRawAmount(
      inputUniToken,
      JSBI.BigInt(tokenAmountWithDecimals.toString())
    ).toSignificant();

    const uniswapRouterResult: UniswapRouterReturn = {
      trade: JSON.parse(JSON.stringify({})),
      routes: [
        {
          protocol: Protocol.V3,
          inputToken: inputToken,
          outputToken: outputToken,
          inputAmount:
            tradeType === TradeType.EXACT_INPUT
              ? currencyAmount
              : "? (mocked alpha router)",
          outputAmount:
            tradeType === TradeType.EXACT_INPUT
              ? "? (mocked alpha router)"
              : currencyAmount,
          quoteGasAdjusted:
            tradeType === TradeType.EXACT_INPUT ? currencyAmount : "?",
          poolAddresses: ["0xMOCKED"],
          pools: [
            {
              fee: parseFeeAmount("500"),
            } as Pool,
          ],
          percent: 100,
          tokensPath: [inputToken, outputToken],
        },
      ],
      tradeExecutionPrice: BigNumber.from(0),
      methodParameters: { calldata: "", value: "" } as MethodParameters,
      estimatedGasUsed: "?",
      estimatedGasUsedUSD: "?",
    };

    return uniswapRouterResult;
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
  // POTION ROUTER
  const potionRouterWithPremium = runDepthRouter(
    pools,
    principalHedgedAmount,
    strikePriceUSDC,
    gas,
    ethPrice
  );

  // TODO: check
  const orderSize = calculateOrderSize(
    principalHedgedAmount,
    inputToken.decimals || "6",
    hedgingRate,
    strikePercent,
    strikePriceUSDC,
    potionRouterWithPremium.premium
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
