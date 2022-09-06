import { useRouteAddress } from "./useRouteAddress";
import type { RouteParams } from "vue-router";

export function useRouteVaultId(params: RouteParams) {
  const { formattedAddress: vaultAddress, validAddress } = useRouteAddress(
    params.id
  );

  return {
    vaultAddress,
    validAddress,
  };
}
