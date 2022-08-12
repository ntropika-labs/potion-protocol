import { computed } from "vue";
import { isValidAddress, formatAddress } from "@/helpers/addresses";
import type { RouteParams } from "vue-router";

export function useRoutePotionId(params: RouteParams) {
  const address = computed(() => {
    if (Array.isArray(params.id)) {
      return "";
    }
    return params?.id ? formatAddress(params.id) : "";
  });

  const validAddress = computed<boolean>(() => isValidAddress(address.value));
  const potionAddress = computed<string>(() =>
    validAddress.value ? address.value : ""
  );

  return {
    validAddress,
    potionAddress,
  };
}
