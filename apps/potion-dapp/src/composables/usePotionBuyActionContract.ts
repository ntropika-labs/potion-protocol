import { computed, onMounted, ref, unref } from "vue";

import { formatUnits } from "@ethersproject/units";
import { PotionBuyAction__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "./useEthersContract";

import type { Ref } from "vue";

import type { PotionBuyAction } from "@potion-protocol/hedging-vault/typechain";

export interface ActionPayout {
  currentPayout: number;
  isFinal: boolean;
}

// ActionsManager allows for querying the address of the action
export function usePotionBuyActionContract(contractAddress: string) {
  const { initContract } = useEthersContract();
  const errorRegistry: { [key: string]: Ref<string | null> } = {};

  //Provider initialization
  const initContractProvider = () => {
    return initContract(
      false,
      false,
      PotionBuyAction__factory,
      contractAddress.toLowerCase()
    ) as PotionBuyAction;
  };

  /**
   * Contract methods
   **/

  //Next cycle timestamp
  const nextCycleTimestamp = ref(0);
  const nextCycleTimestampLoading = ref(false);
  const nextCycleTimestampError = ref<string | null>(null);
  const getNextCycleTimestamp = async () => {
    nextCycleTimestampLoading.value = true;
    nextCycleTimestampError.value = null;
    try {
      const provider = initContractProvider();
      nextCycleTimestamp.value = parseInt(
        formatUnits(await provider.nextCycleStartTimestamp(), 0)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get next cycle timestamp: ${error.message}`
          : "Cannot get next cycle timestamp";
      nextCycleTimestampError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      nextCycleTimestampLoading.value = false;
    }
  };
  errorRegistry["nextCycleTimestamp"] = nextCycleTimestampError;

  //Cycle duration
  const cycleDurationSecs = ref(0);
  const cycleDurationSecsLoading = ref(false);
  const cycleDurationSecsError = ref<string | null>(null);
  const getCycleDurationSecs = async () => {
    cycleDurationSecsLoading.value = true;
    cycleDurationSecsError.value = null;
    try {
      const provider = initContractProvider();
      cycleDurationSecs.value = parseFloat(
        formatUnits(await provider.cycleDurationSecs(), 0)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get cycle duration: ${error.message}`
          : "Cannot get cycle duration";
      cycleDurationSecsError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      cycleDurationSecsLoading.value = false;
    }
  };
  errorRegistry["cycleDurationSecs"] = cycleDurationSecsError;

  //Max premium percentage
  const maxPremiumPercentage = ref(0);
  const maxPremiumPercentageLoading = ref(false);
  const maxPremiumPercentageError = ref<string | null>(null);
  const getMaxPremiumPercentage = async () => {
    maxPremiumPercentageLoading.value = true;
    maxPremiumPercentageError.value = null;
    try {
      const provider = initContractProvider();
      maxPremiumPercentage.value = parseFloat(
        formatUnits(await provider.maxPremiumPercentage(), 6)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get maximum percentage: ${error.message}`
          : "Cannot get maximum percentage";
      maxPremiumPercentageError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      maxPremiumPercentageLoading.value = false;
    }
  };
  errorRegistry["maxPremiumPercentage"] = maxPremiumPercentageError;

  //Premium slippage
  const premiumSlippage = ref(0);
  const premiumSlippageLoading = ref(false);
  const premiumSlippageError = ref<string | null>(null);
  const getPremiumSlippage = async () => {
    premiumSlippageLoading.value = true;
    premiumSlippageError.value = null;
    try {
      const provider = initContractProvider();
      premiumSlippage.value = parseFloat(
        formatUnits(await provider.premiumSlippage(), 6)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get premium slippage: ${error.message}`
          : "Cannot get premium slippage";
      premiumSlippageError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      premiumSlippageLoading.value = false;
    }
  };
  errorRegistry["premiumSlippage"] = premiumSlippageError;

  //Swap slippage
  const swapSlippage = ref(0);
  const swapSlippageLoading = ref(false);
  const swapSlippageError = ref<string | null>(null);
  const getSwapSlippage = async () => {
    swapSlippageLoading.value = true;
    swapSlippageError.value = null;
    try {
      const provider = initContractProvider();
      swapSlippage.value = parseFloat(
        formatUnits(await provider.swapSlippage(), 6)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get swap slippage: ${error.message}`
          : "Cannot get swap slippage";
      swapSlippageError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      swapSlippageLoading.value = false;
    }
  };
  errorRegistry["swapSlippage"] = swapSlippageError;

  //Max swap duration
  const maxSwapDurationSecs = ref(0);
  const maxSwapDurationSecsLoading = ref(false);
  const maxSwapDurationSecsError = ref<string | null>(null);
  const getMaxSwapDurationSecs = async () => {
    maxSwapDurationSecsLoading.value = true;
    maxSwapDurationSecsError.value = null;
    try {
      const provider = initContractProvider();
      maxSwapDurationSecs.value = parseFloat(
        formatUnits(await provider.maxSwapDurationSecs(), 0)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get max swap duration: ${error.message}`
          : "Cannot get max swap duration";
      maxSwapDurationSecsError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      maxSwapDurationSecsLoading.value = false;
    }
  };
  errorRegistry["maxSwapDurationSecs"] = maxSwapDurationSecsError;

  //Strike Percentage
  const strikePercentage = ref(0);
  const strikePercentageLoading = ref(false);
  const strikePercentageError = ref<string | null>(null);
  const getStrikePercentage = async () => {
    strikePercentageLoading.value = true;
    strikePercentageError.value = null;
    try {
      const provider = initContractProvider();
      strikePercentage.value = parseFloat(
        formatUnits(await provider.strikePercentage(), 6)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get strike price: ${error.message}`
          : "Cannot get strike price";
      strikePercentageError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      strikePercentageLoading.value = false;
    }
  };
  errorRegistry["strikePrice"] = strikePercentageError;

  //Current Payout
  const currentPayout = ref<ActionPayout>();
  const currentPayoutLoading = ref(false);
  const currentPayoutError = ref<string | null>(null);
  const getCurrentPayout = async (investmentAsset: string | Ref<string>) => {
    currentPayoutLoading.value = true;
    currentPayoutError.value = null;
    try {
      const provider = initContractProvider();
      const payout = await provider.calculateCurrentPayout(
        unref(investmentAsset).toLowerCase()
      );
      currentPayout.value = {
        isFinal: payout[0],
        currentPayout: parseFloat(formatUnits(payout[1], 6)),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get current payout: ${error.message}`
          : "Cannot get current payout";
      currentPayoutError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      currentPayoutLoading.value = false;
    }
  };
  errorRegistry["currentPayout"] = currentPayoutError;

  // Get strategy info

  const strategyLoading = ref(false);
  const getStrategyInfo = async () => {
    try {
      strategyLoading.value = true;
      await Promise.all([
        getNextCycleTimestamp(),
        getCycleDurationSecs(),
        getMaxPremiumPercentage(),
        getMaxSwapDurationSecs(),
        getPremiumSlippage(),
        getSwapSlippage(),
        getStrikePercentage(),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get strategy info: ${error.message}`
          : "Cannot get strategy info";

      throw new Error(errorMessage);
    } finally {
      strategyLoading.value = false;
    }
  };
  const strategyError = computed(() => {
    const errors = Object.values(errorRegistry);
    let strategyError: string | null = null;

    for (let i = 0; i < errors.length; i++) {
      const e = errors[i];

      if (e) {
        strategyError =
          "Cannot get info about current strategy at: " + contractAddress;
        break;
      }
    }
    return strategyError;
  });

  onMounted(async () => {
    await getStrategyInfo();
  });

  return {
    strategyLoading,
    strategyError,
    getStrategyInfo,
    nextCycleTimestampLoading,
    nextCycleTimestampError,
    nextCycleTimestamp,
    getNextCycleTimestamp,
    cycleDurationSecsLoading,
    cycleDurationSecsError,
    cycleDurationSecs,
    getCycleDurationSecs,
    maxPremiumPercentageLoading,
    maxPremiumPercentageError,
    maxPremiumPercentage,
    getMaxPremiumPercentage,
    premiumSlippageLoading,
    premiumSlippageError,
    premiumSlippage,
    getPremiumSlippage,
    swapSlippageLoading,
    swapSlippageError,
    swapSlippage,
    getSwapSlippage,
    maxSwapDurationSecsLoading,
    maxSwapDurationSecsError,
    maxSwapDurationSecs,
    getMaxSwapDurationSecs,
    strikePercentageLoading,
    strikePercentageError,
    strikePercentage,
    getStrikePercentage,
    currentPayoutLoading,
    currentPayoutError,
    currentPayout,
    getCurrentPayout,
  };
}
