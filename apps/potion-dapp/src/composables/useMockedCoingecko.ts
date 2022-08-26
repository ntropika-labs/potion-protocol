import type { Oracle } from "potion-contracts/typechain";
import { $fetch } from "ohmyfetch";
import { Oracle__factory } from "potion-contracts/typechain";
import { currencyFormatter } from "potion-ui";
import { computed, ref } from "vue";

import { formatUnits } from "@ethersproject/units";

import { useAddressBookContract } from "./useAddressBookContract";
import { useEthersContract } from "./useEthersContract";

interface CoinPricesResponse {
  [key: string]: { [key: string]: number };
}
const endpoint = import.meta.env.VITE_COINGECKO_API_ENDPOINT;

export function useCoinGecko(
  coins?: string[],
  address?: string,
  currency = "usd"
) {
  const { initContract } = useEthersContract();
  const { getOracle } = useAddressBookContract();

  const success = ref(false);
  const loading = ref(false);
  const price = ref(0);
  const formattedPrice = computed(() => {
    return currencyFormatter(price.value, currency === "usd" ? "$" : currency);
  });

  //Provider initialization

  const initContractProvider = async () => {
    return initContract(
      false,
      false,
      Oracle__factory,
      await getOracle()
    ) as Oracle;
  };

  const coinsPrices = ref<CoinPricesResponse>();
  const coinsPricesLoading = ref(false);
  const fetchCoinsPrices = async () => {
    console.info("fetchCoinsPriced Mocked");
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
      console.info("fetchTokenPrice Mocked");

      const oracleContract = await initContractProvider();
      console.log(address);
      if (address) {
        // console.log("here");
        const response = await oracleContract.getPrice(address);
        price.value = parseFloat(formatUnits(response, 8));
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
