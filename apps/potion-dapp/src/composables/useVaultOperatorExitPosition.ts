import { computed, ref, type Ref } from "vue";
import { TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";

import {
  getChainId,
  USDCUniToken,
  convertUniswapTokenToToken,
  evaluateUniswapRoute,
} from "@/helpers/uniswap";
import { getRecipientAddress } from "@vault-operator-utils";

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
  // Fetch contracts addresses
  const { SwapToUSDCAction, USDC } = getContractsFromVault(
    lowercaseVaultAddress.value
  );

  // Initialize alpha router instance
  const {
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  // Initialize ERC20 contract to fetch the current balance in USDC
  const { balance: fallbackUSDCBalance, getTokenBalance: getUSDCBalance } =
    useErc20Contract(USDC, false);

  /**
   * Dynamic reference to the actual data to exit the position
   * - `uniswapRouterData` - uniswap alpha router data to swap USDC to underlying for the payout we got
   * - `fallbackUniswapRouterData` - uniswap alpha router data to swap back the whole amount using the fallback strategy
   */
  const exitPositionData: Ref<{
    uniswapRouterData: UniswapRouterReturn | null;
    fallbackUniswapRouterData: UniswapRouterReturn | null;
  } | null> = ref(null);
  const isLoading = ref(false);

  /**
   * Check if the object contains a uniswap route
   * @param uniswapRouterResult Result of the query to the uniswap alpha router containing swap info
   * @returns Returns a boolean indicating whether or not the object contains a uniswap route
   */
  const hasRoute = (
    uniswapRouterResult: UniswapRouterReturn | undefined | null
  ) => {
    return (
      ((uniswapRouterResult && uniswapRouterResult.routes?.length) ?? 0) > 0
    );
  };

  /**
   * FLAGS
   */

  /**
   * Dynamic reference to compute whether or not the 'totalPayoutUSDC' is a valid number
   */
  const isTotalAmountValid = computed(
    () =>
      !!totalPayoutUSDC.value &&
      !Number.isNaN(totalPayoutUSDC.value.currentPayout)
  );

  /**
   * Dynamic reference to compute wheter or not current data to enter the position is
   * actually a valid operation.
   * The operation is valid if any of the following conditions are met:
   * - the total payout is greater than 0 and we have valid routes for uniswap
   * - the total payout is 0
   */
  const isExitPositionOperationValid = computed(() => {
    // If we have a payout we also require valid uniswap routes
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

    return isValidPayout || hasNoPayout;
  });

  const isActionLoading = computed(
    () => routerLoading.value || isLoading.value
  );

  /**
   * Loads data for the exit position operation and stores the results in `exitPositionData`.
   * This data actually consist of:
   * - data from the uniswap alpha router containing info to swap the payout from USDC to underlying
   * - data from the uniswap alpha router containing info for the Fallback Action to swap back the whole amount from USDC to underlying
   * @param swapSlippage Maximum slippage allowed when swapping the tokens pair, expressed as percentage interger
   */
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
      // Convert the uniswap token instance of USDC to the Token interface used internally
      const USDCToken = convertUniswapTokenToToken(USDCUniToken);
      // Create a reference to the current underlying token instance
      const underlyingTokenToSwap = underlyingToken.value;
      // Compute the recipient address for multi-hop paths
      const recipientAddress = getRecipientAddress(lowercaseVaultAddress.value);

      if (totalPayoutUSDC.value && totalPayoutUSDC.value.currentPayout > 0) {
        const payout = totalPayoutUSDC.value.currentPayout;

        // Get the uniswap route to swap the payout from USDC to underlying
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
        // If we have no payout then set the data to null
        uniswapExitRoute = null;
      }
      // Fetch the current USDC balance for the fallback strategy
      await getUSDCBalance(false, SwapToUSDCAction);

      const totalFallbackBalance = fallbackUSDCBalance.value;

      // If the strategy has some liquidity then compute the uniswap route
      // to convert that amount to underlyings
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

      // Store the info
      exitPositionData.value = {
        uniswapRouterData: uniswapExitRoute,
        fallbackUniswapRouterData: fallbackRoute,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Evaluate the current data for the exit position operation (from `exitPositionData`) and return
   * a flat object containing info to exit the position
   * @returns A flat object containing info for the uniswap swap path and the fallback route
   */
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
    const collateralTokenToSwap = USDCToken;

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

  const resetData = () => {
    exitPositionData.value = null;
  };

  return {
    exitPositionData,
    isActionLoading,
    isTotalAmountValid,
    isExitPositionOperationValid,
    loadExitPositionRoute,
    evaluateExitPositionData,
    resetData,
  };
}
