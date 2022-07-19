import type { ERC20Upgradeable } from "@potion-protocol/core/typechain";
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import { isRef, onMounted, ref, unref, watch } from "vue";

import { useTokenList } from "@/composables/useTokenList";
import { MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";
import { ERC20Upgradeable__factory } from "@potion-protocol/core/typechain";

import { useEthersContract } from "./useEthersContract";

import type { Ref } from "vue";
export function useErc20Contract(address: string | Ref<string>) {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();

  //Provider initialization
  const initContractProvider = () => {
    return initContract(
      true,
      false,
      ERC20Upgradeable__factory,
      unref(address).toLowerCase()
    ) as ERC20Upgradeable;
  };
  const initContractSigner = () => {
    return initContract(
      true,
      false,
      ERC20Upgradeable__factory,
      unref(address).toLowerCase()
    ) as ERC20Upgradeable;
  };

  const name = ref("");
  const symbol = ref("");
  const image = ref("");
  const decimals = ref(0);

  const getName = async () => {
    try {
      const contractProvider = initContractProvider();
      name.value = await contractProvider.name();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the name: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the name`);
      }
    }
  };
  const getSymbol = async () => {
    try {
      const contractProvider = initContractProvider();

      symbol.value = await contractProvider.symbol();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the symbol: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the symbol`);
      }
    }
  };
  const getDecimals = async () => {
    try {
      const contractProvider = initContractProvider();

      decimals.value = await contractProvider.decimals();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the decimals: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the decimals`);
      }
    }
  };

  onMounted(async () => {
    await Promise.all([getName(), getSymbol(), getDecimals()]);
    const { image: tokenImage } = useTokenList(unref(address));
    image.value = tokenImage;
  });

  if (isRef(address)) {
    watch(address, async () => {
      await Promise.all([getName(), getSymbol(), getDecimals()]);
      const { image: tokenImage } = useTokenList(unref(address));
      image.value = tokenImage;
    });
  }

  const useBalance = ref(0);
  const balance = ref(0);
  const getTokenBalance = async (self = true, address?: string) => {
    try {
      const contractProvider = initContractProvider();

      if (self === true && connectedWallet.value) {
        const result = await contractProvider.balanceOf(
          connectedWallet.value.accounts[0].address
        );
        useBalance.value = parseFloat(formatUnits(result, 8));
      } else if (self === false && address) {
        const result = await contractProvider.balanceOf(address);
        balance.value = parseFloat(formatUnits(result, 8));
      } else {
        throw new Error("Cannot fetch the balance");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get token balance: ${error.message}`);
      } else {
        throw new Error("Cannot get token balance");
      }
    }
  };

  const userAllowance = ref(0);
  const fetchUserAllowanceLoading = ref(false);

  const fetchUserAllowance = async (spender: string) => {
    fetchUserAllowanceLoading.value = true;
    try {
      const contractProvider = initContractProvider();

      if (connectedWallet.value) {
        const response = await contractProvider.allowance(
          connectedWallet.value.accounts[0].address,
          spender
        );
        console.info(
          `Address allowance for ${spender} is ${formatUnits(response, 6)}`
        );
        userAllowance.value = parseFloat(formatUnits(response, 6));
        fetchUserAllowanceLoading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      fetchUserAllowanceLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot retrieve the user allowance: ${error.message}`);
      } else {
        throw new Error("Cannot retrieve the user allowance");
      }
    }
  };

  const approveLoading = ref(false);
  const approveTx = ref<ContractTransaction | null>(null);
  const approveReceipt = ref<ContractReceipt | null>(null);
  const approveSpending = async (
    spender: string,
    amount: number,
    infinite = true
  ) => {
    approveLoading.value = true;
    try {
      if (connectedWallet.value) {
        const contractSigner = initContractSigner();
        approveTx.value = await contractSigner.approve(
          spender,
          infinite ? MaxUint256 : parseUnits(amount.toString(), 6)
        );
        approveReceipt.value = await approveTx.value.wait();
        approveLoading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      approveLoading.value = false;
      if (error instanceof Error) {
        throw new Error(
          `Cannot approve for the liquidity pool: ${error.message}`
        );
      } else {
        throw new Error("Cannot approve for the liquidity pool");
      }
    }
  };
  return {
    approveSpending,
    decimals,
    fetchUserAllowance,
    fetchUserAllowanceLoading,
    getDecimals,
    getName,
    getSymbol,
    getTokenBalance,
    image,
    name,
    symbol,
    userAllowance,
  };
}
