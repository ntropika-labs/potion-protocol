import { computed, unref } from "vue";
import { useGetPotionByIdQuery } from "subgraph-queries/generated/urql";

import type { ComputedRef, Ref } from "vue";

export function usePotion(id: Ref<string> | ComputedRef<string>) {
  const variables = computed(() => ({
    id: unref(id),
  }));

  const pause = computed(() => id.value === "");

  const { data, error, fetching } = useGetPotionByIdQuery({ variables, pause });

  const otoken = computed(() => data?.value?.otoken ?? null);
  const otokenAddress = computed(() => otoken?.value?.tokenAddress ?? null);
  const otokenStrikePrice = computed(() =>
    parseFloat(otoken.value?.strikePrice ?? "0")
  );
  const otokenExpiry = computed(() => parseInt(otoken.value?.expiry ?? "0"));

  const underlyingAddress = computed(
    () => otoken?.value?.underlyingAsset?.address ?? ""
  );

  return {
    data,
    error,
    fetching,
    otoken,
    otokenAddress,
    otokenStrikePrice,
    otokenExpiry,
    underlyingAddress,
  };
}
