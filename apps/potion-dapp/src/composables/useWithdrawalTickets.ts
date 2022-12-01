import { computed, unref } from "vue";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";
import {
  formatAmount,
  hasUnderlyings,
  calcUnderlyings,
  parseAmount,
} from "@/helpers/deferredTickets";

import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";

function useWithdrawalTickets(
  vaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  assetDecimals: MaybeRef<number>,
  currentRound: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>
) {
  const {
    redeem,
    redeemLoading,
    redeemReceipt,
    redeemTx,
    redeemExchangeAsset,
    redeemExchangeAssetLoading,
    redeemExchangeAssetReceipt,
    redeemExchangeAssetTx,
    redeemExchangeAssetBatch,
    redeemExchangeAssetBatchLoading,
    redeemExchangeAssetBatchReceipt,
    redeemExchangeAssetBatchTx,
  } = useRoundsVaultContract(vaultAddress, assetAddress, false);

  const isCurrentRound = (round: RoundsFragment) =>
    round.roundNumber === unref(currentRound);

  const round = computed(() => unref(rounds)?.find(isCurrentRound));

  const pastRounds = computed(() =>
    unref(rounds).filter(
      (round) =>
        !isCurrentRound(round) && hasUnderlyings(round.withdrawalTickets?.[0])
    )
  );

  const availableUnderlyings = computed(() =>
    unref(rounds).reduce(
      (acc, round) =>
        acc +
        calcUnderlyings(
          round?.withdrawalTickets?.[0]?.underlyingsRemaining,
          round?.underlyingToShareRate
        ),
      0
    )
  );

  const currentWithdrawalTicket = computed(
    () => round?.value?.withdrawalTickets[0]
  );

  const currentWithdrawalAmount = computed(() =>
    formatAmount(
      currentWithdrawalTicket?.value?.amountRemaining,
      unref(assetDecimals)
    )
  );

  const canDeleteWithdrawalTicket = computed(
    () => currentWithdrawalAmount.value > 0
  );

  const deleteWithdrawalTicket = async () => {
    if (canDeleteWithdrawalTicket.value) {
      await redeem(
        unref(currentRound),
        parseAmount(currentWithdrawalAmount.value, unref(assetDecimals))
      );
    }
  };

  const getWithdrawalDetails = (round: RoundsFragment) => ({
    id: round.roundNumber,
    assets: round.withdrawalTickets[0].amountRemaining,
  });

  const redeemUnderlyings = () => {
    if (pastRounds.value.length > 0) {
      if (pastRounds.value.length == 1) {
        const { id, assets } = getWithdrawalDetails(pastRounds.value[0]);
        return redeemExchangeAsset(id, assets);
      } else {
        const ids = new Array<string>();
        const allUnderlyings = new Array<string>();
        pastRounds.value.forEach((round) => {
          const { id, assets } = getWithdrawalDetails(round);
          ids.push(id);
          allUnderlyings.push(assets);
        });
        return redeemExchangeAssetBatch(ids, allUnderlyings);
      }
    }
  };
  const redeemUnderlyingsLoading = computed(
    () =>
      redeemExchangeAssetLoading.value || redeemExchangeAssetBatchLoading.value
  );
  const redeemUnderlyingsReceipt = computed(
    () =>
      redeemExchangeAssetReceipt.value || redeemExchangeAssetBatchReceipt.value
  );
  const redeemUnderlyingsTransaction = computed(
    () => redeemExchangeAssetTx.value || redeemExchangeAssetBatchTx.value
  );

  return {
    canDeleteWithdrawalTicket,
    currentWithdrawalAmount,
    deleteWithdrawalLoading: redeemLoading,
    deleteWithdrawalReceipt: redeemReceipt,
    deleteWithdrawalTicket,
    deleteWithdrawalTransaction: redeemTx,
    availableUnderlyings,
    redeemUnderlyings,
    redeemUnderlyingsLoading,
    redeemUnderlyingsReceipt,
    redeemUnderlyingsTransaction,
  };
}

export { useWithdrawalTickets };
