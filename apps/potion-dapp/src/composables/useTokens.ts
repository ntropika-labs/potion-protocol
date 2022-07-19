import { useAllCollateralizedProductsUnderlyingQuery } from "subgraph-queries/generated/urql";
import { useTokenList } from "@/composables/useTokenList";
import { useCoinGecko } from "@/composables/useCoinGecko";
import { ref, computed, watch } from "vue";

import type { ApiTokenPrice, SelectableToken, Token } from "dapp-types";

export function useTokens(collateral: string) {
  /*
   * Available tokens are fetched from the subgraph
   * Prices are loaded from an API
   */

  const availableTokens = ref<SelectableToken[]>([]);
  const tokenPricesMap = ref(new Map<string, ApiTokenPrice>());

  const unselectedTokens = computed(() =>
    availableTokens.value
      .filter((token) => !token.selected)
      .map((token) => token.symbol)
  );

  const { data: availableProducts } =
    useAllCollateralizedProductsUnderlyingQuery({
      variables: { collateral },
    });

  const tokenToSelectableToken = (
    address: string,
    decimals = 18,
    selected = false
  ): SelectableToken => {
    const { name, symbol, image } = useTokenList(address);
    return {
      address,
      decimals,
      name,
      symbol,
      image,
      selected,
    };
  };

  const toggleToken = (address: string) => {
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

  watch(availableProducts, () => {
    availableTokens.value =
      availableProducts?.value?.products?.map((product) =>
        tokenToSelectableToken(
          product.underlying.address,
          parseInt(product.underlying.decimals)
        )
      ) ?? [];
  });

  return {
    availableTokens,
    unselectedTokens,
    tokenPricesMap,
    toggleToken,
  };
}
