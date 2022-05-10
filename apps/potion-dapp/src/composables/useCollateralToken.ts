import type { PotionTestUSD } from "potion-contracts/typechain";
import { PotionTestUSD__factory } from "potion-contracts/typechain";
import { computed, ref, shallowRef, watch } from "vue";

import { contractsAddresses } from "@/helpers/contracts";
import { formatUnits, parseUnits } from "@ethersproject/units";

import { useEthersContract } from "./useEthersContract";
import { useOnboard } from "./useOnboard";

export function useCollateralToken() {
  const { initContract } = useEthersContract();
  const { PotionTestUSD, PotionLiquidityPool } = contractsAddresses;
  const { connectedWallet } = useOnboard();
  const walletConnected = computed(() => {
    return connectedWallet.value !== null;
  });
  const loading = ref(false);
  const contractSigner = shallowRef<PotionTestUSD>();

  watch(connectedWallet, (connectedWallet) => {
    console.log(connectedWallet);
    if (connectedWallet && connectedWallet.accounts[0].address) {
      contractSigner.value = initContract(
        true,
        false,
        PotionTestUSD__factory,
        PotionTestUSD.address.toLowerCase()
      ) as PotionTestUSD;
    }
  });

  const contractProvider = initContract(
    false,
    false,
    PotionTestUSD__factory,
    PotionTestUSD.address.toLowerCase()
  ) as PotionTestUSD;

  const userCollateralBalance = ref("");
  const fetchUserCollateralBalance = async () => {
    try {
      loading.value = true;
      if (walletConnected.value) {
        const response = await contractProvider.balanceOf(
          //@ts-expect-error - we know that the wallet is connected by the computed
          connectedWallet.value.accounts[0].address
        );
        userCollateralBalance.value = formatUnits(response, 6);
        loading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      loading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot retrieve the user balance: ${error.message}`);
      } else {
        throw new Error("Cannot retrieve the user balance");
      }
    }
  };

  const userAllowance = ref("");
  const fetchUserCollateralAllowance = async () => {
    loading.value = true;
    try {
      if (walletConnected.value) {
        const response = await contractProvider.allowance(
          //@ts-expect-error - we know that the wallet is connected by the computed
          connectedWallet.value.accounts[0].address,
          PotionLiquidityPool.address
        );
        userAllowance.value = formatUnits(response, 6);
        loading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      loading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot retrieve the user allowance: ${error.message}`);
      } else {
        throw new Error("Cannot retrieve the user allowance");
      }
    }
  };

  const approveForPotionLiquidityPool = async (amount: number) => {
    loading.value = true;
    try {
      if (walletConnected.value) {
        //@ts-expect-error - we know that the wallet is connected by the computed value
        const tx = await contractSigner.value.approve(
          PotionLiquidityPool.address,
          parseUnits(amount.toString(), 6)
        );
        const receipt = await tx.wait();
        console.log(receipt);
        loading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      loading.value = false;
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
    loading,
    userCollateralBalance,
    fetchUserCollateralBalance,
    userAllowance,
    fetchUserCollateralAllowance,
    approveForPotionLiquidityPool,
  };
}
