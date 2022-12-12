import { $fetch } from "ohmyfetch";
import { currencyFormatter } from "potion-ui";
import { computed, ref } from "vue";

const network = import.meta.env.VITE_ETHEREUM_NETWORK;
const endpoint = import.meta.env.VITE_COINGECKO_API_ENDPOINT;

interface CoinPricesResponse {
  [key: string]: { [key: string]: number };
}
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
      console.log("normal coingecko");
      loading.value = true;
      if (network === "mainnet" && address) {
        const response = await $fetch(
          endpoint.concat("/simple/token_price/ethereum"),
          {
            params: {
              contract_addresses: address,
              vs_currencies: currency,
            },
          }
        );
        price.value = response[address.toLowerCase()][currency.toLowerCase()];
      } else {
        price.value = 1300;
      }

      loading.value = false;
      success.value = true;
    } catch (error) {
      loading.value = false;
      throw new Error("Failed to fetch price");
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
