import { useGetBuyerRecordsQuery } from "subgraph-queries/generated/urql";
import { ref, computed, watch, unref } from "vue";
import type { Ref } from "vue";
import type { GetBuyerRecordsQuery } from "subgraph-queries/generated/operations";

type BuyerRecordsEntries = GetBuyerRecordsQuery["buyerRecords"];

const useBuyerRecords = (
  buyer: string | Ref<string>,
  expiry: number | Ref<number>
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
    if (data?.value && data.value.buyerRecords.length > 0) {
      records.value = data?.value?.buyerRecords;
    }
  });

  return {
    records,
    loading,
  };
};

export { useBuyerRecords };
