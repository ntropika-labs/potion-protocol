import { computed, ref, type Ref } from "vue";
import { TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";

import {
  getChainId,
  USDCUniToken,
  convertUniswapTokenToToken,
  evaluateUniswapRoute,
} from "@/helpers/uniswap";
import {
  getRecipientAddress,
  mockCollateralToken,
  mockUnderlyingToken,
} from "@vault-operator-utils";

import { getContractsFromVault } from "@/helpers/hedgingVaultContracts";
import { useAlphaRouter } from "./useAlphaRouter";

import type { Token } from "dapp-types";
import type { ActionPayout } from "./usePotionBuyActionContract";

import { UniswapActionType } from "@/types";
import type { UniswapRouterReturn, UniSwapInfo } from "@/types";
import { useErc20Contract } from "./useErc20Contract";

/**
 * The composable returns a set of functions to perform operations to exit the current cycle and exposes references
 * to the data loaded through these operations.
 *
 * @param vaultAddress Dynamic reference to the vault address we plan to use with this composable
 * @param underlyingToken Dynamic reference to the underlying token associated with the vault
 * @param totalPayoutUSDC Dynamic reference to the total payout of the Potion Buy Action, expressed as USDC
 * @param oraclePrice Dynamic reference to the current price for the `underlyingToken`, expressed in USDC
 * @returns References to functions and dynamic variables
 * - `loadExitPositionRoute`: loads data required to exit the current cycle. Saves the raw data into `exitPositionData`
 * - `evaluateExitPositionData`: evaluates the previously loaded data and synthetizes the information required from the contracts to perform those actions
 */
export function useVaultOperatorExitPosition(
  vaultAddress: Ref<string>,
  underlyingToken: Ref<Token>,
  totalPayoutUSDC: Ref<ActionPayout | undefined>,
  oraclePrice: Ref<number>
) {
  const lowercaseVaultAddress = computed(() =>
    vaultAddress.value.toLowerCase()
  );
  const { swapToUSDCAction, usdc } = getContractsFromVault(
    lowercaseVaultAddress.value
  );

  const {
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  const { balance: fallbackUSDCBalance, getTokenBalance: getUSDCBalance } =
    useErc20Contract(usdc as string, false);

  const exitPositionData: Ref<{
    uniswapRouterData: UniswapRouterReturn | null;
    fallbackUniswapRouterData: UniswapRouterReturn | null;
  } | null> = ref(null);
  const isLoading = ref(false);

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
    () =>
      !!totalPayoutUSDC.value &&
      !Number.isNaN(totalPayoutUSDC.value.currentPayout)
  );

  const isExitPositionOperationValid = computed(() => {
    // The route is only valid if either of this conditions are met:
    // - we have a total amount to swap > 0, and at least a pair of routes for the uniswap trade and the fallback strategy
    // - we have no payout and no amount to swap
    const isValidPayout =
      isTotalAmountValid.value &&
      !!totalPayoutUSDC.value &&
      totalPayoutUSDC.value?.currentPayout > 0 &&
      (hasRoute(exitPositionData.value?.uniswapRouterData) ||
        hasRoute(exitPositionData.value?.fallbackUniswapRouterData));

    const hasNoPayout =
      isTotalAmountValid.value &&
      !!totalPayoutUSDC.value &&
      totalPayoutUSDC.value?.currentPayout === 0;

    console.log("EXIT VALID", totalPayoutUSDC.value);
    return isValidPayout || hasNoPayout;
  });

  const isActionLoading = computed(
    () => routerLoading.value || isLoading.value
  );

  const loadExitPositionRoute = async (swapSlippage: number) => {
    if (
      !totalPayoutUSDC.value ||
      Number.isNaN(totalPayoutUSDC.value?.currentPayout)
    ) {
      throw new Error("totalPayoutUSDC must be defined");
    }
    try {
      let uniswapExitRoute = null;
      let fallbackRoute = null;
      isLoading.value = true;
      const USDCToken = convertUniswapTokenToToken(USDCUniToken);
      const underlyingTokenToSwap = mockUnderlyingToken(underlyingToken.value);
      const recipientAddress = getRecipientAddress(lowercaseVaultAddress.value);
      /**
       * TODO: if the payout is 0 and the leftover is 0, the alpha router is going to fail. We need to fix this at the contract level.
       * We will still need to pass a the swap object with an empty swapPath ("")
       */
      if (totalPayoutUSDC.value && totalPayoutUSDC.value.currentPayout > 0) {
        const payout = totalPayoutUSDC.value.currentPayout;

        uniswapExitRoute = await getRoute(
          USDCToken,
          underlyingTokenToSwap,
          TradeType.EXACT_INPUT,
          payout,
          1, // TODO remove: assert here theres only 1 route returned (no split routes)
          recipientAddress,
          swapSlippage,
          UniswapActionType.EXIT_POSITION
        );

        if (!uniswapExitRoute) {
          throw new Error("No uniswap route found");
        }
      } else {
        uniswapExitRoute = null;
      }
      await getUSDCBalance(false, swapToUSDCAction as string);

      const totalFallbackBalance = fallbackUSDCBalance.value;
      console.log("- USDC FALLBACK TOTAL BALANCE", totalFallbackBalance);

      if (totalFallbackBalance > 0) {
        fallbackRoute = await getRoute(
          USDCToken,
          underlyingTokenToSwap,
          TradeType.EXACT_INPUT,
          totalFallbackBalance,
          1, // TODO remove: assert here theres only 1 route returned (no split routes)
          recipientAddress,
          swapSlippage,
          UniswapActionType.EXIT_POSITION
        );

        if (!fallbackRoute) {
          throw new Error("No fallback route found");
        }
      } else {
        fallbackRoute = null;
      }

      exitPositionData.value = {
        uniswapRouterData: uniswapExitRoute,
        fallbackUniswapRouterData: fallbackRoute,
      };
    } finally {
      isLoading.value = false;
    }
  };

  const evaluateExitPositionData = (): {
    swapInfo: UniSwapInfo;
    fallback: UniSwapInfo;
  } => {
    if (!isExitPositionOperationValid.value) {
      throw new Error("A uniswap route is required to exit position");
    }

    toggleUniswapPolling(false);

    let swapInfo: UniSwapInfo;
    let fallbackInfo: UniSwapInfo;
    const USDCToken = convertUniswapTokenToToken(USDCUniToken);
    // mock the official address of USDC with the one from the local deployment
    const collateralTokenToSwap = mockCollateralToken(USDCToken);

    console.log("TOTAL PAYOUT USDC", totalPayoutUSDC.value);
    if (
      totalPayoutUSDC.value &&
      totalPayoutUSDC.value.currentPayout > 0 &&
      exitPositionData.value?.uniswapRouterData
    ) {
      const swapRoute = exitPositionData.value?.uniswapRouterData.routes[0];
      const executionPrice =
        exitPositionData.value?.uniswapRouterData.tradeExecutionPrice;

      if (swapRoute && swapRoute.protocol === Protocol.V3 && executionPrice) {
        swapInfo = evaluateUniswapRoute(
          exitPositionData.value?.uniswapRouterData,
          UniswapActionType.EXIT_POSITION, // TODO: change enum names to better ones
          oraclePrice.value,
          collateralTokenToSwap,
          underlyingToken.value
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
    }

    if (exitPositionData.value?.fallbackUniswapRouterData) {
      fallbackInfo = evaluateUniswapRoute(
        exitPositionData.value?.fallbackUniswapRouterData,
        UniswapActionType.ENTER_POSITION, // TODO: change enum names to better ones
        oraclePrice.value,
        collateralTokenToSwap,
        underlyingToken.value
      );
    } else {
      fallbackInfo = {
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

    return { swapInfo, fallback: fallbackInfo };
  };

  return {
    exitPositionData,
    isActionLoading,
    isTotalAmountValid,
    isExitPositionOperationValid,
    loadExitPositionRoute,
    evaluateExitPositionData,
  };
}
