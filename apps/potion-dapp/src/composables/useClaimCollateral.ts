import { ref } from "vue";

import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";

import type { Ref, ComputedRef } from "vue";

export function useClaimCollateral(
  poolId: Ref<number | null> | ComputedRef<number | null>,
  lp: Ref<string> | ComputedRef<string>
) {
  const claimedOtokens = ref<string[]>([]);

  const {
    claimCollateral,
    claimCollateralTx,
    claimCollateralReceipt,
    claimCollateralLoading,
  } = usePotionLiquidityPoolContract();

  const claimOtoken = async (otokenId: string) => {
    if (poolId.value !== null) {
      await claimCollateral(otokenId, [{ lp: lp.value, poolId: poolId.value }]);
      claimedOtokens.value.push(otokenId);
    }
  };

  return {
    claimOtoken,
    claimedOtokens,
    claimCollateralTx,
    claimCollateralReceipt,
    claimCollateralLoading,
  };
}
