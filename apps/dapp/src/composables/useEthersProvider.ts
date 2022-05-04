import { ref } from "vue";

import { rpcUrl, webSocketUrl } from "@/helpers";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";

export function useEthersProvider() {
  const block = ref();
  const initProvider = (isWebSocket: boolean) => {
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
      const provider = initProvider(false);
      block.value = (await provider.getBlock(blocktag)).timestamp;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot get the block");
      }
    }
  };

  return {
    initProvider,
    getBlock,
    block,
  };
}
