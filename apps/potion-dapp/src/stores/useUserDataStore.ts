import { defineStore } from "pinia";
import { computed, onMounted, readonly, ref, watch, type Ref } from "vue";
import type { ConnectedChain } from "@web3-onboard/core";
import { contractsAddresses } from "@/helpers/contracts";

import { useOnboard } from "@onboard-composable";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";

export const useUserDataStore = defineStore("user_data", () => {
  const { PotionLiquidityPool } = contractsAddresses;
  const { connectedWallet, connectedChain } = useOnboard();
  const walletAddress = computed(
    () => connectedWallet.value?.accounts[0].address ?? ""
  );

  const infiniteApproval = ref(true);

  const {
    fetchUserCollateralBalance,
    fetchUserCollateralAllowance,
    approve,
    userAllowance,
    userCollateralBalance,
    fetchUserCollateralBalanceLoading,
    fetchUserAllowanceLoading,
    approveLoading,
    approveTx,
    approveReceipt,
  } = useCollateralTokenContract(
    walletAddress,
    { address: PotionLiquidityPool.address, name: "PotionLiquidityPool" },
    infiniteApproval
  );

  const userDataLoading = computed(
    () =>
      fetchUserAllowanceLoading.value || fetchUserCollateralBalanceLoading.value
  );
  const fetchUserData = async () => {
    if (connectedWallet.value) {
      await fetchUserCollateralBalance();
      await fetchUserCollateralAllowance();
    }
  };

  const setInfiniteApproval = (state: boolean) => {
    infiniteApproval.value = state;
  };

  onMounted(async () => await fetchUserData());

  watch(walletAddress, async (newAWallet) => {
    if (newAWallet) {
      await fetchUserData();
    } else {
      userCollateralBalance.value = 0;
      userAllowance.value = 0;
    }
  });

  return {
    walletAddress: readonly<Ref<string>>(walletAddress),
    connectedChain: readonly<Ref<ConnectedChain | null>>(connectedChain),
    userAllowance: readonly<Ref<number>>(userAllowance),
    userCollateralBalance: readonly<Ref<number>>(userCollateralBalance),
    approveLoading: readonly<Ref<boolean>>(approveLoading),
    approveTx,
    approveReceipt,
    infiniteApproval: readonly<Ref<boolean>>(infiniteApproval),
    fetchUserDataLoading: readonly<Ref<boolean>>(userDataLoading),
    fetchUserData,
    approveForPotionLiquidityPool: approve,
    setInfiniteApproval,
  };
});
