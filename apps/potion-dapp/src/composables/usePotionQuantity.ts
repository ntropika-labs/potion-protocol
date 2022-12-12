import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

export function usePotionQuantity(
  strikeSelected: Ref<number> | ComputedRef<number>
) {
  const potionQuantity = ref(0.001);
  const isPotionQuantityValid = ref(false);

  const orderSize = computed(() => strikeSelected.value * potionQuantity.value);

  return {
    potionQuantity,
    isPotionQuantityValid,
    orderSize,
  };
}
