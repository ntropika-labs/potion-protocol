import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";

import type { ComputedRef, Ref } from "vue";
import type { BondingCurveParams, Criteria } from "dapp-types";
import { useUserDataStore } from "@/stores/useUserDataStore";
import { storeToRefs } from "pinia";

type RefOrComputedRef<T> = Ref<T> | ComputedRef<T>;

export function useDeployPool(
  poolId: RefOrComputedRef<number>,
  liquidity: RefOrComputedRef<number>,
  bondingCurve: RefOrComputedRef<BondingCurveParams>,
  criterias: RefOrComputedRef<Criteria[]>,
  approveMessage: string,
  deployMessage: string
) {
  const { t } = useI18n();
  const userStore = useUserDataStore();
  const { walletAddress, userAllowance, fetchUserDataLoading } =
    storeToRefs(userStore);

  const {
    depositAndCreateCurveAndCriteriaTx,
    depositAndCreateCurveAndCriteriaReceipt,
    depositAndCreateCurveAndCriteria,
    depositAndCreateCurveAndCriteriaLoading,
  } = usePotionLiquidityPoolContract();

  const isLoading = computed(
    () =>
      depositAndCreateCurveAndCriteriaLoading.value ||
      fetchUserDataLoading.value
  );

  const amountNeededToApprove = computed(() => {
    if (userAllowance.value === 0) {
      return liquidity.value;
    }
    if (liquidity.value > userAllowance.value) {
      return parseFloat((liquidity.value - userAllowance.value).toPrecision(6));
    }
    return 0;
  });

  const deployLabel = computed(() => {
    if (walletAddress.value) {
      return amountNeededToApprove.value > 0 ? approveMessage : deployMessage;
    }
    return t("connect_wallet");
  });

  const handleDeployPool = async () => {
    if (amountNeededToApprove.value > 0) {
      await userStore.approveForPotionLiquidityPool(liquidity.value);
    } else {
      await depositAndCreateCurveAndCriteria(
        poolId.value,
        liquidity.value,
        bondingCurve.value,
        criterias.value
      );
    }

    await userStore.fetchUserData();
  };

  return {
    deployLabel,
    handleDeployPool,
    isLoading,
    deployPoolTx: depositAndCreateCurveAndCriteriaTx,
    deployPoolReceipt: depositAndCreateCurveAndCriteriaReceipt,
  };
}
