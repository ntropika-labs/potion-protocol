import type { Ref } from "vue";
import { Token as UniswapToken } from "@uniswap/sdk-core";

import { contractsAddresses } from "@/helpers/contracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";

import type { Token } from "dapp-types";

import type {
  SwapRoute,
  V3RouteWithValidQuote,
} from "@uniswap/smart-order-router";
import { UniswapActionType, type UniswapRouterReturn } from "@/types";

import { useUserData } from "@/composables/useUserData";
import { Trade } from "@uniswap/router-sdk";

const convertUniswapRouteToFlatRoute = (
  uniRoute: SwapRoute,
  actionType: UniswapActionType
) => {
  console.log("UNIROUTE", uniRoute);
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

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    getWETHAddress(),
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertQuoteUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: contractsAddresses.USDC.address,
    decimals: uniToken.decimals,
  };
};

const convertUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
    decimals: uniToken.decimals,
  };
};

const getEnterExpectedPriceRate = (
  oraclePrice: Ref<number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Trade<never, never, never>
) => {
  return oraclePrice.value; // default to 1000
};

const getExitExpectedPriceRate = (
  oraclePrice: Ref<number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Trade<never, never, never>
) => {
  return 1 / oraclePrice.value; // default to 0.001,
};

const getRecipientAddress = (): string => {
  const { walletAddress } = useUserData(false);

  return walletAddress.value;
};

const evaluatePremium = (routerPremium: number, premiumSlippage: number) =>
  routerPremium + (premiumSlippage * routerPremium) / 100;

export {
  convertUniswapRouteToFlatRoute,
  convertUniswapTokenToToken,
  convertCollateralToUniswapToken,
  convertQuoteUniswapTokenToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
  getRecipientAddress,
  evaluatePremium,
};
