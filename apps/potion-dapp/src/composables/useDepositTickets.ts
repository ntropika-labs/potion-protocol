import { computed, unref } from "vue";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";
import {
  formatAmount,
  parseAmount,
  getDepositTicketsFromRounds,
} from "@/helpers/deferredTickets";

import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";

function useDepositTickets(
  vaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  assetDecimals: MaybeRef<number>,
  currentRoundNumber: MaybeRef<string>,
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

  const depositTickets = computed(() =>
    getDepositTicketsFromRounds(unref(rounds))
  );

  const currentRound = computed(() =>
    unref(rounds)?.find(
      (round) => round.roundNumber === unref(currentRoundNumber)
    )
  );
  const currentDepositTicket = computed(
    () => currentRound?.value?.depositTickets[0]
  );

  const currentDepositAmount = computed(() =>
    formatAmount(
      currentDepositTicket?.value?.amountRemaining,
      unref(assetDecimals)
    )
  );

  const updateDepositTicket = async (amount: MaybeRef<number>) =>
    deposit(parseAmount(amount, unref(assetDecimals)));

  const canDeleteDepositTicket = computed(() => currentDepositAmount.value > 0);
  const deleteDepositTicket = async () => {
    if (canDeleteDepositTicket.value) {
      await redeem(
        unref(currentRoundNumber),
        parseAmount(currentDepositAmount.value, unref(assetDecimals))
      );
    }
  };

  return {
    depositTickets,
    canDeleteDepositTicket,
    currentDepositAmount,
    deleteDepositLoading: redeemLoading,
    deleteDepositReceipt: redeemReceipt,
    deleteDepositTicket,
    deleteDepositTransaction: redeemTx,
    updateDepositLoading: depositLoading,
    updateDepositReceipt: depositReceipt,
    updateDepositTicket,
    updateDepositTransaction: depositTx,
  };
}

export { useDepositTickets };
