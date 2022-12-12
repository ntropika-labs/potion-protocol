import { useRouteAddress } from "./useRouteAddress";
import type { RouteParams } from "vue-router";

export function useRoutePotionId(params: RouteParams) {
  const { formattedAddress: potionAddress, validAddress } = useRouteAddress(
    params.id
  );

  return {
    potionAddress,
    validAddress,
  };
}
