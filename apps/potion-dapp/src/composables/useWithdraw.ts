import { ref, computed } from "vue";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";
import type { Ref, ComputedRef } from "vue";

export function useWithdraw(
  id: Ref<number | null> | ComputedRef<number | null>,
  liquidity: Ref<number> | ComputedRef<number>
) {
  const amount = ref(100);

  const {
    withdrawTx,
    withdrawReceipt,
    withdraw: contractWithdraw,
    withdrawLoading,
  } = usePotionLiquidityPoolContract();

  const canWithdraw = computed(() => liquidity.value >= amount.value);

  const withdraw = async () => {
    if (canWithdraw.value) {
      if (id.value !== null) {
        await contractWithdraw(id.value, amount.value);
        return true;
      }
    }
    return false;
  };

  return {
    canWithdraw,
    withdraw,
    withdrawTx,
    withdrawReceipt,
    withdrawLoading,
    amount,
  };
}
