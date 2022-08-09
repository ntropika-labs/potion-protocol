import { computed, onMounted, ref } from "vue";

import { toOptionToken } from "@/helpers/tokens";
import { useCoinGecko } from "@/composables/useCoinGecko";

import type { ComputedRef, Ref } from "vue";
import type { Criteria, OptionToken } from "dapp-types";

export function useCriteriasTokens(
  criterias: Ref<Criteria[]> | ComputedRef<Criteria[]>
) {
  const tokenPricesMap = ref<Map<string, string>>(new Map());
  const assets = computed<OptionToken[]>(() =>
    criterias.value.map(({ token, maxDuration, maxStrike }) =>
      toOptionToken(token, maxDuration.toString(), maxStrike.toString())
    )
  );

  const fetchAssetsPrice = async () => {
    const prices = new Map();
    const addresses = criterias.value.map(({ token }) => token.address);

    try {
      const promises = addresses.map(async (address) => {
        const { fetchTokenPrice, price } = useCoinGecko(undefined, address);
        await fetchTokenPrice();
        prices.set(address, price.value);
      });
      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Error while fetching token prices.");
    }

    return prices;
  };

  const tokens = computed(
    () => criterias.value?.map(({ token }) => token) ?? []
  );

  onMounted(async () => {
    tokenPricesMap.value = await fetchAssetsPrice();
  });

  return {
    tokenPricesMap,
    assets,
    tokens,
  };
}
