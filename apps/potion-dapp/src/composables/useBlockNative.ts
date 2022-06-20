import { $fetch } from "ohmyfetch";
import { ref } from "vue";

import type { BlocknativeGasApiReturn } from "@/types";

const apiKey = import.meta.env.VITE_BLOCKNATIVE_API_KEY;
const baseUrl = "https://api.blocknative.com";

export function useBlockNative() {
  const gasPrice = ref(0);
  const gasPriceLoading = ref(false);
  const getGas = async () => {
    try {
      gasPriceLoading.value = true;
      const response = await $fetch<BlocknativeGasApiReturn>(
        baseUrl.concat("/gasprices/blockprices"),
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      gasPrice.value = response.blockPrices[0].estimatedPrices[0].maxFeePerGas;
      gasPriceLoading.value = false;
    } catch (error) {
      gasPriceLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Failed to get gas price: ${error.message}`);
      } else {
        throw new Error(`Failed to get gas price`);
      }
    }
  };

  return {
    gasPrice,
    gasPriceLoading,
    getGas,
  };
}
