import { computed, unref, isRef, watch } from "vue";
import { useRoundsVaultExchanger } from "@/composables/useRoundsVaultExchanger";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";
import {
  hasShares,
  calcUnderlyings as _calcUnderlyings,
} from "@/helpers/deferredTickets";
import { getDepositTicketsBurnInfo } from "hedging-vault-sdk";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";
import type { DepositTicket } from "hedging-vault-sdk";
import type { RoundsFragment } from "@/types";
import { isValidAddress } from "@/helpers";

const roundToDepositTicket = (round: RoundsFragment): DepositTicket => ({
  id: parseInt(round.roundNumber),
  amount: parseInt(round.depositTickets[0].amount),
  amountRedeemed: parseInt(round.depositTickets[0].amountRedeemed),
  shares: parseInt(round.depositTickets[0].shares),
  sharesRemaining: parseInt(round.depositTickets[0].sharesRemaining),
});

function useInputOutputVaultExchange(
  walletAddress: MaybeRef<string>,
  exchangerAddress: MaybeRef<string>,
  inputVaultAddress: MaybeRef<string>,
  outputVaultAddress: MaybeRef<string>,
  assetAddress: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>,
  currentRound: MaybeRef<string>,
  shareToUnderlyingRate: MaybeRef<BigNumberish>
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
        hasShares(round.depositTickets?.[0])
    )
  );

  const calcUnderlyings = (shares?: BigNumberish) =>
    _calcUnderlyings(shares, shareToUnderlyingRate);

  const estimatedUnderlyings = computed(() =>
    pastRounds.value.reduce(
      (acc, round) =>
        acc + calcUnderlyings(round?.depositTickets?.[0]?.sharesRemaining),
      0
    )
  );

  const approveExchange = async () => {
    if (!isApprovedForAll.value) {
      await setApprovalForAll(unref(exchangerAddress), true);
    }
  };

  const exchangeTickets = async (percentage: number | string = 100) => {
    if (isApprovedForAll.value && pastRounds.value.length > 0) {
      const depositTickets = pastRounds.value.map(roundToDepositTicket);
      const result = getDepositTicketsBurnInfo(
        depositTickets,
        Number(percentage)
      );
      const ids = result.ids.map(String);
      const amounts = result.amounts.map(String);
      if (ids.length === 1) {
        await exchangeInputForOutput(ids[0], amounts[0]);
      } else {
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

  const _getIsApprovedForAll = async () => {
    const wallet = unref(walletAddress);
    if (isValidAddress(wallet)) {
      await getIsApprovedForAll(wallet, unref(exchangerAddress));
    }
  };

  _getIsApprovedForAll();

  if (isRef(walletAddress)) {
    watch(walletAddress, _getIsApprovedForAll);
  }

  if (isRef(exchangerAddress)) {
    watch(exchangerAddress, _getIsApprovedForAll);
  }

  return {
    estimatedUnderlyings,
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
