import { computed } from "vue";
import { hexValue } from "@ethersproject/bytes";
import { isValidAddress, formatAddress } from "@/helpers/addresses";
import type { RouteParams } from "vue-router";

export function useRoutePoolId(params: RouteParams) {
  const poolId = computed(() => {
    if (Array.isArray(params.id)) {
      return -1;
    }
    return parseInt(params.id);
  });

  const lp = computed(() => {
    if (Array.isArray(params.lp)) {
      return "";
    }
    return params?.lp ? formatAddress(params.lp) : "";
  });

  const validPoolId = computed(() => poolId.value >= 0);
  const validLp = computed(() => isValidAddress(lp.value));
  const poolLp = computed(() => (validLp.value ? lp.value : ""));

  const id = computed(() => {
    if (validPoolId.value && validLp.value) {
      return `${poolLp.value}${hexValue(poolId.value)}`;
    }
    return "";
  });

  return {
    poolId,
    poolLp,
    id,
    validPoolId,
    validLp,
  };
}
