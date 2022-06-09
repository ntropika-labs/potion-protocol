import type { Oracle } from "potion-contracts/typechain";

import { contractsAddresses } from "@/helpers/contracts";
import { Oracle__factory } from "potion-contracts/typechain";
import { formatUnits } from "@ethersproject/units";
import { useEthersContract } from "./useEthersContract";

export function useOracleContract() {
  const { initContract } = useEthersContract();
  const { Oracle: OracleContract } = contractsAddresses;

  //Provider initialization

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      Oracle__factory,
      OracleContract.address.toLowerCase()
    ) as Oracle;
  };

  const getPrice = async (address: string) => {
    try {
      const oracleContract = initContractProvider();

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
      const oracleContract = initContractProvider();

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
