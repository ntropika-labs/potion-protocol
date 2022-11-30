// TODO: Add USDC and WETH address for goerli

import { ChainId } from "@uniswap/smart-order-router";
import { Token as UniswapToken } from "@uniswap/sdk-core";

import type {
  SwapRoute,
  V3RouteWithValidQuote,
} from "@uniswap/smart-order-router";

import type { Token } from "dapp-types";

import {
  UniswapActionType,
  type UniSwapInfo,
  type UniswapRouterReturn,
} from "@/types";
import { getExpectedPriceRate } from "@vault-operator-utils";
import { contractsAddresses } from "@/helpers/contracts";

// The alphaRouter expectes only V2 or V3 as protocol config and not also MIXED so we can't import the Protocol enum from uniswap sdk
// as a workaround we just redeclare it here, hoping that uniswap decides to actually expose this enum from the router package
enum Protocol {
  V2 = "V2",
  V3 = "V3",
}

const getChainId = () => {
  switch (import.meta.env.VITE_ETHEREUM_NETWORK) {
    case "goerli":
      return ChainId.GÖRLI;
    case "ply-mumbai.testcomp":
      return ChainId.POLYGON_MUMBAI;
    default:
      return ChainId.MAINNET;
  }
};

const USDCUniToken = new UniswapToken(
  getChainId(),
  contractsAddresses.USDC.address,
  6,
  "USDC",
  "USD//C"
);

const convertUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
    decimals: uniToken.decimals,
  };
};

const convertTokenToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertUniswapRouteToFlatRoute = (
  uniRoute: SwapRoute,
  actionType: UniswapActionType
) => {
  const routes = uniRoute.route as V3RouteWithValidQuote[];

  const isEnterPosition = actionType === UniswapActionType.ENTER_POSITION;
  const tradeExecutionPrice = isEnterPosition
    ? uniRoute.trade.executionPrice.toSignificant(18)
    : uniRoute.trade.executionPrice.invert().toSignificant(18);

  const uniswapRouterResult: UniswapRouterReturn = {
    trade: JSON.parse(JSON.stringify(uniRoute.trade)),
    routes: routes.map((route: V3RouteWithValidQuote) => {
      const quoteToken = convertUniswapTokenToToken(route.quoteToken);
      const amountToken = convertUniswapTokenToToken(
        route.amount.currency.wrapped
      );
      const quoteTokenAmount = route.quote.toSignificant(
        route.quoteToken.decimals
      );
      const amountTokenAmount = route.amount.toSignificant(
        route.amount.currency.wrapped.decimals
      );

      return {
        protocol: route.protocol,
        inputToken: isEnterPosition ? quoteToken : amountToken,
        outputToken: isEnterPosition ? amountToken : quoteToken,
        inputAmount: isEnterPosition ? quoteTokenAmount : amountTokenAmount,
        outputAmount: isEnterPosition ? amountTokenAmount : quoteTokenAmount,
        quoteGasAdjusted: route.quoteAdjustedForGas.toSignificant(
          route.quoteToken.decimals
        ),
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

const evaluateUniswapRoute = (
  routerReturn: UniswapRouterReturn,
  uniswapActionType: UniswapActionType,
  oraclePrice: number,
  inputToken: Token,
  outputToken: Token
): UniSwapInfo => {
  const swapRoute = routerReturn.routes[0];
  const executionPrice = routerReturn.tradeExecutionPrice;
  if (swapRoute && swapRoute.protocol === Protocol.V3 && executionPrice) {
    const firstPoolFee = swapRoute.pools[0].fee;
    const expectedPriceRate = getExpectedPriceRate(
      oraclePrice,
      executionPrice,
      uniswapActionType
    );
    const swapInfo = {
      steps: [
        {
          inputToken,
          fee: firstPoolFee,
        },
      ],
      outputToken,
      expectedPriceRate: expectedPriceRate, // this value needs to be = to the swap route price rate. Ex: eth is 100 at the time of swap, the value is 1 / 100
    };

    return swapInfo;
  } else {
    throw new Error("swapRoute isn't a protocol v3 route");
  }
};

export {
  USDCUniToken,
  getChainId,
  convertUniswapRouteToFlatRoute,
  convertTokenToUniswapToken,
  convertUniswapTokenToToken,
  evaluateUniswapRoute,
  Protocol,
};
