import type { Oracle } from "@potion-protocol/core/typechain";
import { Oracle__factory } from "@potion-protocol/core/typechain";
import { formatUnits } from "@ethersproject/units";
import { useAddressBookContract } from "./useAddressBookContract";
import { useEthersContract } from "./useEthersContract";
import { onMounted, onUnmounted } from "vue";
import { useContractEvents } from "./useContractEvents";
import { BigNumber } from "ethers";

export function useOracleContract(useEventStream = false) {
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
      console.log("price from oracle", price);
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

  let removeEventListenersCallback: any;
  const setupEventListeners = async () => {
    const provider = await initContractProvider();
    const startingBlock = await provider.provider.getBlockNumber();
    const { addEventListener, removeEventListeners } = useContractEvents(
      provider,
      startingBlock,
      true
    );

    // Check provider.filters for event names
    addEventListener(
      provider.filters["StablePriceUpdated(address,uint256)"](),
      (event, ...params: [string, BigNumber]) => {
        console.log("StablePriceUpdated(address,uint256)", event, params);
      }
    );

    addEventListener(
      provider.filters["ExpiryPriceUpdated(address,uint256,uint256,uint256)"](),
      (event, ...params: [string, BigNumber, BigNumber, BigNumber]) => {
        console.log(
          "ExpiryPriceUpdated(address,uint256,uint256,uint256)",
          event,
          params
        );
      }
    );

    removeEventListenersCallback = removeEventListeners;
    // console.log("EVENT LISTENERS", getEventListeners());
  };

  onMounted(async () => {
    if (useEventStream) {
      await setupEventListeners();
    }
  });

  onUnmounted(() => {
    if (removeEventListenersCallback) removeEventListenersCallback();
  });

  return {
    getPrice,
    getPrices,
  };
}
