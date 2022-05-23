import { $fetch } from "ohmyfetch";
import { computed, ref } from "vue";

const endpoint = "https://api.coingecko.com/api/v3/simple/token_price/ethereum";
export function useFetchTokenPrices(address: string, currency = "usd") {
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
      const response = await $fetch(endpoint, {
        params: {
          contract_addresses: address,
          vs_currencies: currency,
        },
      });
      console.log(response);
      price.value = response[address.toLowerCase()][currency.toLowerCase()];
      loading.value = false;
      return true;
    } catch (error) {
      loading.value = false;
      throw new Error("Failed to fetch price");
    }
  };
  return {
    loading,
    price,
    formattedPrice,
    fetchPrice,
  };
}
