import { computed } from "vue";
import { hexValue } from "@ethersproject/bytes";
import { useRouteLiquidityProvider } from "./useRouteLiquidityProvider";
import { useRoutePoolIdentifier } from "./useRoutePoolIdentifier";
import type { RouteParams } from "vue-router";

export function useRoutePoolId(params: RouteParams) {
  const { validLp, poolLp } = useRouteLiquidityProvider(params);
  const { validPoolId, poolId } = useRoutePoolIdentifier(params);

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
