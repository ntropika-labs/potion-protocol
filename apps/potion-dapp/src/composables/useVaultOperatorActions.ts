import { computed, ref } from "vue";
import { TradeType } from "@uniswap/sdk-core";
import { BigNumber } from "ethers";

import { getChainId, USDCUniToken } from "@/helpers/uniswap";
import {
  convertCollateralToUniswapToken,
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
} from "@/helpers/vaultOperatorTokens";
import { contractsAddresses } from "@/helpers/hedgingVaultContracts";

import { useAlphaRouter } from "./useAlphaRouter";

import type { Ref } from "vue";
import type { DepthRouterReturn } from "potion-router";
import type { Token } from "dapp-types";
import type { UniSwapInfo } from "./useHedgingVaultOperatorHelperContract";
import type { ActionPayout } from "./usePotionBuyActionContract";

export function useVaultOperatorActions(
  potionRouterResult: Ref<DepthRouterReturn | null>,
  currentPayout: Ref<ActionPayout | undefined>
) {
  const {
    routerData: uniswapRouterResult,
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  const totalAmountToSwap = ref(0);
  const { PotionBuyAction } = contractsAddresses;
  /**
   * FLAGS
   */

  const isTotalAmountValid = computed(
    () => !Number.isNaN(totalAmountToSwap.value)
  );
  const hasCounterparties = computed(
    () => (potionRouterResult?.value?.counterparties?.length ?? 0) > 0
  );

  const hasRoute = computed(
    () => (uniswapRouterResult?.value?.route?.length ?? 0) > 0
  );

  const isEnterPositionOperationValid = computed(() => {
    return (
      isTotalAmountValid.value && hasCounterparties.value && hasRoute.value
    );
  });

  const isExitPositionOperationValid = computed(() => {
    const isValidPayout =
      isTotalAmountValid.value && totalAmountToSwap.value > 0 && hasRoute.value;

    const hasNoPayout =
      totalAmountToSwap.value === 0 && currentPayout.value?.currentPayout === 0;

    return isValidPayout || hasNoPayout;
  });

  /**
   * METHODS
   */

  const evaluatePremium = (routerPremium: number, premiumSlippage: number) =>
    routerPremium + (premiumSlippage * routerPremium) / 100;

  const loadEnterPositionRoute = async (
    collateralToken: Ref<Token>,
    premiumSlippage: Ref<number>,
    swapSlippage: Ref<number>,
    maxSplits = 1
  ) => {
    if (hasCounterparties.value && potionRouterResult.value) {
      totalAmountToSwap.value = evaluatePremium(
        potionRouterResult.value.premium,
        premiumSlippage.value
      );

      const collateralUniToken = convertCollateralToUniswapToken(
        collateralToken.value
      );

      await getRoute(
        collateralUniToken,
        USDCUniToken,
        TradeType.EXACT_OUTPUT,
        totalAmountToSwap.value,
        maxSplits, // TODO remove: assert here theres only 1 route returned (no split routes)
        PotionBuyAction.value,
        swapSlippage.value
      );

      console.log(
        "EXECUTION PRICE",
        uniswapRouterResult.value?.trade.executionPrice,
        uniswapRouterResult.value?.trade.executionPrice.toFixed(10)
      );
    } else {
      throw new Error("No counterparty available");
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

      const collateralUniToken = convertCollateralToUniswapToken(
        collateralToken.value
      );

      await getRoute(
        USDCUniToken,
        collateralUniToken,
        TradeType.EXACT_INPUT,
        totalAmountToSwap.value,
        1, // TODO remove: assert here theres only 1 route returned (no split routes)
        PotionBuyAction.value,
        swapSlippage.value
      );
    } else {
      totalAmountToSwap.value = 0;
    }
  };

  const getExitPositionData = (
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
      if (!uniswapRouterResult.value?.route) {
        throw new Error("A Uniswap route is required to exit position");
      }

      const swapRoute = uniswapRouterResult.value.route[0];
      const firstPoolFee: number = (swapRoute.route as any).pools[0].fee;
      const expectedPriceRate = getExitExpectedPriceRate(
        oraclePrice,
        uniswapRouterResult.value.trade
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

  const getEnterPositionData = (
    underlyingToken: Ref<Token>,
    oraclePrice: Ref<number>,
    strikePrice: Ref<number>,
    numberOfOtokensToBuyBN: Ref<BigNumber>,
    newOtokenAddress: string,
    expirationTimestamp: number
  ) => {
    if (
      isEnterPositionOperationValid.value &&
      hasCounterparties.value &&
      potionRouterResult.value &&
      uniswapRouterResult.value
    ) {
      toggleUniswapPolling(false);

      const swapRoute = uniswapRouterResult.value.route[0];

      const counterparties = potionRouterResult.value.counterparties.map(
        (seller: any) => {
          return {
            lp: seller.lp,
            poolId: seller.poolId,
            curve: seller.curve,
            criteria: seller.criteria,
            orderSizeInOtokens: seller.orderSizeInOtokens,
          };
        }
      );

      const firstPoolFee: number = (swapRoute.route as any).pools[0].fee;
      const USDCToken = convertInputToToken(USDCUniToken);
      const expectedPriceRate = getEnterExpectedPriceRate(
        oraclePrice,
        uniswapRouterResult.value.trade
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
        expectedPremiumInUSDC: potionRouterResult.value?.premium.toFixed(6),
        totalSizeInPotions: numberOfOtokensToBuyBN.value,
      };

      console.log("expectedPriceRate", expectedPriceRate);

      return { swapInfo, potionBuyInfo };
    } else {
      throw new Error(
        "A uniswap route and a set of counterparties is required to enter position"
      );
    }
  };

  return {
    uniswapRouterResult,
    routerLoading,
    totalAmountToSwap,
    isTotalAmountValid,
    hasCounterparties,
    hasRoute,
    isEnterPositionOperationValid,
    isExitPositionOperationValid,
    loadEnterPositionRoute,
    loadExitPositionRoute,
    getExitPositionData,
    getEnterPositionData,
  };
}
