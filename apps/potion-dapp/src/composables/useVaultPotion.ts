import { computed, watch, isRef, onMounted } from "vue";
import { useBuyerRecords } from "@/composables/useBuyerRecords";
import type { MaybeRef } from "@vueuse/core";

const useVaultPotion = (
  potionBuyAction: MaybeRef<string>,
  timestamp: MaybeRef<number>
) => {
  const { records, loadBuyerRecords } = useBuyerRecords(
    potionBuyAction,
    timestamp
  );

  const otoken = computed(() => records?.value?.[0]?.otoken ?? null);
  const potionAddress = computed(() => otoken.value?.id ?? null);
  const potionsQuantity = computed(() => {
    const quantity = records?.value?.[0]?.numberOfOTokens ?? "0";
    return parseFloat(quantity);
  });
  const strikePrice = computed(() => {
    const price = otoken.value?.strikePrice ?? "0";
    return parseFloat(price);
  });

  if (isRef(timestamp)) {
    watch(timestamp, loadBuyerRecords);
  }

  onMounted(loadBuyerRecords);

  return {
    potionAddress,
    potionsQuantity,
    strikePrice,
  };
};

export { useVaultPotion };
