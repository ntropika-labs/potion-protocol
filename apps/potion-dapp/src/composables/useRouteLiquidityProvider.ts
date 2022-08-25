import { useRouteAddress } from "./useRouteAddress";
import type { RouteParams } from "vue-router";

export function useRouteLiquidityProvider(params: RouteParams) {
  const { formattedAddress: poolLp, validAddress: validLp } = useRouteAddress(
    params.lp
  );

  return {
    poolLp,
    validLp,
  };
}
