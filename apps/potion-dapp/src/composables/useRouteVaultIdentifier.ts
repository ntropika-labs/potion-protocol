import type { RouteParams } from "vue-router";

import { useRouteAddress } from "./useRouteAddress";

export function useRouteVaultIdentifier(params: RouteParams) {
  const { formattedAddress: vaultId, validAddress: validVaultId } =
    useRouteAddress(params.id);

  return {
    vaultId,
    validVaultId,
  };
}
