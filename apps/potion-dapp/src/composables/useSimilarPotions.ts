import {
  useGetSimilarPotionByAssetQuery,
  useGetSimilarPotionByDurationQuery,
  useGetSimilarPotionByStrikeQuery,
} from "subgraph-queries/generated/urql";
import { isRef, onMounted, unref } from "vue";

import { useEthersProvider } from "@/composables/useEthersProvider";
import { createValidExpiry } from "@/helpers/time";
import { computed } from "vue";
import { watchDebounced } from "@vueuse/core";

import type { MaybeStringRef, MaybeNumberRef } from "dapp-types";

const getCentralItems = <T>(array: T[], itemsToGet: number): T[] => {
  if (array.length > itemsToGet) {
    const center = Math.floor(array.length / 2);
    const offset = Math.floor(itemsToGet / 2);
    const rest = itemsToGet % 2;
    return array.slice(center - rest - offset, center + offset);
  }
  return array;
};

export function useSimilarPotions(
  underlyingAssetAddress: MaybeStringRef,
  strike: MaybeNumberRef,
  duration: MaybeNumberRef,
  currentPrice: MaybeNumberRef
) {
  const { blockTimestamp, getBlock } = useEthersProvider();
  const validExpiry = computed(() => {
    return createValidExpiry(unref(blockTimestamp), unref(duration) ?? 0);
  });
  onMounted(async () => {
    await getBlock("latest");
  });
  const assetStepVariables = computed(() => {
    return {
      expiry: unref(blockTimestamp).toString(),
      addresses: [unref(underlyingAssetAddress) ?? ""],
      strikePrice: ((unref(currentPrice) ?? 0) * 3).toString() ?? "0",
      limit: 6,
    };
  });
  const strikeStepVariables = computed(() => {
    return {
      expiry: unref(blockTimestamp).toString(),
      addresses: [unref(underlyingAssetAddress) ?? ""],
      limit: 6,
      strikePrice: unref(strike)?.toString() ?? "",
      doubleStrikePrice: ((unref(strike) ?? 0) * 2)?.toString() ?? "",
    };
  });
  const durationStepVariables = computed(() => {
    return {
      expiry: unref(blockTimestamp).toString(),
      addresses: [unref(underlyingAssetAddress) ?? ""],
      limit: 6,
      strikePrice: unref(strike)?.toString() ?? "",
      doubleStrikePrice: ((unref(strike) ?? 0) * 2)?.toString() ?? "",
      duration: validExpiry.value.toString(),
    };
  });
  const {
    data: similarByAsset,
    executeQuery: getByAsset,
    fetching: fetchingByAsset,
  } = useGetSimilarPotionByAssetQuery({
    variables: assetStepVariables,
    pause: true,
  });
  const {
    data: similarByStrike,
    executeQuery: getByStrike,
    fetching: fetchingByStrike,
  } = useGetSimilarPotionByStrikeQuery({
    variables: strikeStepVariables,
    pause: true,
  });

  const {
    data: similarByDuration,
    executeQuery: getByDuration,
    fetching: fetchingByDuration,
  } = useGetSimilarPotionByDurationQuery({
    variables: durationStepVariables,
    pause: true,
  });

  const isLoading = computed(
    () =>
      fetchingByAsset.value ||
      fetchingByStrike.value ||
      fetchingByDuration.value
  );

  if (isRef(underlyingAssetAddress) && isRef(strike) && isRef(duration)) {
    watchDebounced(
      underlyingAssetAddress,
      () => {
        if (
          underlyingAssetAddress.value !== null &&
          underlyingAssetAddress.value !== ""
        ) {
          console.info(
            "Search similar potions by asset with:",
            assetStepVariables.value
          );
          getByAsset();
        }
      },
      { debounce: 1000 }
    );
    watchDebounced(
      strike,
      () => {
        if (
          underlyingAssetAddress.value !== null &&
          underlyingAssetAddress.value !== ""
        ) {
          console.info(
            "Search similar potions by strike with:",
            strikeStepVariables.value
          );
          getByStrike();
        }
      },
      { debounce: 1000 }
    );
    watchDebounced(
      duration,
      () => {
        if (
          underlyingAssetAddress.value !== null &&
          underlyingAssetAddress.value !== ""
        ) {
          console.info(
            "Search similar potions by duration with:",
            durationStepVariables.value
          );
          getByDuration();
        }
      },
      { debounce: 1000 }
    );
  }
  const computedSimilarByAsset = computed(() => {
    return similarByAsset.value?.otokens ?? [];
  });
  const computedSimilarByStrike = computed(() => {
    const minStrike = similarByStrike.value?.minStrike ?? [];
    const maxStrike = similarByStrike.value?.maxStrike ?? [];
    const a = minStrike.slice().reverse().concat(maxStrike);
    return getCentralItems(a, 5);
  });
  const computedSimilarByDuration = computed(() => {
    const minDurationMinStrike =
      similarByDuration.value?.minDurationMinStrike ?? [];
    const minDurationMaxStrike =
      similarByDuration.value?.minDurationMaxStrike ?? [];
    const maxDurationMinStrike =
      similarByDuration.value?.maxDurationMinStrike ?? [];
    const maxDurationMaxStrike =
      similarByDuration.value?.maxDurationMaxStrike ?? [];

    const maxDuration = getCentralItems(
      maxDurationMinStrike.slice().reverse().concat(maxDurationMaxStrike),
      5
    );
    const minDuration = getCentralItems(
      minDurationMinStrike.slice().reverse().concat(minDurationMaxStrike),
      5
    );
    return getCentralItems(minDuration.concat(maxDuration), 5);
  });
  return {
    isLoading,
    computedSimilarByAsset,
    computedSimilarByStrike,
    computedSimilarByDuration,
  };
}
