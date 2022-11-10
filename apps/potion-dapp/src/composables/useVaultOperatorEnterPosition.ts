import { computed, onMounted, ref, type Ref } from "vue";
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

import type { DepthRouterReturn } from "potion-router";
import type { Criteria, Token } from "dapp-types";
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
import { useBlockNative } from "./useBlockNative";
import { useDepthRouter } from "./useDepthRouter";
import { createValidExpiry } from "@/helpers";
import { useOtokenFactory } from "./useOtokenFactory";
import { calculateOrderSize } from "hedging-vault-sdk";
import { formatUnits } from "@ethersproject/units";

/**
 * The composable returns a set of functions to perform operations to enter a new cycle and exposes references
 * to the data loaded through these operations.
 *
 * @param vaultAddress Dynamic reference to the vault address we plan to use with this composable
 * @param underlyingToken Dynamic reference to the underlying token associated with the vault
 * @param totalPayoutUSDC Dynamic reference to the total payout of the Potion Buy Action, expressed as USDC
 * @param vaultTotalSupply Dynamic reference to the total number of shares available in the Investment Vault
 * @param outputVaultTotalShares Dynamc reference to the total number of shares available in the Rounds Output Vault
 * @param hedgingRate Dynamic reference to the vault hedging rate, expressed as percentage integer
 * @param strikePercent Dynamic reference to the vault strike percent, expressed as a percentage integer
 * @param oraclePrice Dynamic reference to the current price for the `underlyingToken`, expressed in USDC
 * @returns References to functions and dynamic variables
 * - `loadEnterPositionRoute`: loads data required to enter a new cycle. Saves the raw data into `enterPositionData`
 * - `evaluateEnterPositionData`: evaluates the previously loaded data and synthetizes the information required from the contracts to perform those actions
 */
