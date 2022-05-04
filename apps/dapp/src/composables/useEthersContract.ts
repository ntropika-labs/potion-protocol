import type {
  ExternalProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";
import type { BaseContract } from "@ethersproject/contracts";
import { shallowRef } from "vue";

export function useEthersContract() {
  const contractInstance = shallowRef<BaseContract | null>(null);
  const initContract = (
    signerOrProvider: JsonRpcSigner | ExternalProvider | Web3Provider,
    contractFactory: any,
    contractAddress: string
  ) => {
    try {
      contractInstance.value = contractFactory.connect(
        contractAddress,
        signerOrProvider
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot initialize the ethers contract");
      }
    }
  };
  return {
    contractInstance,
    initContract,
  };
}
