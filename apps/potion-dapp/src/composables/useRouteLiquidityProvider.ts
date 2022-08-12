import { computed } from "vue";
import { isValidAddress, formatAddress } from "@/helpers/addresses";
import type { RouteParams } from "vue-router";

export function useRouteLiquidityProvider(params: RouteParams) {
  const lp = computed(() => {
    if (Array.isArray(params.lp)) {
      return "";
    }
    return params?.lp ? formatAddress(params.lp) : "";
  });

  const validLp = computed(() => isValidAddress(lp.value));
  const poolLp = computed(() => (validLp.value ? lp.value : ""));

  return {
    poolLp,
    validLp,
  };
}
