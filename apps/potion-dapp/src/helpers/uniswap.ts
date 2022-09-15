// TODO: Add USDC and WETH address for goerli

import { ChainId } from "@uniswap/smart-order-router";
import { Token as UniswapToken } from "@uniswap/sdk-core";

import type {
  SwapRoute,
  V3RouteWithValidQuote,
} from "@uniswap/smart-order-router";

import type { Token } from "dapp-types";

import { UniswapActionType, type UniswapRouterReturn } from "@/types";

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
    default:
      return ChainId.MAINNET;
  }
};

const getUSDCAddress = () => {
  switch (import.meta.env.VITE_ETHEREUM_NETWORK) {
    case "goerli":
      return "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7";
    default:
      return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  }
};

const getWETHAddress = () => {
  switch (import.meta.env.VITE_ETHEREUM_NETWORK) {
    case "goerli":
      return "0x9889DfADE1d68488590DF17bbA882914535a8F92";
    default:
      return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  }
};

const USDCUniToken = new UniswapToken(
  getChainId(),
  getUSDCAddress(),
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

export {
  USDCUniToken,
  getChainId,
  getUSDCAddress,
  getWETHAddress,
  convertUniswapRouteToFlatRoute,
  convertTokenToUniswapToken,
  convertUniswapTokenToToken,
  Protocol,
};
