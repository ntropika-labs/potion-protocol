import { computed } from "vue";
import type { RouteParams } from "vue-router";

export function useRoutePotionId(params: RouteParams) {
  const address = computed(() => {
    if (Array.isArray(params.id)) {
      return params.id[0];
    }
    return params.id;
  });

  const validAddress = computed(() => address.value.startsWith("0x"));

  const potionAddress = computed(() => {
    if (validAddress.value) {
      return address.value;
    }
    return "";
  });

  return {
    potionAddress,
  };
}
