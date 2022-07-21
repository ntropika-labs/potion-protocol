import { computed, ref } from "vue";

import { ethereumNetwork, rpcUrl, webSocketUrl } from "@/helpers";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";

import type { Block } from "@ethersproject/providers";

export function useEthersProvider() {
  const loading = ref(false);
  const block = ref<Block>();
  const blockTimestamp = computed<number>(() => block?.value?.timestamp ?? 0);

  const initProvider = (isWebSocket: boolean): JsonRpcProvider => {
    try {
      if (isWebSocket) {
        return new WebSocketProvider(webSocketUrl);
      }
      return new JsonRpcProvider(rpcUrl);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot initialize the ethers provider");
      }
    }
  };
  const getBlock = async (blocktag: string) => {
    try {
      loading.value = true;
      const provider = initProvider(false);
      block.value = await provider.getBlock(blocktag);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot get the block");
      }
    } finally {
      loading.value = false;
    }
  };
  const lookupAddress = async (address: string) => {
    try {
      loading.value = true;
      const provider = initProvider(false);
      if (ethereumNetwork === "mainnet") {
        const ens = await provider.lookupAddress(address);
        return ens ?? address;
      }
      return address;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot get the ens for this address");
      }
    }
  };

  return {
    lookupAddress,
    initProvider,
    getBlock,
    block,
    blockTimestamp,
    loading,
  };
}
