import { useGetOrderBookEntriesQuery } from "subgraph-queries/generated/urql";
import { ref, computed, watch, unref } from "vue";
import type { Ref } from "vue";
import type { GetOrderBookEntriesQuery } from "subgraph-queries/generated/operations";

type OrderBookEntries = GetOrderBookEntriesQuery["orderBookEntries"];

const usePotionOrders = (address: string | Ref<string>) => {
  const orders = ref<OrderBookEntries>([]);
  const alreadyLoadedIds = computed(() => [
    "",
    ...orders.value.map((v) => v.id),
  ]);

  const variables = computed(() => ({
    otoken: unref(address),
    alreadyLoadedIds: alreadyLoadedIds.value,
  }));

  const { data, fetching: loading } = useGetOrderBookEntriesQuery({
    variables,
  });

  watch(data, () => {
    if (data?.value && data.value.orderBookEntries.length > 0) {
      orders.value = orders.value.concat(data?.value?.orderBookEntries);
    }
  });

  return {
    orders,
    loading,
  };
};

export { usePotionOrders };
