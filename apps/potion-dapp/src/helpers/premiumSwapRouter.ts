import JSBI from "jsbi";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Percent, TradeType } from "@uniswap/sdk-core";
import {
  AlphaRouter,
  CurrencyAmount,
  type ChainId,
} from "@uniswap/smart-order-router";

import { uniswapRpcUrl } from "./constants";
import { runDepthRouter } from "potion-router";

import type { DepthRouterReturn, IPoolUntyped } from "potion-router";
import type { Token as PotionToken } from "dapp-types";

import { UniswapActionType, type UniswapRouterReturn } from "@/types";
import {
  convertTokenToUniswapToken,
  convertUniswapRouteToFlatRoute,
  Protocol,
} from "@/helpers/uniswap";
import { calculateOrderSize } from "hedging-vault-sdk";
import { type BigNumberish } from "ethers";
import { formatUnits } from "@ethersproject/units";
import { mockUnderlyingToken } from "@vault-operator-utils";

const initUniswapAlphaRouter = (chainId: ChainId) => {
  const web3Provider = new JsonRpcProvider(uniswapRpcUrl);
  return new AlphaRouter({
    chainId: chainId,
    provider: web3Provider,
  });
};

const getUniswapRoute = async (
  chainId: ChainId,
  inputToken: PotionToken,
  outputToken: PotionToken,
  tradeType: TradeType,
  tokenAmount: number,
  maxSplits: number,
  recipientAddress: string,
  slippageToleranceInteger = 1,
  actionType: UniswapActionType = UniswapActionType.ENTER_POSITION,
  deadlineTimestamp?: number
): Promise<UniswapRouterReturn> => {
  try {
    const inputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? inputToken : outputToken;
    const outputTokenSwap =
      tradeType === TradeType.EXACT_INPUT ? outputToken : inputToken;

    const outputUniToken = convertTokenToUniswapToken(outputTokenSwap);
    const inputUniToken = convertTokenToUniswapToken(inputTokenSwap);

    const tokenAmountWithDecimals =
      Math.ceil(tokenAmount) * 10 ** inputUniToken.decimals;
    const deadline =
      deadlineTimestamp !== undefined
        ? deadlineTimestamp
        : Math.floor(Date.now() / 1000 + 1800);

    const currencyAmount = CurrencyAmount.fromRawAmount(
      inputUniToken,
      JSBI.BigInt(tokenAmountWithDecimals.toString())
    );

    const alphaRouter = initUniswapAlphaRouter(chainId);
    const protocols = [Protocol.V3];
    const slippageTolerance = new Percent(slippageToleranceInteger, 100);

    console.log("RUNNING ALPHA ROUTER WITH PARAMETERS");
    console.table([
      {
        inputToken: [
          inputToken.address,
          inputToken.decimals,
          inputToken.symbol,
        ],
        outputToken: [
          outputToken.address,
          outputToken.decimals,
          outputToken.symbol,
        ],
        tokenAmount,
        tradeType,
        chainId,
      },
    ]);
    const route = await alphaRouter.route(
      currencyAmount,
      outputUniToken,
      tradeType,
      {
        recipient: recipientAddress,
        slippageTolerance,
        deadline,
      },
      {
        maxSplits,
        protocols,
      }
    );

    if (!route) {
      throw new Error("No route found");
    }

    return convertUniswapRouteToFlatRoute(route, actionType);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("No route found");
    }
  }
};

