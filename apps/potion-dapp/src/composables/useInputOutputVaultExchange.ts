import { computed, unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { useRoundsVaultExchanger } from "@/composables/useRoundsVaultExchanger";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";
import type { RoundsFragment } from "@/types";

const formatAmount = (amount: MaybeRef<BigNumberish>) =>
  parseInt(formatUnits(unref(amount), 18));

function useInputOutputVaultExchange(
  exchangerAddress: MaybeRef<string>,
  inputVaultAddress: MaybeRef<string>,
  outputVaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>,
  shareToAssetRate: MaybeRef<BigNumberish>
) {
  const {
    isApprovedForAll,
    setApprovalForAll,
    setApprovalForAllTx,
    setApprovalForAllReceipt,
    setApprovalForAllLoading,
  } = useRoundsVaultContract(inputVaultAddress, assetAddress, false);

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

  const calcAssets = (shares: string) =>
    formatAmount(BigNumber.from(shares).mul(formatAmount(shareToAssetRate)));

  const estimatedAssets = computed(() =>
    unref(rounds).reduce(
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
    const unreffedRounds = unref(rounds);
    if (isApprovedForAll.value && unreffedRounds.length > 0) {
      if (unreffedRounds.length === 1) {
        const { id, amount } = getExchangeDetails(unreffedRounds[0]);
        await exchangeInputForOutput(id, amount);
      } else {
        const ids = new Array<string>();
        const amounts = new Array<number>();
        unreffedRounds.forEach((round) => {
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

  return {
    estimatedAssets,
    approveExchange,
    approveExchangeLoading: setApprovalForAllLoading,
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
