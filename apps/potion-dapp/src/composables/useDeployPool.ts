import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useOnboard } from "@onboard-composable";

import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";

import type { ComputedRef, Ref } from "vue";
import type { BondingCurveParams, Criteria } from "dapp-types";

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
  const { connectedWallet } = useOnboard();

  const {
    depositAndCreateCurveAndCriteriaTx,
    depositAndCreateCurveAndCriteriaReceipt,
    depositAndCreateCurveAndCriteria,
    depositAndCreateCurveAndCriteriaLoading,
  } = usePotionLiquidityPoolContract();

  const {
    fetchUserCollateralBalance,
    fetchUserCollateralAllowance,
    userAllowance,
    approveForPotionLiquidityPool,
    approveLoading,
    approveTx,
    approveReceipt,
  } = useCollateralTokenContract();

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
    if (connectedWallet.value) {
      return amountNeededToApprove.value > 0 ? approveMessage : deployMessage;
    }
    return t("connect_wallet");
  });

  const handleDeployPool = async () => {
    if (amountNeededToApprove.value > 0) {
      await approveForPotionLiquidityPool(liquidity.value, true);
    } else {
      await depositAndCreateCurveAndCriteria(
        poolId.value,
        liquidity.value,
        bondingCurve.value,
        criterias.value
      );
    }
    fetchUserCollateralBalance();
    fetchUserCollateralAllowance();
  };

  return {
    deployLabel,
    handleDeployPool,
    approveDeployPoolTx: approveTx,
    approveDeployPoolLoading: approveLoading,
    approveDeployPoolReceipt: approveReceipt,
    deployPoolTx: depositAndCreateCurveAndCriteriaTx,
    deployPoolReceipt: depositAndCreateCurveAndCriteriaReceipt,
    deployPoolLoading: depositAndCreateCurveAndCriteriaLoading,
  };
}
