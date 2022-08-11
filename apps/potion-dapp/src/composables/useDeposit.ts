import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "./useCollateralTokenContract";

import { deepUnref } from "@/helpers/vue";

import type { MaybeRef } from "@vueuse/core";

export function useDeposit(
  id: MaybeRef<number | null>,
  userAllowance: MaybeRef<number>,
  userCollateralBalance: MaybeRef<number>
) {
  const amount = ref(100);

  const { t } = useI18n();

  const {
    depositTx,
    depositReceipt,
    deposit: contractDeposit,
    depositLoading,
  } = usePotionLiquidityPoolContract();
  const { approveForPotionLiquidityPool } = useCollateralTokenContract();

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
        await approveForPotionLiquidityPool(amount.value, true);
      } else {
        if (poolId !== null) {
          await contractDeposit(poolId, amount.value);
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
    depositLoading,
    deposit,
    canDeposit,
    depositLabel,
    amount,
  };
}
