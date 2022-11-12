import { computed, unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";
import { BigNumber, type BigNumberish } from "ethers";

const formatAmount = (amount?: MaybeRef<BigNumberish>) =>
  parseFloat(formatUnits(unref(amount ?? "0"), 18));

const calcAssets = (
  assets?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => {
  const amount = formatAmount(assets) * formatAmount(exchangeRate);
  return parseFloat(amount.toFixed(2));
};

const calcAssetsBN = (
  assets?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => {
  const amount = BigNumber.from(assets ?? "0")
    .mul(BigNumber.from(exchangeRate ?? "0"))
    .div(BigNumber.from(10).pow(18));
  return amount.toString();
};

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

  const round = computed(() =>
    unref(rounds)?.find((round) => round.roundNumber === unref(currentRound))
  );

  const pastRounds = computed(() =>
    unref(rounds).filter(
      (round) =>
        round.roundNumber !== unref(currentRound) &&
        (round.withdrawalRequests?.[0]?.remainingAssets ?? "0") !== "0"
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
  const currentWithdrawalAmount = computed(() => {
    const value = currentWithdrawalRequest?.value?.amount ?? "0";
    return formatAmount(value);
  });

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
    assets: calcAssetsBN(
      round?.withdrawalRequests?.[0]?.remainingAssets,
      round?.assetToShareRate
    ),
  });

  const redeemAssets = () => {
    if (pastRounds.value.length > 0) {
      if (pastRounds.value.length == 1) {
        const { id, assets } = getWithdrawalDetails(pastRounds.value[0]);
        console.log(id, assets);
        return redeemExchangeAsset(id, assets);
      } else {
        const ids = new Array<string>();
        const allAssets = new Array<string>();
        pastRounds.value.forEach((round) => {
          const { id, assets } = getWithdrawalDetails(round);
          console.log(id, assets);
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
