import { computed, unref } from "vue";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { DepositRequestInfoFragment } from "subgraph-queries-hv/generated/operations";

interface RoundsFragment {
  roundNumber: string;
  depositRequests: DepositRequestInfoFragment[];
}

function useDepositRequests(
  vaultAddress: MaybeRef<string>,
  currentRound: MaybeRef<string>,
  investor: MaybeRef<string>,
  rounds: MaybeRef<RoundsFragment[]>
) {
  const {
    deposit,
    depositLoading,
    depositReceipt,
    depositTransaction,
    redeem,
    redeemLoading,
    redeemReceipt,
    redeemTransaction,
  } = useInvestmentVaultContract(vaultAddress);

  const round = computed(() =>
    unref(rounds)?.find((round) => round.roundNumber === unref(currentRound))
  );
  const depositRequests = computed(() => round?.value?.depositRequests ?? []);

  const currentDepositAmount = computed(
    () =>
      depositRequests?.value?.reduce(
        (acc, request) => acc + parseInt(request?.amount ?? "0"),
        0
      ) ?? 0
  );

  const updateDepositRequest = async (amount: MaybeRef<number>) => {
    deposit(unref(amount), unref(investor));
  };

  const canDeleteDepositRequest = computed(
    () => currentDepositAmount.value > 0
  );
  const deleteDepositRequest = async () => {
    if (canDeleteDepositRequest.value) {
      await redeem(
        currentDepositAmount.value,
        unref(investor),
        unref(investor)
      );
    }
  };

  return {
    canDeleteDepositRequest,
    currentDepositAmount,
    deleteDepositLoading: redeemLoading,
    deleteDepositReceipt: redeemReceipt,
    deleteDepositRequest,
    deleteDepositTransaction: redeemTransaction,
    updateDepositLoading: depositLoading,
    updateDepositReceipt: depositReceipt,
    updateDepositRequest,
    updateDepositTransaction: depositTransaction,
  };
}

export { useDepositRequests };
