import { ref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { Oracle__factory } from "@potion-protocol/core/typechain";

import { useAddressBookContract } from "./useAddressBookContract";
import { useEthersContract } from "./useEthersContract";

import type { Oracle } from "@potion-protocol/core/typechain";

export function useOracleContract() {
  const { initContract } = useEthersContract();
  const { getOracle } = useAddressBookContract();

  //Provider initialization

  const initContractProvider = async () => {
    return initContract(
      false,
      false,
      Oracle__factory,
      await getOracle()
    ) as Oracle;
  };

  const getPrice = async (address: string) => {
    try {
      const oracleContract = await initContractProvider();

      const price = await oracleContract.getPrice(address);
      return formatUnits(price, 8);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get price: ${error.message}`);
      } else {
        throw new Error("Cannot get price");
      }
    }
  };

  const getPrices = async (addresses: string[]) => {
    try {
      const oracleContract = await initContractProvider();

      const priceMap = new Map<string, string>();

      const promises = addresses.map(async (address) => {
        const price = await oracleContract.getPrice(address);
        priceMap.set(address, formatUnits(price, 8));
      });
      await Promise.allSettled(promises);

      return priceMap;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get prices: ${error.message}`);
      } else {
        throw new Error("Cannot get prices");
      }
    }
  };

  const polledPrice = ref();
  const pollingTimer = ref<NodeJS.Timer>();

  const startPolling = async (address: string) => {
    try {
      const oracleContract = await initContractProvider();
      const loadPrice = async () => {
        const price = await oracleContract.getPrice(address);
        const newPrice = formatUnits(price, 8);
        polledPrice.value = newPrice;
      };

      await loadPrice();
      pollingTimer.value = setInterval(loadPrice, 15000);
    } catch (error) {
      polledPrice.value = undefined;
      if (error instanceof Error) {
        throw new Error(`Cannot get price: ${error.message}`);
      } else {
        throw new Error("Cannot get price");
      }
    }
  };

  const stopPolling = () => {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value);
      pollingTimer.value = undefined;
    }
  };

  return {
    getPrice,
    getPrices,
    polledPrice,
    startPolling,
    stopPolling,
  };
}
