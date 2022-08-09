import { computed } from "vue";
import { isValidAddress, formatAddress } from "@/helpers/addresses";
import type { RouteParams } from "vue-router";

export function useRouteTemplateId(params: RouteParams) {
  const id = computed(() => {
    if (Array.isArray(params.id)) {
      return "";
    }
    return params?.id ? formatAddress(params.id) : "";
  });

  const validTemplateId = computed(() => isValidAddress(id.value));
  const templateId = computed(() => (validTemplateId.value ? id.value : ""));

  return {
    templateId,
    validTemplateId,
  };
}
