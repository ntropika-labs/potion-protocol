import { computed, ref } from "vue";

import { useCoinGecko } from "@coingecko-composable";

import type { ApiTokenPrice, SelectableToken } from "dapp-types";

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
      token.selected = !token.selected;
      await updateMapPrice(token);
    }
  };

  const selectToken = async (address: string) => {
    console.log(address, availableTokens.value);
    const promises = availableTokens.value.map(
      async (token: SelectableToken) => {
        token.selected = address === token.address;
        await updateMapPrice(token);
      }
    );
    await Promise.allSettled(promises);
  };

  const updateMapPrice = async (token: SelectableToken) => {
    if (token.selected) {
      const hasPrice = tokenPricesMap.value.get(token.address)?.success;
      if (!hasPrice) {
        await updateTokenPrice(token);
      }
    }
  };

  const updateTokenPrice = async (token: SelectableToken) => {
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
    selectToken,
  };
}
