import type { IPotionLiquidityPool } from "@potion-protocol/hedging-vault/typechain";
import { Protocol, Trade } from "@uniswap/router-sdk";
import { type Currency, TradeType } from "@uniswap/sdk-core";
import type { MethodParameters, Pool } from "@uniswap/v3-sdk";

import type { Token } from "dapp-types";
import type { BigNumberish } from "ethers";

export enum UniswapActionType {
  ENTER_POSITION = "ENTER_POSITION",
  EXIT_POSITION = "EXIT_POSITION",
}
export interface UniswapRoute {
  percent: number;
  protocol: Protocol;
  poolAddresses: string[];
  inputToken: Token;
  outputToken: Token;
  inputAmount: BigNumberish;
  outputAmount: BigNumberish;

  quoteGasAdjusted: BigNumberish;
  pools: Pool[];
  tokensPath: Token[];
}

export interface UniswapRouterReturn {
  routes: UniswapRoute[];
  trade: Trade<Currency, Currency, TradeType>;
  tradeExecutionPrice: BigNumberish;
  methodParameters: MethodParameters | undefined;
  estimatedGasUsed: BigNumberish;
  estimatedGasUsedUSD: BigNumberish;
}

export type Sellers = IPotionLiquidityPool.CounterpartyDetailsStruct[];

export interface UniSwapInfo {
  steps: Array<{ inputToken: Token; fee: number }>;
  outputToken: Token;
  expectedPriceRate: BigNumberish; //The expected price of the swap as a fixed point SD59x18 number
}

export interface PotionBuyInfo {
  targetPotionAddress: string;
  underlyingAsset: string;
  strikePriceInUSDC: number;
  expirationTimestamp: BigNumberish;
  sellers: Sellers;
  expectedPremiumInUSDC: number;
}
