import { useAllCollateralizedProductsUnderlyingQuery } from "subgraph-queries/generated/urql";
import { useTokenList } from "@/composables/useTokenList";
import { watch } from "vue";
import { useSelectableTokens } from "@/composables/useSelectableTokens";

import type { SelectableToken } from "dapp-types";

export function useTokens(collateral: string) {
  /*
   * Available tokens are fetched from the subgraph
   * Prices are loaded from an API
   */

  const { availableTokens, unselectedTokens, tokenPricesMap, toggleToken } =
    useSelectableTokens();

  const variables = { collateral };

  const { data } = useAllCollateralizedProductsUnderlyingQuery({ variables });

  const getSelectableToken = (
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

  watch(data, () => {
    availableTokens.value =
      data?.value?.products?.map(({ underlying }) =>
        getSelectableToken(underlying.address, parseInt(underlying.decimals))
      ) ?? [];
  });

  return {
    availableTokens,
    unselectedTokens,
    tokenPricesMap,
    toggleToken,
  };
}
