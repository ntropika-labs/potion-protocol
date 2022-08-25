import { computed } from "vue";
import { isValidAddress, formatAddress } from "@/helpers/addresses";

export function useRouteAddress(address?: string | string[]) {
  const parsedAddress = computed(() => {
    if (Array.isArray(address)) {
      return "";
    }
    return address ? formatAddress(address) : "";
  });

  const validAddress = computed(() => isValidAddress(parsedAddress.value));
  const formattedAddress = computed(() =>
    validAddress.value ? parsedAddress.value : ""
  );

  return {
    formattedAddress,
    validAddress,
  };
}
