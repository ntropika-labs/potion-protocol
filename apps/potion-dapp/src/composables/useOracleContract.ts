import type { Oracle } from "potion-contracts/typechain";

import { Oracle__factory } from "potion-contracts/typechain";
import { formatUnits } from "@ethersproject/units";
import { useEthersContract } from "./useEthersContract";
import { useAddressBookContract } from "./useAddressBookContract";

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

  return {
    getPrice,
    getPrices,
  };
}
