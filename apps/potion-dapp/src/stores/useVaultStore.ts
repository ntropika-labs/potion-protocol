import { defineStore, storeToRefs } from "pinia";
import { onMounted, readonly, watch } from "vue";

import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useUserDataStore } from "@/stores/useUserDataStore";

import type { Ref } from "vue";

const useVaultStore = (address: string, name: string) =>
  defineStore(`vault_${address}`, () => {
    const { walletAddress, infiniteApproval } = storeToRefs(useUserDataStore());

    const {
      fetchUserCollateralBalance,
      fetchUserCollateralAllowance,
      approve,
      userAllowance,
      fetchUserAllowanceLoading,
      approveLoading,
      approveTx,
      approveReceipt,
    } = useCollateralTokenContract(
      walletAddress,
      { address, name },
      infiniteApproval
    );
    const fetchUserData = async () => {
      if (walletAddress.value) {
        await Promise.all([
          fetchUserCollateralBalance(),
          fetchUserCollateralAllowance(),
        ]);
      }
    };

    onMounted(fetchUserData);

    watch(walletAddress, async (newWallet) => {
      if (newWallet) {
        await fetchUserData();
      } else {
        userAllowance.value = 0;
      }
    });

    return {
      approve,
      approveLoading: readonly<Ref<boolean>>(approveLoading),
      approveReceipt,
      approveTx,
      fetchUserData,
      fetchUserDataLoading: readonly<Ref<boolean>>(fetchUserAllowanceLoading),
      userAllowance: readonly<Ref<number>>(userAllowance),
    };
  });

export { useVaultStore };
