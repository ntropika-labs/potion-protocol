import { useGetOrderBookEntriesQuery } from "subgraph-queries/generated/urql";
import { ref, computed, watch, isRef, onMounted } from "vue";

import { deepUnref } from "@/helpers/vue";
import { isValidAddress } from "@/helpers/addresses";

import type { MaybeRef } from "@vueuse/core";
import type { GetOrderBookEntriesQuery } from "subgraph-queries/generated/operations";

export type OrderBookEntries = GetOrderBookEntriesQuery["orderBookEntries"];

const usePotionOrders = (address: MaybeRef<string>) => {
  const orders = ref<OrderBookEntries>([]);

  const validAddress = computed(() => isValidAddress(deepUnref(address)));
  const alreadyLoadedIds = computed(() => [
    "",
    ...orders.value.map((v) => v.id),
  ]);

  const variables = computed(() => ({
    otoken: deepUnref(address),
    alreadyLoadedIds: alreadyLoadedIds.value,
  }));

  const {
    data,
    fetching: loading,
    executeQuery,
  } = useGetOrderBookEntriesQuery({
    variables,
  });

  const loadOrders = async () => {
    if (validAddress.value) {
      orders.value = [];
      await executeQuery();
      appendNewOrders();
    }
  };

  const appendNewOrders = () => {
    const newOrders = data?.value?.orderBookEntries ?? [];
    orders.value = orders.value.concat(newOrders);
  };

  if (isRef(address)) {
    watch(address, loadOrders);
  }

  onMounted(appendNewOrders);
  watch(data, appendNewOrders);

  return {
    orders,
    loading,
  };
};

export { usePotionOrders };
