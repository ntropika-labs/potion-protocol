import { computed, unref, isRef, watch } from "vue";
import { useRoundsVaultExchanger } from "@/composables/useRoundsVaultExchanger";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";
import {
  hasShares,
  calcAssets as _calcAssets,
} from "@/helpers/deferredRequests";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";
import type { RoundsFragment } from "@/types";

function useInputOutputVaultExchange(
  walletAddress: MaybeRef<string>,
  exchangerAddress: MaybeRef<string>,
  inputVaultAddress: MaybeRef<string>,
  outputVaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>,
  currentRound: MaybeRef<string>,
  shareToAssetRate: MaybeRef<BigNumberish>
) {
  const {
    isApprovedForAll,
    getIsApprovedForAll,
    getIsApprovedForAllLoading,
    setApprovalForAll,
    setApprovalForAllTx,
    setApprovalForAllReceipt,
    setApprovalForAllLoading,
  } = useRoundsVaultContract(inputVaultAddress, assetAddress);

  const {
    exchangeInputForOutput,
    exchangeInputForOutputLoading,
    exchangeInputForOutputReceipt,
    exchangeInputForOutputTx,
    exchangeInputForOutputBatch,
    exchangeInputForOutputBatchLoading,
    exchangeInputForOutputBatchReceipt,
    exchangeInputForOutputBatchTx,
  } = useRoundsVaultExchanger(
    exchangerAddress,
    inputVaultAddress,
    outputVaultAddress
  );

  const pastRounds = computed(() =>
    unref(rounds).filter(
      (round) =>
        round.roundNumber !== unref(currentRound) &&
        hasShares(round.depositRequests?.[0])
    )
  );

  const calcAssets = (shares?: BigNumberish) =>
    _calcAssets(shares, shareToAssetRate);

  const estimatedAssets = computed(() =>
    pastRounds.value.reduce(
      (acc, round) =>
        acc + calcAssets(round?.depositRequests?.[0]?.remainingShares),
      0
    )
  );

  const approveExchange = async () => {
    if (!isApprovedForAll.value) {
      await setApprovalForAll(unref(exchangerAddress), true);
    }
  };

  const getExchangeDetails = (round: RoundsFragment) => ({
    id: round.roundNumber,
    amount: round.depositRequests[0].remainingShares,
  });

  const exchangeTickets = async () => {
    if (isApprovedForAll.value && pastRounds.value.length > 0) {
      if (pastRounds.value.length === 1) {
        const { id, amount } = getExchangeDetails(pastRounds.value[0]);
        await exchangeInputForOutput(id, amount);
      } else {
        const ids = new Array<string>();
        const amounts = new Array<string>();
        pastRounds.value.forEach((round) => {
          const { id, amount } = getExchangeDetails(round);
          ids.push(id);
          amounts.push(amount);
        });
        await exchangeInputForOutputBatch(ids, amounts);
      }
    }
  };

  const exchangeTicketsLoading = computed(
    () =>
      exchangeInputForOutputLoading.value ||
      exchangeInputForOutputBatchLoading.value
  );
  const exchangeTicketsReceipt = computed(
    () =>
      exchangeInputForOutputReceipt.value ||
      exchangeInputForOutputBatchReceipt.value
  );
  const exchangeTicketsTransaction = computed(
    () => exchangeInputForOutputTx.value || exchangeInputForOutputBatchTx.value
  );

  getIsApprovedForAll(unref(walletAddress), unref(exchangerAddress));

  if (isRef(walletAddress)) {
    watch(walletAddress, () =>
      getIsApprovedForAll(unref(walletAddress), unref(exchangerAddress))
    );
  }

  if (isRef(exchangerAddress)) {
    watch(exchangerAddress, () =>
      getIsApprovedForAll(unref(walletAddress), unref(exchangerAddress))
    );
  }

  return {
    estimatedAssets,
    approveExchange,
    approveExchangeLoading:
      getIsApprovedForAllLoading || setApprovalForAllLoading,
    approveExchangeReceipt: setApprovalForAllReceipt,
    approveExchangeTransaction: setApprovalForAllTx,
    canExchange: isApprovedForAll,
    exchangeTickets,
    exchangeTicketsLoading,
    exchangeTicketsReceipt,
    exchangeTicketsTransaction,
  };
}

export { useInputOutputVaultExchange };
