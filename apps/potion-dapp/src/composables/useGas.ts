import { computed, onMounted } from "vue";
import { useBlockNative } from "./useBlockNative";
import { currencyFormatter } from "potion-ui";
import type { Ref } from "vue";

export function useGas(ethPrice: Ref<number | null>, operationUnits: number) {
  const { getGas, gasPrice } = useBlockNative();

  onMounted(async () => {
    await getGas();
  });

  const gasSaving = computed(() => {
    if (ethPrice.value && gasPrice.value) {
      return ((gasPrice.value * 10e8 * operationUnits) / 1e18) * ethPrice.value;
    }
    return 0;
  });

  const formattedGasSaving = computed(() =>
    currencyFormatter(gasSaving.value, "$")
  );

  return {
    gasPrice,
    gasSaving,
    formattedGasSaving,
  };
}
