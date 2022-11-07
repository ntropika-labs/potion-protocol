import { computed, unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";

function useDepositRequests(
  vaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  currentRound: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>
) {
  const {
    deposit,
    depositLoading,
    depositReceipt,
    depositTx,
    redeem,
    redeemLoading,
    redeemReceipt,
    redeemTx,
  } = useRoundsVaultContract(vaultAddress, assetAddress, false);

  const round = computed(() =>
    unref(rounds)?.find((round) => round.roundNumber === unref(currentRound))
  );
  const depositRequest = computed(() => round?.value?.depositRequests[0]);

  const currentDepositAmount = computed(() => {
    const value = depositRequest?.value?.amount ?? "0";
    return parseInt(formatUnits(value, 18));
  });

  const updateDepositRequest = async (amount: MaybeRef<number>) => {
    deposit(unref(amount));
  };

  const canDeleteDepositRequest = computed(
    () => currentDepositAmount.value > 0
  );
  const deleteDepositRequest = async () => {
    if (canDeleteDepositRequest.value) {
      await redeem(unref(currentRound), currentDepositAmount.value);
    }
  };

  return {
    canDeleteDepositRequest,
    currentDepositAmount,
    deleteDepositLoading: redeemLoading,
    deleteDepositReceipt: redeemReceipt,
    deleteDepositRequest,
    deleteDepositTransaction: redeemTx,
    updateDepositLoading: depositLoading,
    updateDepositReceipt: depositReceipt,
    updateDepositRequest,
    updateDepositTransaction: depositTx,
  };
}

export { useDepositRequests };
