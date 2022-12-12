import { $fetch } from "ohmyfetch";
import { currencyFormatter } from "potion-ui";
import { computed, ref } from "vue";

import { useOracleContract } from "./useOracleContract";

interface CoinPricesResponse {
  [key: string]: { [key: string]: number };
}
const endpoint = import.meta.env.VITE_COINGECKO_API_ENDPOINT;

export function useCoinGecko(
  coins?: string[],
  address?: string,
  currency = "usd"
) {
  const success = ref(false);
  const loading = ref(false);
  const price = ref(0);
  const formattedPrice = computed(() => {
    return currencyFormatter(price.value, currency === "usd" ? "$" : currency);
  });

  const coinsPrices = ref<CoinPricesResponse>();
  const coinsPricesLoading = ref(false);
  const fetchCoinsPrices = async () => {
    try {
      coinsPricesLoading.value = true;
      if (coins) {
        const response = await $fetch<CoinPricesResponse>(
          endpoint.concat("/simple/price"),
          {
            params: {
              ids: coins.toString(),
              vs_currencies: currency,
            },
          }
        );
        coinsPrices.value = response;
        coinsPricesLoading.value = false;
      }
    } catch (error) {
      coinsPricesLoading.value = false;
      if (error instanceof Error) {
        throw new Error("Failed to fetch price: " + error.message);
      } else {
        throw new Error("Failed to fetch price");
      }
    }
  };

  const fetchTokenPrice = async () => {
    try {
      console.info("fetchTokenPrice Mocked, using the oracle");
      const { getPrice } = useOracleContract();
      if (address) {
        const response = await getPrice(address);
        price.value = parseFloat(response);
      }
      success.value = true;
    } catch (error) {
      success.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot get price: ${error.message}`);
      } else {
        throw new Error("Cannot get price");
      }
    }
  };

  return {
    loading,
    success,
    price,
    formattedPrice,
    fetchTokenPrice,
    coinsPrices,
    coinsPricesLoading,
    fetchCoinsPrices,
  };
}
