import { Token as UniswapToken } from "@uniswap/sdk-core";

import { contractsAddresses } from "@/helpers/contracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";

import type { Ref } from "vue";
import type { Token } from "dapp-types";

import type {
  SwapRoute,
  V3RouteWithValidQuote,
} from "@uniswap/smart-order-router";
import type { UniswapRouterReturn } from "@/types";
import type { BigNumberish } from "ethers";

const IS_DEV_ENV = import.meta.env.DEV;

const convertUniswapRouteToFlatRoute = (
  uniRoute: SwapRoute,
  actionType: "enter" | "exit"
) => {
  const routes = uniRoute.route as V3RouteWithValidQuote[];

  const tradeExecutionPrice =
    actionType === "enter"
      ? uniRoute.trade.executionPrice.toSignificant(18)
      : uniRoute.trade.executionPrice.invert().toSignificant(18);

  const uniswapRouterResult: UniswapRouterReturn = {
    trade: JSON.parse(JSON.stringify(uniRoute.trade)),
    routes: routes.map((route: V3RouteWithValidQuote) => {
      return {
        protocol: route.protocol,
        inputToken: route.quoteToken as Token,
        outputToken: route.amount.currency as Token,
        inputAmount: route.quote.toExact(),
        outputAmount: route.amount.toExact(),
        quoteGasAdjusted: route.quoteAdjustedForGas.toExact(),
        poolAddresses: route.poolAddresses,
        pools: route.route.pools,
        percent: route.percent,
        tokensPath: route.tokenPath.map((t) => t as Token),
      };
    }),
    tradeExecutionPrice: tradeExecutionPrice,
    methodParameters: uniRoute.methodParameters,
    estimatedGasUsed: uniRoute.estimatedGasUsed.toString(),
    estimatedGasUsedUSD: uniRoute.estimatedGasUsedUSD.toExact(),
  };

  return uniswapRouterResult;
};

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    IS_DEV_ENV ? getWETHAddress() : token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertInputToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: IS_DEV_ENV ? contractsAddresses.USDC.address : uniToken.address,
    decimals: uniToken.decimals,
  };
};

const getEnterExpectedPriceRate = (
  oraclePrice: Ref<number>,
  tradePrice: BigNumberish
) => {
  return IS_DEV_ENV
    ? oraclePrice.value //1000,
    : tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

const getExitExpectedPriceRate = (
  oraclePrice: Ref<number>,
  tradePrice: BigNumberish
) => {
  return IS_DEV_ENV
    ? 1 / oraclePrice.value //0.001,
    : tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

const evaluatePremium = (routerPremium: number, premiumSlippage: number) =>
  routerPremium + (premiumSlippage * routerPremium) / 100;

export {
  convertUniswapRouteToFlatRoute,
  convertCollateralToUniswapToken,
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
  evaluatePremium,
};
