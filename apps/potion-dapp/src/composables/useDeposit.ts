import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";

import { deepUnref } from "@/helpers/vue";

import type { MaybeRef } from "@vueuse/core";
import { useUserDataStore } from "@/stores/useUserDataStore";
import { storeToRefs } from "pinia";

export function useDeposit(id: MaybeRef<number | null>) {
  const amount = ref(100);

  const { t } = useI18n();
  const userStore = useUserDataStore();
  const { userCollateralBalance, userAllowance, fetchUserDataLoading } =
    storeToRefs(userStore);

  const {
    depositTx,
    depositReceipt,
    deposit: contractDeposit,
    depositLoading,
  } = usePotionLiquidityPoolContract();

  const isLoading = computed(
    () => depositLoading.value || fetchUserDataLoading.value
  );

  const canDeposit = computed(
    () => amount.value > 0 && amount.value <= deepUnref(userCollateralBalance)
  );

  const amountNeededToApprove = computed(() => {
    const allowance = deepUnref(userAllowance);
    if (allowance === 0) {
      return amount.value;
    }
    if (amount.value > allowance) {
      return parseFloat((amount.value - allowance).toPrecision(6));
    }
    return 0;
  });
  const deposit = async () => {
    const poolId = deepUnref(id);
    if (canDeposit.value) {
      if (amountNeededToApprove.value > 0) {
        await userStore.approveForPotionLiquidityPool(amount.value);
        await userStore.fetchUserData();
      } else {
        if (poolId !== null) {
          await contractDeposit(poolId, amount.value);

          await userStore.fetchUserData();
          return true;
        }
      }
    }
    return false;
  };

  const depositLabel = computed(() => {
    if (amountNeededToApprove.value > 0) {
      return `${t("approve")} USDC`;
    }
    return `${t("add_liquidity")}`;
  });

  return {
    depositReceipt,
    depositTx,
    isLoading,
    deposit,
    canDeposit,
    depositLabel,
    amount,
  };
}
