import { computed, onMounted, ref, type Ref } from "vue";
import { TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";

import {
  getChainId,
  convertUniswapTokenToToken,
  evaluateUniswapRoute,
  USDCUniToken,
} from "@/helpers/uniswap";
import { getRecipientAddress } from "@vault-operator-utils";

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
 * @param cycleDurationDays Dynamic reference to the cycle duration for the hedging vault, expressed in days
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
  /**
   * Dynamic reference to the actual data to enter the position
   * - `potionRouterData` - potion depth router data containing a set of counterparties and the premium evaluated over the effective vault size
   * - `uniswapRouterData` - uniswap alpha router data to swap underlying to USDC to pay for the premium
   * - `fallbackUniswapRouterData` - uniswap alpha router data to swap the whole amount using the fallback strategy
   */
  const enterPositionData: Ref<{
    potionRouterData: DepthRouterReturn;
    uniswapRouterData: UniswapRouterReturn;
    fallbackUniswapRouterData: UniswapRouterReturn;
  } | null> = ref(null);

  // TODO: DEBUG PURPOSE- REMOVE
  const debugData: Ref<{
    effectiveVaultSizeInUnderlying?: number;
    potionRouterInitialData?: DepthRouterReturn;
    totalPrincipalBeforeWithdrawalAndDepositInUnderlying?: number;
    exitSwapAmountInUnderlying?: number;
    inputVaultUnderlyingBalance?: number;
    potionBuyActionUnderlyingBalance?: number;
    swapToUSDCActionUnderlyingBalance?: number;
    swapToUSDCActionUSDCBalance?: number;
    investmentVaultTotalShares?: number;
    totalSharesToWithdraw?: number;
    shareToUnderlyingPrice?: number;
    totalAssetsToWithdrawInUnderlying?: number;
    totalPrincipalBeforeWithdrawalInUnderlying?: number;
  }> = ref({});
  // END TODO: DEBUG PURPOSE- REMOVE

  // Fetch contracts addresses
  const { PotionBuyAction, RoundsInputVault, USDC } = getContractsFromVault(
    vaultAddress.value
  );

  const underlyingTokenAddress = computed(
    () => underlyingToken.value?.address.toLowerCase() || ""
  );

  // Initialize alpha router instance
  const {
    getRoute,
    routerLoading,
    togglePolling: toggleUniswapPolling,
  } = useAlphaRouter(getChainId());

  // Initialize ERC20 contract to fetch the current balance in underlying tokens
  const { getTokenBalance } = useErc20Contract(underlyingTokenAddress, false);
  // Initialize ERC20 contract to fetch the current balance in USDC
  //const { getTokenBalance: getUSDCBalance } = useErc20Contract(USDC, false);
  // Initialize block native instance to fetch gas price
  const { getGas, gasPrice } = useBlockNative();

  const { getTargetOtokenAddress } = useOtokenFactory();

  /**
   * Computes the total principal to swap after deposits and withdrawals have been taken into account.
   * @returns The total principal to swap expressed in underlying
   */
  const getTotalPrincipalInUnderlying = async () => {
    // Get the current payout in USDC
    const totalPayout = totalPayoutUSDC.value
      ? totalPayoutUSDC.value.currentPayout
      : 0;
    // Convert the payout to underlying
    const exitSwapAmountInUnderlying = totalPayout / oraclePrice.value;

    // Get the underlying balance for the RoundsInputVault
    const inputVaultUnderlyingBalance = await getTokenBalance(
      false,
      RoundsInputVault
    );

    // Get the underlying balance for the PotionBuyAction
    const potionBuyActionUnderlyingBalance = await getTokenBalance(
      false,
      PotionBuyAction
    );
    // TODO: based on the strategy used for the  previous round get the token
    // balance for the strategy applied (PotionBuyAction or SwapToUSDCAction)
    // const swapToUSDCActionUnderlyingBalance = await getTokenBalance(
    //   false,
    //   SwapToUSDCAction
    // );
    // const swapToUSDCActionUSDCBalance = await getUSDCBalance(
    //   false,
    //   SwapToUSDCAction
    // );
    // const swapToUSDCActionExitSwapAmountInUnderlying =
    //   (swapToUSDCActionUnderlyingBalance as number) +
    //   (swapToUSDCActionUSDCBalance as number) / oraclePrice.value;

    // const totalPrincipalBeforeWithdrawalAndDepositInUnderlying =
    // exitSwapAmountInUnderlying +
    // (potionBuyActionUnderlyingBalance as number) +
    // swapToUSDCActionExitSwapAmountInUnderlying;

    // Compute the total principal without taking into account deposits and withdrawals
    const totalPrincipalBeforeWithdrawalAndDepositInUnderlying =
      exitSwapAmountInUnderlying + (potionBuyActionUnderlyingBalance as number);

    // Sum the input vault underlying balance (total deposits) to the previous value
    const totalPrincipalBeforeWithdrawalInUnderlying =
      totalPrincipalBeforeWithdrawalAndDepositInUnderlying +
      (inputVaultUnderlyingBalance as number);

    debugData.value.totalPrincipalBeforeWithdrawalInUnderlying =
      totalPrincipalBeforeWithdrawalInUnderlying;
    debugData.value.totalPrincipalBeforeWithdrawalAndDepositInUnderlying =
      totalPrincipalBeforeWithdrawalAndDepositInUnderlying;
    debugData.value.exitSwapAmountInUnderlying = exitSwapAmountInUnderlying;
    debugData.value.inputVaultUnderlyingBalance =
      inputVaultUnderlyingBalance as number;
    debugData.value.potionBuyActionUnderlyingBalance =
      potionBuyActionUnderlyingBalance as number;
    // debugData.value.swapToUSDCActionUnderlyingBalance =
    //   swapToUSDCActionUnderlyingBalance as number;
    // debugData.value.swapToUSDCActionUSDCBalance =
    //   swapToUSDCActionUSDCBalance as number;

    // When the vault is not yet initialized the vaultTotalSupply is 0
    let shareToUnderlyingPrice = 1;
    // If the investment vault contains any shares then compute the actual share->underlying asset ratio
    if (vaultTotalSupply.value !== 0) {
      const investmentVaultTotalShares = vaultTotalSupply.value;

      shareToUnderlyingPrice =
        totalPrincipalBeforeWithdrawalAndDepositInUnderlying /
        investmentVaultTotalShares;

      debugData.value.investmentVaultTotalShares = investmentVaultTotalShares;
      debugData.value.shareToUnderlyingPrice = shareToUnderlyingPrice;
    }

    // The total amount of shares to withdraw is retrieved from RoundsOutputVault
    const totalSharesToWithdraw = outputVaultTotalShares.value;

    // Compute the total amount of underlyings to withdraw by multipling the total amount of shares for the ratio
    const totalAssetsToWithdrawInUnderlying =
      totalSharesToWithdraw * shareToUnderlyingPrice;

    debugData.value.totalSharesToWithdraw = totalSharesToWithdraw;
    debugData.value.totalAssetsToWithdrawInUnderlying =
      totalAssetsToWithdrawInUnderlying;

    // Return the total amount of principal by subtracting the amount of underlying to withdraw from the total
    return (
      totalPrincipalBeforeWithdrawalInUnderlying -
      totalAssetsToWithdrawInUnderlying
    );
  };

  /**
   * Dynamic reference to the total amount of assets to swap.
   * It's used to dynamically update the parameters for the potion depth router
   * after evaluating the actual order size
   */
  const totalAmountToSwap = ref(-1);

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

  // Instantiate the potion depth router to fetch pools matching our criterias to purchase potions from
  const { getPoolsFromCriterias, routerParams: potionRouterParameters } =
    useDepthRouter(
      criteriasParam,
      totalAmountToSwap,
      strikePrice,
      gasPrice,
      oraclePrice
    );

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
   * Dynamic reference to compute whether or not the 'totalAmountToSwap' is a valid number
   */
  const isTotalAmountValid = computed(
    () => !Number.isNaN(totalAmountToSwap.value)
  );
  /**
   * Dynamic reference to compute wheter or not current data to enter the position
   * contains a valid set of counterparties from the potion depth router
   */
  const hasCounterparties = computed(
    () =>
      ((enterPositionData.value &&
        enterPositionData.value.potionRouterData?.counterparties?.length) ??
        0) > 0
  );

  /**
   * Dynamic reference to compute wheter or not current data to enter the position
   * contains a valid set of uniswap routes
   */
  const hasValidUniswapRoute = computed(
    () =>
      hasRoute(enterPositionData.value?.uniswapRouterData) &&
      hasRoute(enterPositionData.value?.fallbackUniswapRouterData)
  );

  /**
   * Dynamic reference to compute wheter or not current data to enter the position is
   * actually a valid operation.
   * The operation is valid if any of the following conditions are met:
   * - the total amount to swap is greater than 0 and we a set of counterparties from the potion depth router to purchase potions from
   * - the total amount to swap is 0 (uninitialized vault or vault with no liquidity)
   */
  const isEnterPositionOperationValid = computed(() => {
    // The route is only valid if we have a total amount to swap, a set of counterparties and at
    // least a pair of routes for the uniswap trade and the fallback strategy
    // Except for round 0 where there is no amount to swap
    return (
      isTotalAmountValid.value &&
      ((hasCounterparties.value && hasValidUniswapRoute.value) ||
        totalAmountToSwap.value === 0)
    );
  });

  const isActionLoading = computed(
    () => routerLoading.value || isLoading.value
  );

  /**
   * Loads data for the enter position operation and stores the results in `enterPositionData`.
   * This data actually consist of:
   * - a set of counterparties and a premium from the potion depth router evaluated over the actual order size taking into account the premium
   * (this is the 2nd run of the potion depth router)
   * - data from the uniswap alpha router containing info for the PotionBuyAction to swap from underlying to USDC (to pay for the premium)
   * - data from the uniswap alpha router containing info for the Fallback Action to swap the whole amount from underlying to USDC
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

      // Convert the uniswap token instance of USDC to the Token interface used internally
      const USDCToken = convertUniswapTokenToToken(USDCUniToken);
      // Create a reference to the current underlying token instance
      const underlyingTokenValue = underlyingToken.value;
      // Compute the recipient address for multi-hop paths
      const recipientAddress = getRecipientAddress(
        vaultAddress.value.toLowerCase()
      );

      // Get the total principal expressed in underlying
      const totalPrincipalInUnderlying = await getTotalPrincipalInUnderlying();
      // Compute the actual principal applying the hedging rate
      const principalHedgedAmountInUnderlying =
        (totalPrincipalInUnderlying * hedgingRate.value) / 100;

      // Convert the actual principal in USDC
      const principalHedgedAmountInUSDC =
        principalHedgedAmountInUnderlying *
        potionRouterParameters.value.strikePriceUSDC;

      // Update reference to the total amount to swap
      totalAmountToSwap.value = principalHedgedAmountInUSDC;

      // If we have liquidity the compute the routes
      if (totalAmountToSwap.value !== 0) {
        // Execute a first run of the potion depth router to get an estimated premium
        // over the total amount to swap
        const potionRouterWithEstimatedPremium = await worker.getPotionRoute(
          principalHedgedAmountInUSDC,
          potionRouterParameters.value.pools,
          potionRouterParameters.value.strikePriceUSDC,
          potionRouterParameters.value.gas,
          potionRouterParameters.value.ethPrice
        );

        console.log(
          "potionRouterWithEstimatedPremium",
          potionRouterWithEstimatedPremium
        );

        // Compute the actual order size by taking into account the premium from the previous step
        // The premium amount is going to be spent so it should not be taken into account when considering the order size
        const actualVaultSizeInUnderlying = calculateOrderSize(
          principalHedgedAmountInUnderlying,
          underlyingTokenValue.decimals as number,
          hedgingRate.value,
          strikePercent.value,
          oraclePrice.value.toFixed(6),
          potionRouterWithEstimatedPremium.premium.toFixed(
            USDCToken.decimals as number
          )
        );

        // Parse the big number as a float
        const effectiveVaultSizeInUnderlying = parseFloat(
          formatUnits(
            actualVaultSizeInUnderlying.effectiveVaultSize.toString(),
            underlyingTokenValue.decimals
          )
        );

        // Convert the effective vault size in usdc
        const effectiveVaultSizeInUSDC =
          effectiveVaultSizeInUnderlying *
          potionRouterParameters.value.strikePriceUSDC;

        // Compute the actual premium to pay over the effective vault size
        const potionRouterForEffectiveSize = await worker.getPotionRoute(
          effectiveVaultSizeInUSDC,
          potionRouterParameters.value.pools,
          potionRouterParameters.value.strikePriceUSDC,
          potionRouterParameters.value.gas,
          potionRouterParameters.value.ethPrice
        );

        debugData.value.effectiveVaultSizeInUnderlying =
          effectiveVaultSizeInUnderlying;

        // Sum the slippage to the premium for the effective principal hedged
        const premiumWithSlippage =
          ((100 + premiumSlippage) * potionRouterForEffectiveSize.premium) /
          100;
        console.log(
          "- PREMIUM WITH SLIPPAGE",
          premiumWithSlippage,
          potionRouterForEffectiveSize.premium
        );

        const underlyingTokenToSwap = underlyingToken.value;

        // Get the uniswap route to swap from underlying to USDC to pay for the premium
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

        // Get the uniswap route to swap from underlying to USDC for the whole amount as a fallback strategy
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

        debugData.value.potionRouterInitialData =
          potionRouterWithEstimatedPremium;

        // Store the info
        enterPositionData.value = {
          potionRouterData: potionRouterForEffectiveSize,
          uniswapRouterData: uniswapResult,
          fallbackUniswapRouterData: fallbackRoute,
        };
      } else {
        // If we have no liquidity then set the data to null
        enterPositionData.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Evaluate the current data for the enter position operation (from `enterPositionData`) and return
   * a flat object containing info to enter the position
   * @param blockTimestamp The timestamp of the latest block
   * @returns A flat object containing info for the potion buy action, the uniswap swap path and the fallback route
   */
  const evaluateEnterPositionData = async (
    blockTimestamp: Ref<number>
  ): Promise<{
    swapInfo: UniSwapInfo;
    potionBuyInfo: PotionBuyInfo;
    fallback: UniSwapInfo;
  }> => {
    if (isEnterPositionOperationValid.value) {
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

      // Get the address of a new option token matching the criteria we need
      const newOtokenAddress = await getTargetOtokenAddress(
        underlyingToken.value.address,
        USDC,
        USDC,
        strikePrice.value,
        expirationTimestamp,
        true
      );

      const collateralTokenToSwap = convertUniswapTokenToToken(USDCUniToken);

      if (hasCounterparties.value) {
        // TODO: extend it to split routes
        const swapRoute = enterPositionData.value?.uniswapRouterData.routes[0];
        const executionPrice =
          enterPositionData.value?.uniswapRouterData.tradeExecutionPrice;
        const routePremium =
          enterPositionData?.value?.potionRouterData?.premium;

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
          throw new Error(
            "A set of counterparties is missing or swapRoute isn't a protocol v3 route"
          );
        }
      } else if (enterPositionData.value === null) {
        // in this case the total amount to swap is 0
        return {
          swapInfo: {
            steps: [
              {
                inputToken: underlyingToken.value,
                fee: 0,
              },
            ],
            outputToken: collateralTokenToSwap,
            expectedPriceRate: 0,
          },
          potionBuyInfo: {
            targetPotionAddress: newOtokenAddress,
            underlyingAsset: underlyingToken.value.address,
            strikePriceInUSDC: strikePrice.value,
            expirationTimestamp: expirationTimestamp,
            sellers: [],
            expectedPremiumInUSDC: 0,
          },
          fallback: {
            steps: [
              {
                inputToken: underlyingToken.value,
                fee: 0,
              },
            ],
            outputToken: collateralTokenToSwap,
            expectedPriceRate: 0,
          },
        };
      }
    }

    throw new Error("Invalid Enter position data");
  };

  const resetData = () => {
    enterPositionData.value = null;
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
    debugData,
    resetData,
  };
}
