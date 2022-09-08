import { Protocol, Trade } from "@uniswap/router-sdk";
import { type Currency, TradeType } from "@uniswap/sdk-core";
import type { MethodParameters, Pool } from "@uniswap/v3-sdk";

import type { Token } from "dapp-types";
import type { BigNumberish } from "ethers";

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
