import { computed, unref, isRef, watch } from "vue";
import { formatUnits } from "@ethersproject/units";
import { useRoundsVaultExchanger } from "@/composables/useRoundsVaultExchanger";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";
import type { RoundsFragment } from "@/types";

const formatAmount = (amount: MaybeRef<BigNumberish>) =>
  parseFloat(formatUnits(unref(amount), 18));

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
        round.depositRequests.length > 0
    )
  );

  const calcAssets = (shares: string) => {
    const assets = formatAmount(shares) * formatAmount(shareToAssetRate);
    return parseFloat(assets.toFixed(2));
  };

  const estimatedAssets = computed(() =>
    pastRounds.value.reduce(
      (acc, round) =>
        acc + calcAssets(round?.depositRequests?.[0]?.shares ?? "0"),
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
    amount: formatAmount(round.depositRequests[0].amount),
  });

  const exchangeTickets = async () => {
    if (isApprovedForAll.value && pastRounds.value.length > 0) {
      if (pastRounds.value.length === 1) {
        const { id, amount } = getExchangeDetails(pastRounds.value[0]);
        await exchangeInputForOutput(id, amount);
      } else {
        const ids = new Array<string>();
        const amounts = new Array<number>();
        pastRounds.value.forEach((round) => {
          console.log(round.depositRequests);
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
