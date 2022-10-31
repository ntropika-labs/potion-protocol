import { computed, ref, unref, type Ref } from "vue";
import { TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";
import { BigNumber } from "ethers";

import {
  getChainId,
  USDCUniToken,
  convertUniswapTokenToToken,
} from "@/helpers/uniswap";
import {
  convertQuoteUniswapTokenToToken,
  getExpectedPriceRate,
  getRecipientAddress,
} from "@vault-operator-utils";

import { getContractsFromVault } from "@/helpers/hedgingVaultContracts";
import { useAlphaRouter } from "./useAlphaRouter";
import { useCollateralTokenContract } from "./useCollateralTokenContract";

import type {
  DepthRouterReturn,
  IRouterParameters as DepthRouterParameters,
} from "potion-router";
import type { Token } from "dapp-types";
import type { ActionPayout } from "./usePotionBuyActionContract";

import { worker } from "@web-worker/alpha-router";
import { UniswapActionType } from "@/types";
import type {
  UniswapRouterReturn,
  UniSwapInfo,
  Sellers,
  PotionBuyInfo,
} from "@/types";
import { useErc20Contract } from "./useErc20Contract";

export function useVaultOperatorActions(
  vaultAddress: string,
  underlyingAddress: Ref<string>,
  currentPayout: Ref<ActionPayout | undefined>,
  vaultTotalSupply: Ref<number>,
  outputVaultTotalShares: Ref<number>
) {
  const { swapToUSDCAction, potionBuyAction, roundsInputVault } =
    getContractsFromVault(vaultAddress);
  const { fetchActionBalance } = useCollateralTokenContract();
  const {
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  const { getTokenBalance } = useErc20Contract(underlyingAddress);

  const totalAmountToSwap = ref(0);
  const enterPositionData: Ref<{
    potionRouterResult: DepthRouterReturn;
    uniswapRouterResult: UniswapRouterReturn;
  } | null> = ref(null);
  const exitPositionData: Ref<{
    uniswapRouterResult: UniswapRouterReturn;
  } | null> = ref(null);
  const fallbackExitPositionData: Ref<UniswapRouterReturn | null> = ref(null);
  const fallbackEnterPositionData: Ref<UniswapRouterReturn | null> = ref(null);
  const swapRouterLoading = ref(false);

  /**
   * FLAGS
   */

  const hasRoute = (
    uniswapRouterResult: UniswapRouterReturn | undefined | null
  ) => {
    return (
      ((uniswapRouterResult && uniswapRouterResult.routes?.length) ?? 0) > 0
    );
  };

  const isTotalAmountValid = computed(
    () => !Number.isNaN(totalAmountToSwap.value)
  );
  const hasCounterparties = computed(
    () =>
      ((enterPositionData.value &&
        enterPositionData.value.potionRouterResult?.counterparties?.length) ??
        0) > 0
  );

  const isEnterPositionOperationValid = computed(() => {
    return (
      isTotalAmountValid.value &&
      hasCounterparties.value &&
      hasRoute(enterPositionData.value?.uniswapRouterResult)
    );
  });

  const isExitPositionOperationValid = computed(() => {
    const isValidPayout =
      isTotalAmountValid.value &&
      totalAmountToSwap.value > 0 &&
      hasRoute(exitPositionData.value?.uniswapRouterResult);

    const hasNoPayout =
      totalAmountToSwap.value === 0 && !currentPayout.value?.currentPayout;

    console.log(
      "EXIT VALID",
      totalAmountToSwap.value,
      !currentPayout.value?.currentPayout
    );
    return isValidPayout || hasNoPayout;
  });

  const isActionLoading = computed(
    () => routerLoading.value || swapRouterLoading.value
  );

  const getTotalPayout = async () => {
    const payout = currentPayout.value?.currentPayout || 0;
    const premiumLeftovers = await fetchActionBalance(potionBuyAction);

    return payout + premiumLeftovers;
  };

  /**
   * METHODS
   */

  const loadEnterPositionRoute = async (
    hedgingRate: Ref<number>,
    strikePercent: Ref<number>,
    potionRouterParameters: Ref<DepthRouterParameters>,
    oraclePrice: Ref<number>,
    collateralToken: Ref<Token>,
    premiumSlippage: Ref<number>,
    swapSlippage: Ref<number>,
    maxSplits = 1
  ) => {
    try {
      swapRouterLoading.value = true;
      const totalPayout = await getTotalPayout();
      const rawPotionrouterParams = unref(potionRouterParameters);

      const USDCToken = convertUniswapTokenToToken(USDCUniToken);
      const recipientAddress = getRecipientAddress(vaultAddress);

      const exitSwapAmountInUnderlying = totalPayout / oraclePrice.value;
      const actionUnderlyingBalance = await getTokenBalance(
        false,
        potionBuyAction
      );
      const inputVaultUnderlyingBalance = await getTokenBalance(
        false,
        roundsInputVault
      );

      const totalPrincipalBeforeWithdrawalInUnderlying =
        exitSwapAmountInUnderlying +
        (actionUnderlyingBalance as number) +
        (inputVaultUnderlyingBalance as number);

      // When the vault is still not initialized the vaultTotalSupply is 0
      let sharePrice = 1;
      if (vaultTotalSupply.value !== 0) {
        const investmentVaultTotalShares = vaultTotalSupply.value;
        console.log(
          "INVESTMENT VAULT TOTAL SHARES",
          investmentVaultTotalShares
        );
        sharePrice =
          totalPrincipalBeforeWithdrawalInUnderlying /
          investmentVaultTotalShares;
      }

      const totalSharesToWithdraw = outputVaultTotalShares.value;

      const totalAssetsToWithdrawInUnderlying =
        totalSharesToWithdraw * sharePrice;

      const totalPrincipalInUnderlying =
        totalPrincipalBeforeWithdrawalInUnderlying -
        totalAssetsToWithdrawInUnderlying;

      console.table([
        {
          totalPayout,
          exitSwapAmountInUnderlying,
          actionUnderlyingBalance,
          inputVaultUnderlyingBalance,
          totalPrincipalBeforeWithdrawalInUnderlying,
          sharePrice,
          totalAssetsToWithdrawInUnderlying,
          totalPrincipalInUnderlying,
          //          underlyingAddress: rawPotionrouterParams.pools[0].underlyingAddress,
          oraclePrice: oraclePrice.value,
          strikePrice: rawPotionrouterParams.strikePriceUSDC,
          hedgingRate: hedgingRate.value,
        },
      ]);

      const principalHedgedAmountInUnderlying =
        (totalPrincipalInUnderlying * hedgingRate.value) / 100;

      const swapRouterResult = await worker.runPremiumSwapRouter(
        hedgingRate.value,
        strikePercent.value,
        oraclePrice.value,
        rawPotionrouterParams.pools,
        principalHedgedAmountInUnderlying,
        rawPotionrouterParams.strikePriceUSDC,
        rawPotionrouterParams.gas,
        rawPotionrouterParams.ethPrice,
        getChainId(),
        collateralToken.value,
        USDCToken,
        TradeType.EXACT_OUTPUT,
        maxSplits,
        premiumSlippage.value,
        recipientAddress,
        swapSlippage.value
      );

      enterPositionData.value = swapRouterResult;

      await loadEnterPositionFallbackRoute(
        principalHedgedAmountInUnderlying,
        collateralToken,
        swapSlippage
      );
    } finally {
      swapRouterLoading.value = false;
    }
  };

  const loadExitPositionRoute = async (
    collateralToken: Ref<Token>,
    swapSlippage: Ref<number>
  ) => {
    /**
     * TODO: if the payout is 0 and the leftover is 0, the alpha router is going to fail. We need to fix this at the contract level.
     * We will still need to pass a the swap object with an empty swapPath ("")
     */
    const totalPayout = await getTotalPayout();
    if (totalPayout > 0) {
      const USDCToken = convertUniswapTokenToToken(USDCUniToken);
      const recipientAddress = getRecipientAddress(vaultAddress);
      totalAmountToSwap.value = totalPayout;

      const uniswapRouterResult = await getRoute(
        USDCToken,
        collateralToken.value,
        TradeType.EXACT_INPUT,
        totalAmountToSwap.value,
        1, // TODO remove: assert here theres only 1 route returned (no split routes)
        recipientAddress,
        swapSlippage.value,
        UniswapActionType.EXIT_POSITION
      );

      exitPositionData.value = uniswapRouterResult
        ? { uniswapRouterResult }
        : null;

      await loadExitPositionFallbackRoute(collateralToken, swapSlippage);
    } else {
      totalAmountToSwap.value = 0;
    }
  };

  const evaluateExitPositionData = (
    underlyingToken: Ref<Token>,
    oraclePrice: Ref<number>
  ): { swapInfo: UniSwapInfo; fallback: UniSwapInfo } => {
    if (!isExitPositionOperationValid.value) {
      throw new Error("A uniswap route is required to exit position");
    }

    toggleUniswapPolling(false);

    let swapInfo: UniSwapInfo;
    let fallbackSwapInfo: UniSwapInfo;
    const USDCToken = convertQuoteUniswapTokenToToken(USDCUniToken);

    if (totalAmountToSwap.value > 0) {
      const swapRoute = exitPositionData.value?.uniswapRouterResult.routes[0];
      const executionPrice =
        exitPositionData.value?.uniswapRouterResult.tradeExecutionPrice;

      if (
        enterPositionData.value?.uniswapRouterResult &&
        swapRoute &&
        swapRoute.protocol === Protocol.V3 &&
        executionPrice &&
        fallbackExitPositionData.value
      ) {
        swapInfo = evaluateUniswapRoute(
          enterPositionData.value?.uniswapRouterResult,
          UniswapActionType.ENTER_POSITION,
          oraclePrice,
          underlyingToken.value,
          USDCToken
        );
        fallbackSwapInfo = evaluateUniswapRoute(
          fallbackExitPositionData.value,
          UniswapActionType.ENTER_POSITION,
          oraclePrice,
          underlyingToken.value,
          USDCToken
        );
      } else {
        throw new Error("swapRoute isn't a protocol v3 route");
      }
    } else {
      swapInfo = {
        steps: [
          {
            inputToken: USDCToken,
            fee: 0,
          },
        ],
        outputToken: underlyingToken.value,
        expectedPriceRate: 0,
      };
      fallbackSwapInfo = {
        steps: [
          {
            inputToken: USDCToken,
            fee: 0,
          },
        ],
        outputToken: underlyingToken.value,
        expectedPriceRate: 0,
      };
    }

    return { swapInfo, fallback: fallbackSwapInfo };
  };

  const evaluateEnterPositionData = (
    underlyingToken: Ref<Token>,
    oraclePrice: Ref<number>,
    strikePrice: Ref<number>,
    numberOfOtokensToBuyBN: Ref<BigNumber>,
    newOtokenAddress: string,
    expirationTimestamp: number
  ): {
    swapInfo: UniSwapInfo;
    potionBuyInfo: PotionBuyInfo;
    fallback: UniSwapInfo;
  } => {
    if (isEnterPositionOperationValid.value && hasCounterparties.value) {
      toggleUniswapPolling(false);

      // TODO: extend it to split routes
      const swapRoute = enterPositionData.value?.uniswapRouterResult.routes[0];
      const executionPrice =
        enterPositionData.value?.uniswapRouterResult.tradeExecutionPrice;
      const routePremium =
        enterPositionData?.value?.potionRouterResult?.premium?.toFixed(6);

      const counterparties =
        enterPositionData.value?.potionRouterResult.counterparties.map(
          (seller) => {
            return {
              lp: seller.lp,
              poolId: seller.poolId,
              curve: seller.curve,
              criteria: seller.criteria,
              orderSizeInOtokens: seller.orderSizeInOtokens,
            };
          }
        ) as Sellers;

      if (
        enterPositionData.value?.uniswapRouterResult &&
        fallbackEnterPositionData.value &&
        swapRoute &&
        swapRoute.protocol === Protocol.V3 &&
        executionPrice &&
        routePremium
      ) {
        const USDCToken = convertQuoteUniswapTokenToToken(USDCUniToken);
        const swapInfo: UniSwapInfo = evaluateUniswapRoute(
          enterPositionData.value?.uniswapRouterResult,
          UniswapActionType.ENTER_POSITION,
          oraclePrice,
          underlyingToken.value,
          USDCToken
        );

        const potionBuyInfo = {
          targetPotionAddress: newOtokenAddress,
          underlyingAsset: underlyingToken.value.address,
          strikePriceInUSDC: strikePrice.value.toFixed(6),
          expirationTimestamp: expirationTimestamp,
          sellers: counterparties,
          expectedPremiumInUSDC: routePremium,
          totalSizeInPotions: numberOfOtokensToBuyBN.value,
        };

        const fallbackSwapInfo: UniSwapInfo = evaluateUniswapRoute(
          fallbackEnterPositionData.value,
          UniswapActionType.ENTER_POSITION,
          oraclePrice,
          underlyingToken.value,
          USDCToken
        );

        return { swapInfo, potionBuyInfo, fallback: fallbackSwapInfo };
      } else {
        throw new Error("swapRoute isn't a protocol v3 route");
      }
    } else {
      throw new Error(
        "A uniswap route and a set of counterparties is required to enter position"
      );
    }
  };

  const loadEnterPositionFallbackRoute = async (
    principalHedgedAmount: number,
    collateralToken: Ref<Token>,
    swapSlippage: Ref<number>
  ) => {
    const USDCToken = convertUniswapTokenToToken(USDCUniToken);
    const recipientAddress = getRecipientAddress(vaultAddress);

    const uniswapRouterResult = await getRoute(
      collateralToken.value,
      USDCToken,
      TradeType.EXACT_OUTPUT,
      principalHedgedAmount,
      1, // TODO remove: assert here theres only 1 route returned (no split routes)
      recipientAddress,
      swapSlippage.value,
      UniswapActionType.ENTER_POSITION
    );

    fallbackEnterPositionData.value = uniswapRouterResult || null;
  };

  const loadExitPositionFallbackRoute = async (
    collateralToken: Ref<Token>,
    swapSlippage: Ref<number>
  ) => {
    const totalFallbackBalance = await fetchActionBalance(
      swapToUSDCAction as string
    );

    const USDCToken = convertUniswapTokenToToken(USDCUniToken);
    const recipientAddress = getRecipientAddress(vaultAddress);

    const uniswapRouterResult = await getRoute(
      USDCToken,
      collateralToken.value,
      TradeType.EXACT_INPUT,
      totalFallbackBalance,
      1, // TODO remove: assert here theres only 1 route returned (no split routes)
      recipientAddress,
      swapSlippage.value,
      UniswapActionType.EXIT_POSITION
    );

    fallbackExitPositionData.value = uniswapRouterResult || null;
  };

  const evaluateUniswapRoute = (
    routerReturn: UniswapRouterReturn,
    uniswapActionType: UniswapActionType,
    oraclePrice: Ref<number>,
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

  return {
    enterPositionData,
    exitPositionData,
    fallbackEnterPositionData,
    fallbackExitPositionData,
    isActionLoading,
    totalAmountToSwap,
    isTotalAmountValid,
    hasCounterparties,
    isEnterPositionOperationValid,
    isExitPositionOperationValid,
    loadEnterPositionRoute,
    loadExitPositionRoute,
    evaluateExitPositionData,
    evaluateEnterPositionData,
    loadEnterPositionFallbackRoute,
    loadExitPositionFallbackRoute,
  };
}
