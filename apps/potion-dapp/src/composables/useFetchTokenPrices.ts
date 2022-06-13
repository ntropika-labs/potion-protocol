import { $fetch } from "ohmyfetch";
import { computed, ref } from "vue";

const network = import.meta.env.VITE_ETHEREUM_NETWORK;

export function useFetchTokenPrices(address: string, currency = "usd") {
  const endpoint = import.meta.env.VITE_COINGECKO_API_ENDPOINT;
  const success = ref(false);
  const loading = ref(false);
  const price = ref(0);
  const formattedPrice = computed(() => {
    return new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(price.value);
  });

  const fetchPrice = async () => {
    try {
      loading.value = true;
      if (network === "mainnet") {
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
    fetchPrice,
  };
}
