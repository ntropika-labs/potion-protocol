import { useCollateralTokenContract } from "./useCollateralTokenContract";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";
import type { Ref } from "vue";
import type { DepthRouterReturn } from "potion-router";
import { useUserData } from "./useUserData";
import { useSlippage } from "./useSlippage";

export function useBuyPotions(
  tokenSelectedAddress: Ref<string | null>,
  strikeSelected: Ref<number>,
  durationSelected: Ref<number>,
  routerResult: Ref<DepthRouterReturn | null>
) {
  const { approveTx, approveReceipt, approveForPotionLiquidityPool } =
    useCollateralTokenContract();
  const { buyPotions, buyPotionTx, buyPotionReceipt } =
    usePotionLiquidityPoolContract();
  const { fetchUserData, userAllowance } = useUserData();
  const { premiumSlippage } = useSlippage(routerResult);

  const handleBuyPotions = async () => {
    if (routerResult?.value?.counterparties && tokenSelectedAddress.value) {
      if (premiumSlippage.value > userAllowance.value) {
        await approveForPotionLiquidityPool(premiumSlippage.value, true);
      } else {
        await buyPotions(
          routerResult.value?.counterparties,
          premiumSlippage.value,
          undefined,
          tokenSelectedAddress.value,
          strikeSelected.value,
          durationSelected.value
        );
      }
      await fetchUserData();
    } else {
      console.info("You are missing some parameters to be set");
    }
  };

  return {
    handleBuyPotions,
    buyPotionTx,
    buyPotionReceipt,
    approveTx,
    approveReceipt,
  };
}
