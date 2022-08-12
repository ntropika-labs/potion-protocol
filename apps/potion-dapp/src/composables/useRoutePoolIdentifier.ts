import { computed } from "vue";
import type { RouteParams } from "vue-router";

export function useRoutePoolIdentifier(params: RouteParams) {
  const poolId = computed(() => {
    if (Array.isArray(params.id)) {
      return -1;
    }
    return parseInt(params.id);
  });

  const validPoolId = computed(() => poolId.value >= 0);

  return {
    poolId,
    validPoolId,
  };
}
