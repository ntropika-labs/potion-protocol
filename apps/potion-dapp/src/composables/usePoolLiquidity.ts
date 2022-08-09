import { computed, ref, unref } from "vue";
import type { Ref, ComputedRef } from "vue";

function deepUnref<T>(value: T | Ref<T> | ComputedRef<T>): T {
  const t = unref(value);
  return unref(t);
}

export function usePoolLiquidity(
  size: Ref<string> | ComputedRef<string>,
  locked: Ref<string> | ComputedRef<string>
) {
  const sessionLiquidity = ref(0);

  const utilization = computed(() => parseInt(locked.value));
  const intSize = computed(() => parseInt(size.value));

  const liquidity = computed(() => sessionLiquidity.value + intSize.value);
  const formattedLiquidity = computed(() => liquidity.value.toString());

  const unutilizedLiquidity = computed(
    () => liquidity.value - utilization.value
  );
  const percentage = computed(
    () => (utilization.value * 100) / liquidity.value
  );

  const utilizationPercentage = computed(() =>
    (isNaN(percentage.value) ? 0 : percentage.value).toString()
  );

  const addLiquidity = (provided: number | Ref<number> | ComputedRef<number>) =>
    (sessionLiquidity.value += deepUnref(provided));
  const decreaseLiquidity = (
    provided: number | Ref<number> | ComputedRef<number>
  ) => (sessionLiquidity.value -= deepUnref(provided));

  return {
    liquidity,
    formattedLiquidity,
    addLiquidity,
    decreaseLiquidity,
    utilization,
    utilizationPercentage,
    unutilizedLiquidity,
  };
}
