import {
  useGetSimilarPotionByAssetQuery,
  useGetSimilarPotionByStrikeQuery
} from "subgraph-queries/generated/urql";
import { isRef, onMounted, ref, unref } from "vue";

import { useEthersProvider } from "@/composables/useEthersProvider";
import { computed } from "@vue/reactivity";
import { watchDebounced } from "@vueuse/core";

import type { MaybeStringRef, MaybeNumberRef } from "dapp-types";

// const getCentralItems = <T>(array: T[], itemsToGet: number): T[] => {
//   if (array.length > itemsToGet) {
//     const center = Math.floor(array.length / 2);
//     const offset = Math.floor(itemsToGet / 2);
//     const rest = itemsToGet % 2;
//     return array.slice(center - rest - offset, center + offset);
//   }
//   return array;
// };

export function useSimilarPotions(
  underlyingAssetAddress: MaybeStringRef,
  strike: MaybeNumberRef,
  duration: MaybeNumberRef,
  assetPrice: MaybeNumberRef
) {
  const { blockTimestamp, getBlock } = useEthersProvider();
  onMounted(async () => {
    await getBlock("latest");
  });
  const { data: similarByAsset, executeQuery: getByAsset } =
    useGetSimilarPotionByAssetQuery({
      variables: computed(() => ({
        expiry: unref(blockTimestamp).toString(),
        addresses: [unref(underlyingAssetAddress) ?? ""],
        limit: 5,
        strikePrice: unref(strike)?.toString() ?? "0",
      })),
      pause: true,
    });
  const { data: similarByStrike, executeQuery: getByStrike } =
    useGetSimilarPotionByStrikeQuery({
      variables: computed(() => ({
        expiry: unref(blockTimestamp).toString(),
        addresses: [unref(underlyingAssetAddress) ?? ""],
        limit: 5,
        strikePrice: unref(strike)?.toString() ?? "0",
        doubleStrikePrice: ((unref(strike) ?? 0) * 2)?.toString() ?? "0",
      })),
      pause: true,
    });
  onMounted(() => {
    getByAsset();
    getByStrike();
  });

  if (
    isRef(underlyingAssetAddress) &&
    isRef(strike) &&
    isRef(duration) &&
    isRef(assetPrice)
  ) {
    watchDebounced(
      [underlyingAssetAddress, strike, duration, assetPrice],
      () => {
        console.log("firing queries");
        const variables = {
          expiry: unref(blockTimestamp).toString(),
          addresses: [unref(underlyingAssetAddress) ?? ""],
          limit: 5,
          strikePrice: unref(strike)?.toString() ?? "0",
          doubleStrikePrice: ((unref(strike) ?? 0) * 2)?.toString() ?? "0",
        };
        console.info(variables);
        getByAsset();
        getByStrike();
      },
      { debounce: 1000 }
    );
  }

  const similarPotions = ref([]);

  return {
    similarByAsset,
    similarByStrike,
    similarPotions,
  };
}
