import { useCoinGecko } from "@/composables/useCoinGecko";
import { ref, computed } from "vue";

import type { ApiTokenPrice, SelectableToken, Token } from "dapp-types";

export function useSelectableTokens() {
  const availableTokens = ref<SelectableToken[]>([]);
  const tokenPricesMap = ref(new Map<string, ApiTokenPrice>());

  const unselectedTokens = computed(() =>
    availableTokens.value
      .filter((token) => !token.selected)
      .map((token) => token.symbol)
  );

  const toggleToken = async (address: string) => {
    const token = availableTokens.value.find((u) => u.address === address);
    if (token) {
      const tokenHasPrice = tokenPricesMap.value.get(token.address)?.success;

      token.selected = !token.selected;

      if (token.selected && !tokenHasPrice) {
        updateTokenPrice(token);
      }
    }
  };

  const updateTokenPrice = async (token: Token) => {
    const { success, price, formattedPrice, fetchTokenPrice } = useCoinGecko(
      undefined,
      token.address
    );
    try {
      await fetchTokenPrice();
    } catch (error) {
      console.error(
        "Error while fetching token price. Affected token: " + token.name
      );
    } finally {
      tokenPricesMap.value.set(token.address, {
        loading: false,
        price: price.value,
        formattedPrice: formattedPrice.value,
        success: success.value,
      });
    }
  };

  return {
    availableTokens,
    unselectedTokens,
    tokenPricesMap,
    toggleToken,
  };
}
