import type { Ref } from "vue";
import { Token as UniswapToken } from "@uniswap/sdk-core";
import type {
  SwapRoute,
  V3RouteWithValidQuote,
} from "@uniswap/smart-order-router";
import type { BigNumberish } from "ethers";

import type { Token } from "dapp-types";

import { contractsAddresses } from "./hedgingVaultContracts";
import { getChainId } from "@/helpers/uniswap";
import { UniswapActionType, type UniswapRouterReturn } from "@/types";

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

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertQuoteUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
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
  _: Ref<number>,
  tradePrice: BigNumberish
) => {
  return tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

const getExitExpectedPriceRate = (_: Ref<number>, tradePrice: BigNumberish) => {
  return tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

const getRecipientAddress = (): string => {
  const { PotionBuyAction } = contractsAddresses;

  return PotionBuyAction.address;
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
