import { computed, unref } from "vue";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";
import {
  formatAmount,
  hasAssets,
  calcAssets,
} from "@/helpers/deferredRequests";

import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";

function useWithdrawalRequests(
  vaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
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
        !isCurrentRound(round) && hasAssets(round.withdrawalRequests?.[0])
    )
  );

  const availableAssets = computed(() =>
    unref(rounds).reduce(
      (acc, round) =>
        acc +
        calcAssets(
          round?.withdrawalRequests?.[0]?.remainingAssets,
          round?.assetToShareRate
        ),
      0
    )
  );

  const currentWithdrawalRequest = computed(
    () => round?.value?.withdrawalRequests[0]
  );

  const currentWithdrawalAmount = computed(() =>
    formatAmount(currentWithdrawalRequest?.value?.amount)
  );

  const canDeleteWithdrawalRequest = computed(
    () => currentWithdrawalAmount.value > 0
  );

  const deleteWithdrawalRequest = async () => {
    if (canDeleteWithdrawalRequest.value) {
      await redeem(unref(currentRound), currentWithdrawalAmount.value);
    }
  };

  const getWithdrawalDetails = (round: RoundsFragment) => ({
    id: round.roundNumber,
    assets: round.withdrawalRequests[0].amount,
  });

  const redeemAssets = () => {
    if (pastRounds.value.length > 0) {
      if (pastRounds.value.length == 1) {
        const { id, assets } = getWithdrawalDetails(pastRounds.value[0]);
        return redeemExchangeAsset(id, assets);
      } else {
        const ids = new Array<string>();
        const allAssets = new Array<string>();
        pastRounds.value.forEach((round) => {
          const { id, assets } = getWithdrawalDetails(round);
          ids.push(id);
          allAssets.push(assets);
        });
        return redeemExchangeAssetBatch(ids, allAssets);
      }
    }
  };
  const redeemAssetsLoading = computed(
    () =>
      redeemExchangeAssetLoading.value || redeemExchangeAssetBatchLoading.value
  );
  const redeemAssetsReceipt = computed(
    () =>
      redeemExchangeAssetReceipt.value || redeemExchangeAssetBatchReceipt.value
  );
  const redeemAssetsTransaction = computed(
    () => redeemExchangeAssetTx.value || redeemExchangeAssetBatchTx.value
  );

  return {
    canDeleteWithdrawalRequest,
    currentWithdrawalAmount,
    deleteWithdrawalLoading: redeemLoading,
    deleteWithdrawalReceipt: redeemReceipt,
    deleteWithdrawalRequest,
    deleteWithdrawalTransaction: redeemTx,
    availableAssets,
    redeemAssets,
    redeemAssetsLoading,
    redeemAssetsReceipt,
    redeemAssetsTransaction,
  };
}

export { useWithdrawalRequests };
