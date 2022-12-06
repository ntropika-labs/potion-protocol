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

/**
 * Get the current chain id based on the `VITE_ETHEREUM_NETWORK` env variable
 */
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

/**
 * Constant reference to the USDC UniswapToken
 */
const USDCUniToken = new UniswapToken(
  getChainId(),
  contractsAddresses.USDC.address,
  6,
  "USDC",
  "USD//C"
);

/**
 * Convert an instance of UniswapToken to an object matching the Token interface
 * @param uniToken Instance of the token we want to convert
 * @returns An object matching the internal Token interface for the uniswap token supplied as input
 */
const convertUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
    decimals: uniToken.decimals,
  };
};
/**
 * Convert an instance of the Token interface to an an instance of the UniswapToken class
 * @param token Instance of the token we want to convert
 * @returns An instance of the uniswap Token class
 */
const convertTokenToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

/**
 * Convert an instance of uniswap SwapRoute to an instance of UniswapRouterReturn containing only the info of use
 * @param uniRoute An instance of the uniswap alpha router SwapRoute
 * @param actionType The type of operation associated with this route, either `ENTER_POSITION` or `EXIT_POSITION`, to hint how to parse the data
 * @returns A flat object representation of the uniswap SwapRoute containing only the information of use
 */
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

/**
 * Convert the UniswapRouter return object containing all route info to an instance of UniswapInfo
 * only containing data about the swap steps and the expected price rate
 * @param routerReturn UniswapRouterReturn instance with data from the uniswap alpha router SwapRoute
 * @param uniswapActionType Type of operation associated with this route, either `ENTER_POSITION` or `EXIT_POSITION`, to hint how to parse the data
 * @param oraclePrice The current oracle price
 * @param inputToken The Token we are swapping from
 * @param outputToken The Token we are swapping to
 * @returns An object containing the minimal representation for the swap route
 */
const evaluateUniswapRoute = (
  routerReturn: UniswapRouterReturn,
  uniswapActionType: UniswapActionType,
  oraclePrice: number,
  inputToken: Token,
  outputToken: Token
): UniSwapInfo => {
  // TODO: inputToken and outputToken can be parse from the route
  const swapRoute = routerReturn.routes[0];
  const executionPrice = routerReturn.tradeExecutionPrice;
  // Only allow routes for the V3 of the protocol that have a defined execution price
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
