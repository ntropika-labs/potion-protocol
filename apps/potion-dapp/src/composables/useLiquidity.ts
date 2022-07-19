import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

export function useLiquidity(
  initialLiquidity: number,
  userBalance: Ref<number> | ComputedRef<number>
) {
  const liquidity = ref(initialLiquidity);
  const validInput = ref(false);
  const validLiquidity = computed(
    () =>
      validInput.value &&
      liquidity.value > 0 &&
      liquidity.value < userBalance.value
  );

  return {
    liquidity,
    validInput,
    validLiquidity,
  };
}
