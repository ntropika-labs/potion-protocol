import { ref, computed } from "vue";
import type { BondingCurveParams } from "dapp-types";

export function useBondingCurves(
  params = { a: 0.05, b: 0.05, c: 0.05, d: 0.05, maxUtil: 1 }
) {
  const bondingCurve = ref<BondingCurveParams>(params);

  const validCurve = computed(
    () =>
      bondingCurve.value.a > 0 &&
      bondingCurve.value.b > 0 &&
      bondingCurve.value.c > 0 &&
      bondingCurve.value.d > 0 &&
      bondingCurve.value.maxUtil > 0 &&
      bondingCurve.value.maxUtil <= 1
  );

  return {
    bondingCurve,
    validCurve,
  };
}
