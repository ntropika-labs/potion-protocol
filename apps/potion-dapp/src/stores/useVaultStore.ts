import { defineStore, storeToRefs } from "pinia";
import { onMounted, readonly, watch } from "vue";

import { useErc20Contract } from "@/composables/useErc20Contract";
import { useUserDataStore } from "@/stores/useUserDataStore";

import type { Ref } from "vue";
import type { MaybeRef } from "@vueuse/core";

const useVaultStore = (
  address: string,
  name: string,
  underlyingAddress: MaybeRef<string>
) =>
  defineStore(`vault_${address}_${name}`, () => {
    const { walletAddress, infiniteApproval } = storeToRefs(useUserDataStore());

    const {
      approveSpending,
      userAllowance,
      fetchUserAllowance,
      fetchUserAllowanceLoading,
      approveLoading,
      approveTx,
      approveReceipt,
    } = useErc20Contract(underlyingAddress);

    const approve = (amount: number) =>
      approveSpending(address, infiniteApproval.value, amount);
    const fetchUserData = () => fetchUserAllowance(address);

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
