import { useRouteAddress } from "./useRouteAddress";
import type { RouteParams } from "vue-router";

export function useRouteTemplateId(params: RouteParams) {
  const { formattedAddress: templateId, validAddress: validTemplateId } =
    useRouteAddress(params.id);

  return {
    templateId,
    validTemplateId,
  };
}