// enterPosition
const runPremiumSwapRouter = async ({
  vaultParameters,
  potionRouterParameters,
  uniswapParameters,
}: {
  vaultParameters: {
    principalHedgedAmount: number;
    hedgingRate: BigNumberish;
    strikePercent: BigNumberish;
    oraclePrice: BigNumberish;
  };
  potionRouterParameters: {
    pools: IPoolUntyped[];
    strikePriceUSDC: number;
    gas: number;
    ethPrice: number;
  };
  uniswapParameters: {
    chainId: ChainId;
    underlyingToken: PotionToken;
    collateralToken: PotionToken;
    tradeType: TradeType;
    maxSplits: number;
    premiumSlippage: number;
    recipientAddress: string;
    slippageToleranceInteger: number; // =1
    actionType: UniswapActionType; // = UniswapActionType.ENTER_POSITION
    deadlineTimestamp?: number;
  };
}): Promise<{
  potionRouterResult: DepthRouterReturn;
  uniswapRouterResult: UniswapRouterReturn;
}> => {
  console.log("- PREMIUM SWAP ROUTER PARAMS");
  console.table([
    {
      principalHedgedAmount: vaultParameters.principalHedgedAmount,
      pools: potionRouterParameters.pools,
      strikePriceUSDC: potionRouterParameters.strikePriceUSDC,
      gas: potionRouterParameters.gas,
      ethPrice: potionRouterParameters.ethPrice,
    },
  ]);

  // POTION ROUTER
  const potionRouterWithEstimatedPremium = runDepthRouter(
    potionRouterParameters.pools, // TODO: check pools may not match the order size
    vaultParameters.principalHedgedAmount *
      potionRouterParameters.strikePriceUSDC,
    potionRouterParameters.strikePriceUSDC,
    potionRouterParameters.gas,
    potionRouterParameters.ethPrice
  );

  console.log(
    "- POTION ROUTER WITH ESTIMATED PREMIUM (initialOrder/premium/orderSizeInOtokens)",
    vaultParameters.principalHedgedAmount *
      potionRouterParameters.strikePriceUSDC,
    potionRouterWithEstimatedPremium.premium,
    potionRouterWithEstimatedPremium.counterparties.map((c) =>
      formatUnits(c.orderSizeInOtokens.toString(), 8)
    )
  );

  // TODO: check
  const actualVaultSizeInUnderlying = calculateOrderSize(
    vaultParameters.principalHedgedAmount,
    uniswapParameters.underlyingToken.decimals as number,
    vaultParameters.hedgingRate,
    vaultParameters.strikePercent,
    vaultParameters.oraclePrice,
    potionRouterWithEstimatedPremium.premium.toFixed(
      uniswapParameters.collateralToken.decimals as number
    )
  );

  // TODO: conver to number with at least 16 digit after point
  const effectiveVaultSize = parseFloat(
    formatUnits(
      actualVaultSizeInUnderlying.effectiveVaultSize.toString(),
      uniswapParameters.underlyingToken.decimals
    )
  );

  const potionRouter = runDepthRouter(
    potionRouterParameters.pools, // TODO: check pools doesnt match the order size
    effectiveVaultSize * potionRouterParameters.strikePriceUSDC,
    potionRouterParameters.strikePriceUSDC,
    potionRouterParameters.gas,
    potionRouterParameters.ethPrice
  );

  console.log(
    "- POTION ROUTER WITH EFFECTIVE VAULT SIZE (initialOrder/premium/orderSizeInOtokens)",
    effectiveVaultSize * potionRouterParameters.strikePriceUSDC,
    potionRouter.premium,

    potionRouter.counterparties.map((c) =>
      formatUnits(c.orderSizeInOtokens.toString(), 8)
    )
  );

  // UNISWAP ROUTE
  const premiumWithSlippage =
    ((100 + uniswapParameters.premiumSlippage) * potionRouter.premium) / 100;
  console.log("- PREMIUM WITH SLIPPAGE", premiumWithSlippage);

  const underlyingTokenToSwap = mockUnderlyingToken(
    uniswapParameters.underlyingToken
  );

  const uniswapResult = await getUniswapRoute(
    uniswapParameters.chainId,
    underlyingTokenToSwap,
    uniswapParameters.collateralToken,
    uniswapParameters.tradeType,
    premiumWithSlippage,
    uniswapParameters.maxSplits,
    uniswapParameters.recipientAddress,
    uniswapParameters.slippageToleranceInteger,
    uniswapParameters.actionType,
    uniswapParameters.deadlineTimestamp
  );

  return {
    potionRouterResult: potionRouter,
    uniswapRouterResult: uniswapResult,
  };
};

export { getUniswapRoute, runPremiumSwapRouter };
