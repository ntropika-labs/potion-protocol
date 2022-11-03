import { computed, ref, unref } from "vue";
import { MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "@ethersproject/units";

import { ERC20Upgradeable__factory } from "@potion-protocol/core/typechain";

import { contractsAddresses } from "@/helpers/contracts";
import { useEthersContract } from "./useEthersContract";

import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import type { ERC20Upgradeable } from "@potion-protocol/core/typechain";
import type { MaybeRef } from "@vueuse/core";

export function useCollateralTokenContract(
  walletRef: MaybeRef<string | null>,
  targetContract: {
    address: string;
    name: string;
  },
  infiniteApproval: MaybeRef<boolean> = true
) {
  const { initContract } = useEthersContract();
  const { USDC } = contractsAddresses;

  const walletAddress = computed(() => unref(walletRef));

  const initContractSigner = () => {
    return initContract(
      true,
      false,
      ERC20Upgradeable__factory,
      USDC.address.toLowerCase()
    ) as ERC20Upgradeable;
  };

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      ERC20Upgradeable__factory,
      USDC.address.toLowerCase()
    ) as ERC20Upgradeable;
  };

  const userCollateralBalance = ref(0);
  const fetchUserCollateralBalanceLoading = ref(false);
  const fetchUserCollateralBalance = async () => {
    try {
      fetchUserCollateralBalanceLoading.value = true;
      const provider = initContractProvider();
      if (walletAddress.value) {
        const response = await provider.balanceOf(walletAddress.value);
        userCollateralBalance.value = parseFloat(formatUnits(response, 6));
        fetchUserCollateralBalanceLoading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      fetchUserCollateralBalanceLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot retrieve the user balance: ${error.message}`);
      } else {
        throw new Error("Cannot retrieve the user balance");
      }
    }
  };

  const userAllowance = ref(0);
  const fetchUserAllowanceLoading = ref(false);
  const fetchUserCollateralAllowance = async () => {
    fetchUserAllowanceLoading.value = true;
    try {
      if (walletAddress.value) {
        const provider = initContractProvider();
        const response = await provider.allowance(
          walletAddress.value,
          targetContract.address
        );
        console.info(
          `Address allowance for ${targetContract.address} is ${formatUnits(
            response,
            6
          )} - ${parseFloat(formatUnits(response, 6))}`
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
  const approve = async (amount: number) => {
    if (!walletAddress.value) {
      throw new Error("Connect your wallet first");
    }
    try {
      approveLoading.value = true;
      const amountToApprove = unref(infiniteApproval)
        ? MaxUint256
        : parseUnits(amount.toString(), 6);
      const contractSigner = initContractSigner();
      approveTx.value = await contractSigner.approve(
        targetContract.address,
        amountToApprove
      );
      approveReceipt.value = await approveTx.value.wait();
    } catch (error) {
      const message =
        error instanceof Error
          ? `Cannnot approve for ${targetContract.name}: ${error.message}`
          : `Cannnot approve for ${targetContract.name}`;
      throw new Error(message);
    } finally {
      approveLoading.value = false;
    }
  };

  return {
    fetchUserCollateralBalance,
    userCollateralBalance,
    fetchUserCollateralBalanceLoading,
    fetchUserCollateralAllowance,
    userAllowance,
    fetchUserAllowanceLoading,
    approve,
    approveLoading,
    approveTx,
    approveReceipt,
  };
}
