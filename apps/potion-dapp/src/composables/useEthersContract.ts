import { useEthersProvider } from "./useEthersProvider";
import { useEthersSigner } from "./useEthersSigner";

export function useEthersContract() {
  const { initProvider } = useEthersProvider();
  const { getSigner } = useEthersSigner();
  const initContract = (
    needSigner = false,
    webSocket = false,
    typechainContractFactory: any,
    contractAddress: string
  ) => {
    try {
      if (webSocket && needSigner) {
        throw new Error(
          "cannot initialize the contract with a webSocket and a signer"
        );
      }
      if (webSocket) {
        return typechainContractFactory.connect(
          contractAddress,
          initProvider(true)
        );
      }
      if (needSigner) {
        return typechainContractFactory.connect(contractAddress, getSigner());
      }
      return typechainContractFactory.connect(
        contractAddress,
        initProvider(false)
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
    initContract,
  };
}
