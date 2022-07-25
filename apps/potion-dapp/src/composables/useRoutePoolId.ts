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

  const validPoolId = computed(() => poolId.value >= 0);

  const id = computed(() => {
    if (validPoolId.value) {
      return `${params.lp}${hexValue(poolId.value)}`;
    }
    return "";
  });

  return {
    poolId,
    id,
    validPoolId,
  };
}
