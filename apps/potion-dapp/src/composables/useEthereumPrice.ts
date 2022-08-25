import { computed, onMounted } from "vue";
import { useCoinGecko } from "./useCoinGecko";

export function useEthereumPrice() {
  const { coinsPrices, fetchCoinsPrices } = useCoinGecko(["ethereum"]);
  const ethPrice = computed(() => {
    if (coinsPrices.value && coinsPrices.value.ethereum.usd) {
      return coinsPrices.value.ethereum.usd;
    }
    return 0;
  });

  onMounted(async () => {
    await fetchCoinsPrices();
  });

  return {
    ethPrice,
  };
}
