import { computed, onMounted, ref } from "vue";

import { formatUnits } from "@ethersproject/units";
import { PotionBuyAction__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "./useEthersContract";

import type { Ref } from "vue";

import type { PotionBuyAction } from "@potion-protocol/hedging-vault/typechain";
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
      contractAddress
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
    try {
      const provider = initContractProvider();
      nextCycleTimestamp.value = parseInt(
        formatUnits(await provider.nextCycleStartTimestamp())
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
    try {
      const provider = initContractProvider();
      cycleDurationSecs.value = parseFloat(
        formatUnits(await provider.cycleDurationSecs())
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
  const maxSwapDurationSecsLoading = ref(false);
  const maxSwapDurationSecsError = ref<string | null>(null);
  const getMaxSwapDurationSecs = async () => {
    try {
      const provider = initContractProvider();
      // return await provider.maxSwapDurationSecs();
      return parseFloat(formatUnits(await provider.maxSwapDurationSecs()));
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

  // Get strategy info

  const strategyLoading = ref(false);

  onMounted(async () => {
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
    strategyLoading.value = false;
  });
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
  const getStrategyInfo = async () => {
    try {
      strategyLoading.value = true;
      return await Promise.all([
        getNextCycleTimestamp(),
        getCycleDurationSecs(),
        getMaxPremiumPercentage(),
        getMaxSwapDurationSecs(),
        getPremiumSlippage(),
        getSwapSlippage(),
        getStrikePercentage(),
      ]).then(
        ([
          nextCycleTimestamp,
          cycleDurationSecs,
          maxPremiumPercentage,
          maxSwapDurationSecs,
          premiumSlippage,
          swapSlippage,
          strikePrice,
        ]) => {
          return {
            nextCycleTimestamp,
            cycleDurationSecs,
            maxPremiumPercentage,
            maxSwapDurationSecs,
            premiumSlippage,
            swapSlippage,
            strikePrice,
          };
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch strategy info: ${error.message}`);
      } else {
        throw new Error("Cannot fetch strategy info");
      }
    } finally {
      strategyLoading.value = false;
    }
  };

  return {
    strategyLoading,
    strategyError,
    getStrategyInfo,
    nextCycleTimestampLoading,
    nextCycleTimestampError,
    getNextCycleTimestamp,
    cycleDurationSecsLoading,
    cycleDurationSecsError,
    getCycleDurationSecs,
    maxPremiumPercentageLoading,
    maxPremiumPercentageError,
    getMaxPremiumPercentage,
    premiumSlippageLoading,
    premiumSlippageError,
    getPremiumSlippage,
    swapSlippageLoading,
    swapSlippageError,
    getSwapSlippage,
    maxSwapDurationSecsLoading,
    maxSwapDurationSecsError,
    getMaxSwapDurationSecs,
    strikePercentageLoading,
    strikePercentageError,
    getStrikePercentage,
  };
}
