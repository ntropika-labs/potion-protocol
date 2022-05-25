import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import type { PotionTestUSD } from "potion-contracts/typechain";
import { PotionTestUSD__factory } from "potion-contracts/typechain";
import { ref } from "vue";

import { contractsAddresses } from "@/helpers/contracts";
import { MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "@ethersproject/units";

import { useEthersContract } from "./useEthersContract";
import { useOnboard } from "./useOnboard";

export function useCollateralTokenContract() {
  const { initContract } = useEthersContract();
  const { PotionTestUSD, PotionLiquidityPool } = contractsAddresses;
  const { connectedWallet } = useOnboard();

  const initContractSigner = () => {
    return initContract(
      true,
      false,
      PotionTestUSD__factory,
      PotionTestUSD.address.toLowerCase()
    ) as PotionTestUSD;
  };

  const contractProvider = initContract(
    false,
    false,
    PotionTestUSD__factory,
    PotionTestUSD.address.toLowerCase()
  ) as PotionTestUSD;

  const userCollateralBalance = ref(0);
  const fetchUserCollateralBalanceLoading = ref(false);
  const fetchUserCollateralBalance = async () => {
    try {
      fetchUserCollateralBalanceLoading.value = true;
      if (connectedWallet.value) {
        const response = await contractProvider.balanceOf(
          connectedWallet.value.accounts[0].address
        );
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
      if (connectedWallet.value) {
        const response = await contractProvider.allowance(
          connectedWallet.value.accounts[0].address,
          PotionLiquidityPool.address
        );
        console.info(
          `Address allowance for ${
            PotionLiquidityPool.address
          } is ${formatUnits(response, 6)}`
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
  const approveForPotionLiquidityPool = async (
    amount: number,
    infinite = true
  ) => {
    approveLoading.value = true;
    try {
      if (connectedWallet.value) {
        const contractSigner = initContractSigner();

        approveTx.value = await contractSigner.approve(
          PotionLiquidityPool.address,
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
    fetchUserCollateralBalance,
    userCollateralBalance,
    fetchUserCollateralBalanceLoading,
    fetchUserCollateralAllowance,
    userAllowance,
    fetchUserAllowanceLoading,
    approveForPotionLiquidityPool,
    approveLoading,
    approveTx,
    approveReceipt,
  };
}
