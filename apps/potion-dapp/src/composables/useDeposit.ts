import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "./useCollateralTokenContract";
import type { Ref, ComputedRef } from "vue";

export function useDeposit(
  id: Ref<number | null> | ComputedRef<number | null>
) {
  const amount = ref(100);

  const { t } = useI18n();

  const {
    depositTx,
    depositReceipt,
    deposit: contractDeposit,
    depositLoading,
  } = usePotionLiquidityPoolContract();

  const {
    userAllowance,
    userCollateralBalance,
    approveForPotionLiquidityPool,
  } = useCollateralTokenContract();

  const canDeposit = computed(
    () => amount.value > 0 && amount.value <= userCollateralBalance.value
  );

  const amountNeededToApprove = computed(() => {
    if (userAllowance.value === 0) {
      return amount.value;
    }
    if (amount.value > userAllowance.value) {
      return parseFloat((amount.value - userAllowance.value).toPrecision(6));
    }
    return 0;
  });
  const deposit = async () => {
    if (canDeposit.value) {
      if (amountNeededToApprove.value > 0) {
        await approveForPotionLiquidityPool(amount.value, true);
      } else {
        if (id.value !== null) {
          await contractDeposit(id.value, amount.value);
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
