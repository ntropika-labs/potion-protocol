import { computed, unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";

function useWithdrawalRequests(
  vaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  currentRound: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>
) {
  const { redeem, redeemLoading, redeemReceipt, redeemTx } =
    useRoundsVaultContract(vaultAddress, assetAddress, false);

  const round = computed(() =>
    unref(rounds)?.find((round) => round.roundNumber === unref(currentRound))
  );

  const withdrawalRequest = computed(() => round?.value?.withdrawalRequests[0]);
  const currentWithdrawalAmount = computed(() => {
    const value = withdrawalRequest?.value?.amount ?? "0";
    return parseInt(formatUnits(value, 18));
  });

  const canDeleteWithdrawalRequest = computed(
    () => currentWithdrawalAmount.value > 0
  );
  const deleteWithdrawalRequest = async () => {
    if (canDeleteWithdrawalRequest.value) {
      await redeem(unref(currentRound), currentWithdrawalAmount.value);
    }
  };

  return {
    canDeleteWithdrawalRequest,
    currentWithdrawalAmount,
    deleteWithdrawalLoading: redeemLoading,
    deleteWithdrawalReceipt: redeemReceipt,
    deleteWithdrawalRequest,
    deleteWithdrawalTransaction: redeemTx,
  };
}

export { useWithdrawalRequests };
