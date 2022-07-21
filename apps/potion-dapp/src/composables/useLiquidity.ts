import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

export function useLiquidity(
  initialLiquidity: number,
  userBalance: Ref<number> | ComputedRef<number>,
  minLiquidity = 0
) {
  const liquidity = ref(initialLiquidity);
  const validInput = ref(false);
  const validLiquidity = computed(
    () =>
      validInput.value &&
      liquidity.value > minLiquidity &&
      liquidity.value < userBalance.value
  );

  return {
    liquidity,
    validInput,
    validLiquidity,
  };
}
