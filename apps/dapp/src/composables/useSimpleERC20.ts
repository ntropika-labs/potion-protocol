import { formatUnits, parseUnits } from "@ethersproject/units";

// import { providers, Signer } from "ethers";
import { SimpleERC20__factory } from "simple-erc20";
import { ref } from "vue";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useEthersSigner } from "@/composables/useEthersSigner";
import { useOnboard } from "./useOnboard";

export function useSimpleERC20(
  address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
) {
  const loading = ref(false);
  const ethersSigner = useEthersSigner();
  const ethersProvider = useEthersProvider();
  const onboard = useOnboard();
  const initSimpleERC20 = (needSigner = false, needWebSocket = false) => {
    try {
      if (needSigner && needWebSocket) {
        throw new Error(
          "Cannot initialize the SimpleERC20 with both WebSocket and Signer"
        );
      }
      if (needSigner) {
        const signer = ethersSigner.getSigner();
        return SimpleERC20__factory.connect(address, signer);
      }
      if (needWebSocket) {
        const provider = ethersProvider.initProvider(true);

        return SimpleERC20__factory.connect(address, provider);
      }
      const provider = ethersProvider.initProvider(false);
      return SimpleERC20__factory.connect(address, provider);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot initialize the ethers contract");
      }
    }
  };

  const totalSupply = ref("");
  const getTotalSupply = async () => {
    const contract = initSimpleERC20(false, false);
    try {
      loading.value = true;
      const result = await contract.totalSupply();
      totalSupply.value = formatUnits(result);
      loading.value = false;
    } catch (error) {
      loading.value = false;

      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("cannot get the total supply");
      }
    }
  };

  const userBalance = ref("");
  const getUserBalance = async () => {
    if (onboard.onboardState.value.wallets.length > 0) {
      const contract = initSimpleERC20(false, false);
      try {
        loading.value = true;
        const result = await contract.balanceOf(
          onboard.onboardState.value.wallets[0].accounts[0].address
        );
        userBalance.value = formatUnits(result);
        loading.value = false;
      } catch (error) {
        loading.value = false;

        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("cannot get the account balance");
        }
      }
    }
  };
  const accountBalance = ref("");
  const getAccountBalance = async (address: string) => {
    const contract = initSimpleERC20(false, false);
    try {
      loading.value = true;
      const result = await contract.balanceOf(address);
      accountBalance.value = formatUnits(result);
    } catch (error) {
      loading.value = false;
      if (error instanceof Error) {
        loading.value = false;
        throw new Error(error.message);
      } else {
        throw new Error("cannot get the total account balance");
      }
    }
  };

  const transfer = async (to: string, amount: number) => {
    const contract = initSimpleERC20(true, false);
    try {
      loading.value = true;
      const tx = await contract.transfer(to, parseUnits(amount.toString()));
      const receipt = await tx.wait();
      loading.value = false;
      return receipt;
    } catch (error) {
      loading.value = false;
      if (error instanceof Error) {
        loading.value = false;
        throw new Error(error.message);
      } else {
        throw new Error("cannot transfer the funds");
      }
    }
  };
  return {
    loading,
    initSimpleERC20,
    getTotalSupply,
    getUserBalance,
    getAccountBalance,
    transfer,
    totalSupply,
    userBalance,
    accountBalance,
  };
}