export function useVaultOperatorEnterPosition(
  vaultAddress: Ref<string>,
  underlyingToken: Ref<Token>,
  totalPayoutUSDC: Ref<ActionPayout | undefined>,
  vaultTotalSupply: Ref<number>,
  outputVaultTotalShares: Ref<number>,
  hedgingRate: Ref<number>,
  strikePercent: Ref<number>,
  oraclePrice: Ref<number>,
  cycleDurationDays: Ref<number>
) {
  const effectiveVaultSizeInUnderlying = ref(0);
  const lowercaseVaultAddress = computed(() =>
    vaultAddress.value.toLowerCase()
  );
  const { PotionBuyAction, RoundsInputVault, USDC } = getContractsFromVault(
    lowercaseVaultAddress.value
  );

  const underlyingTokenAddress = computed(
    () => underlyingToken.value?.address.toLowerCase() || ""
  );

  const {
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  const { getTokenBalance } = useErc20Contract(underlyingTokenAddress, false);
  const { getGas, gasPrice } = useBlockNative();

  const { getTargetOtokenAddress } = useOtokenFactory();

  const getTotalPrincipalInUnderlying = async () => {
    let price = 1;
    const totalPayout = totalPayoutUSDC.value
      ? totalPayoutUSDC.value.currentPayout
      : 0;
    const exitSwapAmountInUnderlying = totalPayout / oraclePrice.value;

    const actionUnderlyingBalance = await getTokenBalance(
      false,
      PotionBuyAction
    );
    const inputVaultUnderlyingBalance = await getTokenBalance(
      false,
      RoundsInputVault
    );

    const totalPrincipalBeforeWithdrawalInUnderlying =
      exitSwapAmountInUnderlying +
      (actionUnderlyingBalance as number) +
      (inputVaultUnderlyingBalance as number);

    console.log(
      totalPayoutUSDC.value,
      totalPrincipalBeforeWithdrawalInUnderlying,
      exitSwapAmountInUnderlying,
      actionUnderlyingBalance,
      inputVaultUnderlyingBalance
    );

    // When the vault is still not initialized the vaultTotalSupply is 0
    if (vaultTotalSupply.value !== 0) {
      const investmentVaultTotalShares = vaultTotalSupply.value;
      console.log(
        "- INVESTMENT VAULT TOTAL SHARES",
        totalPrincipalBeforeWithdrawalInUnderlying,
        investmentVaultTotalShares
      );
      price =
        totalPrincipalBeforeWithdrawalInUnderlying / investmentVaultTotalShares;
    }

    const totalSharesToWithdraw = outputVaultTotalShares.value;

    const totalAssetsToWithdrawInUnderlying = totalSharesToWithdraw * price;

    return (
      totalPrincipalBeforeWithdrawalInUnderlying -
      totalAssetsToWithdrawInUnderlying
    );
  };

  const totalAmountToSwap = ref(0);

  const strikePrice = computed(() => {
    const strikePercentage = strikePercent.value;
    return strikePercentage === null
      ? 0
      : oraclePrice.value * (strikePercentage / 100);
  });

  const criteriasParam = computed<Criteria[]>(() => {
    return [
      {
        token: underlyingToken.value,
        maxStrike: strikePercent.value,
        maxDuration: cycleDurationDays.value,
      } as Criteria,
    ];
  });

  const { getPoolsFromCriterias, routerParams: potionRouterParameters } =
    useDepthRouter(
      criteriasParam,
      totalAmountToSwap,
      strikePrice,
      gasPrice,
      oraclePrice
    );

  const enterPositionData: Ref<{
    potionRouterData: DepthRouterReturn;
    uniswapRouterData: UniswapRouterReturn;
    fallbackUniswapRouterData: UniswapRouterReturn;
    potionRouterInitialData: DepthRouterReturn; // TODO: remove
  } | null> = ref(null);

  const isLoading = ref(false);

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

  const isTotalAmountValid = computed(
    () => !Number.isNaN(totalAmountToSwap.value)
  );
  const hasCounterparties = computed(
    () =>
      ((enterPositionData.value &&
        enterPositionData.value.potionRouterData?.counterparties?.length) ??
        0) > 0
  );

  const isEnterPositionOperationValid = computed(() => {
    // The route is only valid if we have a total amount to swap, a set of counterparties and at
    // least a pair of routes for the uniswap trade and the fallback strategy
    return (
      isTotalAmountValid.value &&
      hasCounterparties.value &&
      hasRoute(enterPositionData.value?.uniswapRouterData) &&
      hasRoute(enterPositionData.value?.fallbackUniswapRouterData)
    );
  });

  const isActionLoading = computed(
    () => routerLoading.value || isLoading.value
  );

  /**
   *
   * @param premiumSlippage Maximum slippage allowed when calculating the premium, expressed as a percentage integer
   * @param swapSlippage Maximum slippage allowed when swapping the tokens pair, expressed as percentage interger
   * @param maxSplits Maximum number of splits allowed when calculating the route to swap two tokens
   */
  const loadEnterPositionRoute = async (
    premiumSlippage: number,
    swapSlippage: number,
    maxSplits = 1 // TODO remove: assert here theres only 1 route returned (no split routes)
  ) => {
    console.log("LOADING ENTER POSITION DATA");
    if (
      !totalPayoutUSDC.value ||
      Number.isNaN(totalPayoutUSDC.value?.currentPayout)
    ) {
      throw new Error("totalPayoutUSDC must be defined");
    }
    try {
      isLoading.value = true;
      //const rawPotionrouterParams = unref(potionRouterParameters);

      const USDCToken = convertUniswapTokenToToken(USDCUniToken);
      const underlyingTokenValue = underlyingToken.value;
      const recipientAddress = getRecipientAddress(lowercaseVaultAddress.value);

      const totalPrincipalInUnderlying = await getTotalPrincipalInUnderlying();
      const principalHedgedAmountInUnderlying =
        (totalPrincipalInUnderlying * hedgingRate.value) / 100;

      const principalHedgedAmountInUSDC =
        principalHedgedAmountInUnderlying *
        potionRouterParameters.value.strikePriceUSDC;

      totalAmountToSwap.value = principalHedgedAmountInUSDC;

      // POTION ROUTER
      const potionRouterWithEstimatedPremium = await worker.getPotionRoute(
        principalHedgedAmountInUSDC,
        potionRouterParameters.value.pools, // TODO: check pools may not match the order size
        potionRouterParameters.value.strikePriceUSDC,
        potionRouterParameters.value.gas,
        potionRouterParameters.value.ethPrice
      );

      const actualVaultSizeInUnderlying = calculateOrderSize(
        principalHedgedAmountInUnderlying,
        underlyingTokenValue.decimals as number,
        hedgingRate.value,
        strikePercent.value,
        oraclePrice.value,
        potionRouterWithEstimatedPremium.premium.toFixed(
          USDCToken.decimals as number
        )
      );

      effectiveVaultSizeInUnderlying.value = parseFloat(
        formatUnits(
          actualVaultSizeInUnderlying.effectiveVaultSize.toString(),
          underlyingTokenValue.decimals
        )
      );

      const effectiveVaultSizeInUSDC =
        effectiveVaultSizeInUnderlying.value *
        potionRouterParameters.value.strikePriceUSDC;

      const potionRouterForEffectiveSize = await worker.getPotionRoute(
        effectiveVaultSizeInUSDC,
        potionRouterParameters.value.pools, // TODO: check pools doesnt match the order size
        potionRouterParameters.value.strikePriceUSDC,
        potionRouterParameters.value.gas,
        potionRouterParameters.value.ethPrice
      );

      const premiumWithSlippage =
        ((100 + premiumSlippage) * potionRouterForEffectiveSize.premium) / 100;
      console.log(
        "- PREMIUM WITH SLIPPAGE",
        premiumWithSlippage,
        potionRouterForEffectiveSize.premium
      );

      // substitute the local address for the underlying token with the official address for WETH
      // required to to run the uniswap router
      const underlyingTokenToSwap = mockUnderlyingToken(underlyingToken.value);

      const uniswapResult = await getRoute(
        underlyingTokenToSwap,
        USDCToken,
        TradeType.EXACT_OUTPUT,
        premiumWithSlippage,
        maxSplits,
        recipientAddress,
        swapSlippage,
        UniswapActionType.ENTER_POSITION
      );
      if (!uniswapResult) {
        throw new Error("No uniswap route found");
      }

      const fallbackRoute = await getRoute(
        underlyingTokenToSwap,
        USDCToken,
        TradeType.EXACT_INPUT,
        principalHedgedAmountInUnderlying,
        maxSplits,
        recipientAddress,
        swapSlippage,
        UniswapActionType.EXIT_POSITION
      );
      if (!fallbackRoute) {
        throw new Error("No fallback route found");
      }

      enterPositionData.value = {
        potionRouterData: potionRouterForEffectiveSize,
        uniswapRouterData: uniswapResult,
        fallbackUniswapRouterData: fallbackRoute,
        potionRouterInitialData: potionRouterWithEstimatedPremium,
      };
    } finally {
      isLoading.value = false;
    }
  };

  const evaluateEnterPositionData = async (
    blockTimestamp: Ref<number>
  ): Promise<{
    swapInfo: UniSwapInfo;
    potionBuyInfo: PotionBuyInfo;
    fallback: UniSwapInfo;
  }> => {
    if (isEnterPositionOperationValid.value && hasCounterparties.value) {
      toggleUniswapPolling(false);

      // Generate a new expiration timestamp that is closest in time (at 8AM)

      // Today at 8AM, it might be in the past
      let expirationTimestamp = createValidExpiry(blockTimestamp.value, 0);

      // If the date in the past, then correct it
      if (expirationTimestamp < blockTimestamp.value) {
        // Today + cycle duration days at 8AM
        expirationTimestamp = createValidExpiry(
          blockTimestamp.value,
          cycleDurationDays.value
        );
      }

      const newOtokenAddress = await getTargetOtokenAddress(
        underlyingToken.value.address,
        USDC,
        USDC,
        strikePrice.value,
        expirationTimestamp,
        true
      );

      // TODO: extend it to split routes
      const swapRoute = enterPositionData.value?.uniswapRouterData.routes[0];
      const executionPrice =
        enterPositionData.value?.uniswapRouterData.tradeExecutionPrice;
      const routePremium = enterPositionData?.value?.potionRouterData?.premium;

      const counterparties =
        enterPositionData.value?.potionRouterData.counterparties.map(
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
        enterPositionData.value?.uniswapRouterData &&
        enterPositionData.value?.fallbackUniswapRouterData &&
        swapRoute &&
        swapRoute.protocol === Protocol.V3 &&
        executionPrice &&
        routePremium
      ) {
        const USDCToken = convertUniswapTokenToToken(USDCUniToken);
        // mock the official address of USDC with the one from the local deployment
        const collateralTokenToSwap = mockCollateralToken(USDCToken);

        const swapInfo = evaluateUniswapRoute(
          enterPositionData.value?.uniswapRouterData,
          UniswapActionType.ENTER_POSITION, // TODO: change enum names to better ones
          oraclePrice.value,
          underlyingToken.value,
          collateralTokenToSwap
        );

        const potionBuyInfo = {
          targetPotionAddress: newOtokenAddress,
          underlyingAsset: underlyingToken.value.address,
          strikePriceInUSDC: strikePrice.value,
          expirationTimestamp: expirationTimestamp,
          sellers: counterparties,
          expectedPremiumInUSDC: routePremium,
        };

        const fallbackSwapInfo = evaluateUniswapRoute(
          enterPositionData.value?.fallbackUniswapRouterData,
          UniswapActionType.ENTER_POSITION, // TODO: change enum names to better ones
          oraclePrice.value,
          underlyingToken.value,
          collateralTokenToSwap
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

  onMounted(async () => {
    await Promise.all([getPoolsFromCriterias, getGas()]);
  });

  return {
    enterPositionData,
    isActionLoading,
    totalAmountToSwap,
    isTotalAmountValid,
    hasCounterparties,
    isEnterPositionOperationValid,
    loadEnterPositionRoute,
    evaluateEnterPositionData,
    effectiveVaultSizeInUnderlying,
  };
}
