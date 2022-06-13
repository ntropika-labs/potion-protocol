import {
  useGetSimilarPotionByAssetQuery,
  useGetSimilarPotionByStrikeQuery,
} from "subgraph-queries/generated/urql";
import { isRef, onMounted, ref, unref } from "vue";

import { useEthersProvider } from "@/composables/useEthersProvider";
import { computed } from "@vue/reactivity";
import { watchDebounced } from "@vueuse/core";

import type { Ref } from "vue";
type stringOrNullRef = Ref<string> | Ref<null> | string | null;
type numberOrNullRef = Ref<number> | Ref<null> | number | null;

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
  underlyingAssetAddress: stringOrNullRef,
  strike: numberOrNullRef,
  duration: numberOrNullRef,
  assetPrice: numberOrNullRef
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
        strikePrice: unref(assetPrice)?.toString() ?? "0",
      })),
      pause: true,
    });
  const { data: similarByStrike, executeQuery: getByStrike } =
    useGetSimilarPotionByStrikeQuery({
      variables: computed(() => ({
        expiry: unref(blockTimestamp).toString(),
        addresses: [unref(underlyingAssetAddress) ?? ""],
        limit: 5,
        strikePrice: unref(assetPrice)?.toString() ?? "0",
        doubleStrikePrice: ((unref(assetPrice) ?? 0) * 2)?.toString() ?? "0",
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
        getByAsset();
        getByStrike();
      },
      { debounce: 1000 }
    );
  }

  const similarPotions = ref([]);
  // watch(similarByStrike, () => {

  // })

  return {
    similarByAsset,
    similarByStrike,
    similarPotions,
  };
}
