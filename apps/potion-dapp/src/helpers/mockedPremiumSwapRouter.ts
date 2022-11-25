import JSBI from "jsbi";
import { BigNumber } from "ethers";
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

/**
 *  Runs the potion depth router and returns the premium and a set of counterparties
 *
 * @param orderSizeInUSDC Order size to run the potion router for, expressed as USDC
 * @param pools Set of pools to use when looking for a match
 * @param strikePriceUSDC Current strike price in USDC
 * @param gas The gas price expressed in WEI
 * @param ethPrice The ETH price expressed in dollars
 * @returns an object with the premium, the premium + gas and an array of counterparties
 */
const getPotionRoute = async (
  orderSizeInUSDC: number,
  pools: IPoolUntyped[],
  strikePriceUSDC: number,
  gas: number,
  ethPrice: number
): Promise<DepthRouterReturn> => {
  console.log("- MOCKED PREMIUM SWAP ROUTER PARAMS");
  console.table([
    {
      orderSizeInUSDC,
      pools,
      strikePriceUSDC,
      gas,
      ethPrice,
    },
  ]);

  const potionRouter = runDepthRouter(
    pools,
    orderSizeInUSDC,
    strikePriceUSDC,
    gas,
    ethPrice
  );

  return potionRouter;
};

export { getUniswapRoute, getPotionRoute };
