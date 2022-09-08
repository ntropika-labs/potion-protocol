import { computed, ref, unref, type Ref } from "vue";
import { TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";
import { BigNumber } from "ethers";

import { useOnboard } from "@onboard-composable";
import { getChainId, USDCUniToken } from "@/helpers/uniswap";
import {
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
} from "@/helpers/vaultOperatorTokens";

import { useAlphaRouter } from "./useAlphaRouter";

import type {
  DepthRouterReturn,
  IRouterParameters as DepthRouterParameters,
} from "potion-router";
import type { Token } from "dapp-types";
import type { UniSwapInfo } from "./useHedgingVaultOperatorHelperContract";
import type { ActionPayout } from "./usePotionBuyActionContract";

import { worker } from "@/web-worker";
import type { UniswapRouterReturn } from "@/types";

export function useVaultOperatorActions(
  currentPayout: Ref<ActionPayout | undefined>
) {
  const {
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  const { connectedWallet } = useOnboard();
  const walletAddress = computed(
    () => connectedWallet.value?.accounts[0].address ?? ""
  );

  const totalAmountToSwap = ref(0);
  const enterPositionData: Ref<{
    potionRouterResult: DepthRouterReturn;
    uniswapRouterResult: UniswapRouterReturn;
  } | null> = ref(null);
  const exitPositionData: Ref<UniswapRouterReturn | null> = ref(null);
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
      hasRoute(exitPositionData.value);

    const hasNoPayout =
      totalAmountToSwap.value === 0 && currentPayout.value?.currentPayout === 0;

    return isValidPayout || hasNoPayout;
  });

  const isActionLoading = computed(
    () => routerLoading.value || swapRouterLoading.value
  );

  /**
   * METHODS
   */

  const loadEnterPositionRoute = async (
    potionRouterParameters: Ref<DepthRouterParameters>,
    collateralToken: Ref<Token>,
    premiumSlippage: Ref<number>,
    swapSlippage: Ref<number>,
    maxSplits = 1
  ) => {
    try {
      swapRouterLoading.value = true;
      const rawPotionrouterParams = unref(potionRouterParameters);
      // const collateralUniToken = convertCollateralToUniswapToken(
      //   collateralToken.value
      // );

      console.log("rawPotionrouterParams", rawPotionrouterParams);

      // TODO: check for serialization issues
      // const route = await worker.getUniswapRoute(
      const swapRouterResult = await worker.runPremiumSwapRouter(
        rawPotionrouterParams.pools,
        rawPotionrouterParams.orderSize,
        rawPotionrouterParams.strikePriceUSDC,
        rawPotionrouterParams.gas,
        rawPotionrouterParams.ethPrice,
        getChainId(),
        collateralToken.value,
        USDCUniToken,
        TradeType.EXACT_OUTPUT,
        maxSplits,
        premiumSlippage.value,
        walletAddress.value,
        swapSlippage.value
      );

      enterPositionData.value = swapRouterResult;
      // {
      //   potionRouterResult: potionRouter,
      //   uniswapRouterResult: route,
      // };

      console.log("ENTER POS VLA", enterPositionData.value);
    } finally {
      swapRouterLoading.value = false;
    }
  };

  const loadExitPositionRoute = async (
    collateralToken: Ref<Token>,
    swapSlippage: Ref<number>
  ) => {
    /**
     * TODO: we need to check the contract balance for USDC and add the amount to the eventual payout
     * if the payout is 0 and the leftover is 0, the alpha router is going to fail. We need to fix this at the contract level.
     * We will still need to pass a the swap object with an empty swapPath ("")
     */
    if (currentPayout.value && currentPayout.value.currentPayout > 0) {
      totalAmountToSwap.value = currentPayout.value.currentPayout;

      // const collateralUniToken = convertCollateralToUniswapToken(
      //   collateralToken.value
      // );

      const uniswapRouterResult = await getRoute(
        USDCUniToken as Token,
        collateralToken.value,
        TradeType.EXACT_INPUT,
        totalAmountToSwap.value,
        1, // TODO remove: assert here theres only 1 route returned (no split routes)
        walletAddress.value,
        swapSlippage.value,
        "exit"
      );

      exitPositionData.value = uniswapRouterResult || null;
    } else {
      totalAmountToSwap.value = 0;
    }
  };

  const evaluateExitPositionData = (
    underlyingToken: Ref<Token>,
    oraclePrice: Ref<number>
  ): UniSwapInfo => {
    if (!isExitPositionOperationValid.value) {
      throw new Error("A uniswap route is required to exit position");
    }

    toggleUniswapPolling(false);

    let swapInfo: UniSwapInfo;
    const USDCToken = convertInputToToken(USDCUniToken);

    if (totalAmountToSwap.value > 0) {
      if (!exitPositionData.value || !exitPositionData.value.routes) {
        throw new Error("A Uniswap route is required to exit position");
      }

      const swapRoute = exitPositionData.value.routes[0];
      if (swapRoute.protocol === Protocol.V3) {
        const firstPoolFee = swapRoute.pools[0].fee;
        const expectedPriceRate = getExitExpectedPriceRate(
          oraclePrice,
          exitPositionData.value.tradeExecutionPrice
        );
        swapInfo = {
          steps: [
            {
              inputToken: USDCToken,
              fee: firstPoolFee,
            },
          ],
          outputToken: underlyingToken.value,
          expectedPriceRate: expectedPriceRate, // this value needs to be = to the swap route price rate. Ex: eth is 100 at the time of swap, the value is 1 / 100
        };
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
    }

    return swapInfo;
  };

  const evaluateEnterPositionData = (
    underlyingToken: Ref<Token>,
    oraclePrice: Ref<number>,
    strikePrice: Ref<number>,
    numberOfOtokensToBuyBN: Ref<BigNumber>,
    newOtokenAddress: string,
    expirationTimestamp: number
  ) => {
    if (isEnterPositionOperationValid.value && hasCounterparties.value) {
      toggleUniswapPolling(false);

      // TODO: extend it to split routes
      const swapRoute = enterPositionData.value?.uniswapRouterResult.routes[0];

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
        );

      if (swapRoute && swapRoute.protocol === Protocol.V3) {
        const firstPoolFee = swapRoute.pools[0].fee;
        const USDCToken = convertInputToToken(USDCUniToken);
        const expectedPriceRate = getEnterExpectedPriceRate(
          oraclePrice,
          enterPositionData.value?.uniswapRouterResult.tradeExecutionPrice ||
            BigNumber.from(0)
        );
        const swapInfo: UniSwapInfo = {
          steps: [{ inputToken: underlyingToken.value, fee: firstPoolFee }],
          outputToken: USDCToken,
          expectedPriceRate: expectedPriceRate, // TODO: this value needs to be = to the swap route price rate. Ex: eth is 100 at the time of swap, the value is 100
        };

        const potionBuyInfo = {
          targetPotionAddress: newOtokenAddress,
          underlyingAsset: underlyingToken.value.address,
          strikePriceInUSDC: strikePrice.value.toFixed(6),
          expirationTimestamp: expirationTimestamp,
          sellers: counterparties,
          expectedPremiumInUSDC:
            enterPositionData.value?.potionRouterResult.premium.toFixed(6),
          totalSizeInPotions: numberOfOtokensToBuyBN.value,
        };

        return { swapInfo, potionBuyInfo };
      } else {
        throw new Error("swapRoute isn't a protocol v3 route");
      }
    } else {
      throw new Error(
        "A uniswap route and a set of counterparties is required to enter position"
      );
    }
  };

  return {
    enterPositionData,
    exitPositionData,
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
  };
}
