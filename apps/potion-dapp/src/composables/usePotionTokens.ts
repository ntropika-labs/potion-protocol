import { computed, watch } from "vue";
import { usePoolsLiquidity } from "./useProtocolLiquidity";
import { useTokenList } from "./useTokenList";
import { useSelectableTokens } from "@/composables/useSelectableTokens";
import type { SelectableToken } from "dapp-types";

export function usePotionTokens() {
  const { availableTokens, tokenPricesMap, selectToken } =
    useSelectableTokens();
  const tokenSelected = computed(() =>
    availableTokens.value.find((t) => t.selected)
  );
  const tokenSelectedAddress = computed(
    () => tokenSelected?.value?.address ?? ""
  );
  const isTokenSelected = computed(
    () => tokenSelected?.value?.selected ?? false
  );
  const tokenSelectedApiPrice = computed(() =>
    tokenPricesMap.value.get(tokenSelectedAddress.value)
  );
  const price = computed(() => tokenSelectedApiPrice.value?.price ?? 0);
  const formattedPrice = computed(
    () => tokenSelectedApiPrice.value?.formattedPrice
  );

  const { underlyingsWithLiquidity } = usePoolsLiquidity();

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

  watch(underlyingsWithLiquidity, () => {
    availableTokens.value = availableTokens.value.concat(
      underlyingsWithLiquidity.value.map((address) =>
        tokenToSelectableToken(address)
      )
    );
  });

  return {
    availableTokens,
    selectToken,
    tokenSelected,
    tokenSelectedAddress,
    isTokenSelected,
    price,
    formattedPrice,
  };
}
