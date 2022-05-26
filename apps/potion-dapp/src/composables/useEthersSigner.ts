import { Wallet } from "ethers";
import { ref } from "vue";

import { useOnboard } from "@/composables/useOnboard";
import { rpcUrl } from "@/helpers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";

const mode = import.meta.env.MODE;

import type { JsonRpcSigner } from "@ethersproject/providers";
export function useEthersSigner() {
  const onboard = useOnboard();
  const address = ref<string>("");
  const ens = ref<string | null>(null);
  const ethBalance = ref<string>("");
  const loading = ref(false);
  const mnemonic =
    "test test test test test test test test test test test junk";

  const getSigner = (): JsonRpcSigner | Wallet => {
    try {
      loading.value = true;
      if (mode === "test") {
        const wallet = Wallet.fromMnemonic(mnemonic);
        const provider = new JsonRpcProvider(rpcUrl);
        return wallet.connect(provider);
      }
      if (onboard.connectedWallet.value) {
        const web3Provider = new Web3Provider(
          onboard.connectedWallet.value.provider
        );
        const signer = web3Provider.getSigner(0);
        loading.value = false;
        return signer;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot initialize the ethers signer");
      }
    }
  };
  const fetchSignerData = async () => {
    const signer = getSigner();
    try {
      address.value = await signer.getAddress();
      ens.value = await signer.provider.lookupAddress(address.value);
      ethBalance.value = formatUnits(
        await signer.provider.getBalance(address.value)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot fetch the signer data");
      }
    }
  };

  return {
    getSigner,
    fetchSignerData,
    address,
    ens,
    ethBalance,
  };
}
