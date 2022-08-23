import { useGetBuyerRecordsQuery } from "subgraph-queries/generated/urql";
import { ref, computed, watch, unref } from "vue";
import type { MaybeRef } from "@vueuse/core";
import type { GetBuyerRecordsQuery } from "subgraph-queries/generated/operations";

type BuyerRecordsEntries = GetBuyerRecordsQuery["buyerRecords"];

const useBuyerRecords = (
  buyer: MaybeRef<string>,
  expiry: MaybeRef<number>
) => {
  const records = ref<BuyerRecordsEntries>([]);

  const variables = computed(() => ({
    buyer: unref(buyer),
    expiry: unref(expiry).toString(),
  }));

  const { data, fetching: loading } = useGetBuyerRecordsQuery({
    variables,
  });

  watch(data, () => {
    records.value = data?.value?.buyerRecords ?? [];
  });

  return {
    records,
    loading,
  };
};

export { useBuyerRecords };
