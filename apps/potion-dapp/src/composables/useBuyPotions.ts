import { computed } from "vue";
import { storeToRefs } from "pinia";

import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";
import { useSlippage } from "./useSlippage";

import type { Ref } from "vue";
import type { DepthRouterReturn } from "potion-router";
import { useUserDataStore } from "@/stores/useUserDataStore";

export function useBuyPotions(
  tokenSelectedAddress: Ref<string | null>,
  strikeSelected: Ref<number>,
  durationSelected: Ref<number>,
  routerResult: Ref<DepthRouterReturn | null>
) {
  const userStore = useUserDataStore();
  const { userAllowance, fetchUserDataLoading } = storeToRefs(userStore);

  const { buyPotions, buyPotionTx, buyPotionReceipt, buyPotionLoading } =
    usePotionLiquidityPoolContract();

  const { premiumSlippage } = useSlippage(routerResult);

  const isLoading = computed(
    () => buyPotionLoading.value || fetchUserDataLoading.value
  );

  const handleBuyPotions = async () => {
    if (routerResult?.value?.counterparties && tokenSelectedAddress.value) {
      if (premiumSlippage.value > userAllowance.value) {
        await userStore.approveForPotionLiquidityPool(premiumSlippage.value);
      } else {
        await buyPotions(
          routerResult.value?.counterparties,
          premiumSlippage.value,
          tokenSelectedAddress.value
        );
      }
      await userStore.fetchUserData();
    } else {
      console.info("You are missing some parameters to be set");
    }
  };

  const handleBuyOrCreatePotions = async () => {
    if (routerResult?.value?.counterparties && tokenSelectedAddress.value) {
      if (premiumSlippage.value > userAllowance.value) {
        await userStore.approveForPotionLiquidityPool(premiumSlippage.value);
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
      await userStore.fetchUserData();
    } else {
      console.info("You are missing some parameters to be set");
    }
  };

  return {
    handleBuyPotions,
    handleBuyOrCreatePotions,
    buyPotionTx,
    buyPotionReceipt,
    isLoading,
  };
}
