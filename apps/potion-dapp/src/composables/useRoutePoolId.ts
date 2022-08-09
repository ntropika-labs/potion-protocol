import { computed } from "vue";
import { hexValue } from "@ethersproject/bytes";
import type { RouteParams } from "vue-router";

export function useRoutePoolId(params: RouteParams) {
  const poolId = computed(() => {
    if (Array.isArray(params.id)) {
      return -1;
    }
    return parseInt(params.id);
  });

  const poolLp = computed(() => {
    if (Array.isArray(params.lp)) {
      return "";
    }
    return params?.lp?.toLowerCase() ?? "";
  });

  const validPoolId = computed(() => poolId.value >= 0);
  const validLp = computed(() => poolLp.value.startsWith("0x"));

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
