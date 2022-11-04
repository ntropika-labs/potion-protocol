import { computed, unref } from "vue";
import { useRoundsVaultContract } from "@/composables/useRoundsVaultContract";

import type { MaybeRef } from "@vueuse/core";
import type { DepositRequestInfoFragment } from "subgraph-queries-hv/generated/operations";

interface RoundsFragment {
  roundNumber: string;
  depositRequests: DepositRequestInfoFragment[];
}

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
  const depositRequests = computed(() => round?.value?.depositRequests ?? []);

  const currentDepositAmount = computed(
    () =>
      depositRequests?.value?.reduce(
        (acc, request) => acc + parseInt(request?.amount ?? "0"),
        0
      ) ?? 0
  );

  const updateDepositRequest = async (amount: MaybeRef<number>) => {
    deposit(unref(amount));
  };

  const canDeleteDepositRequest = computed(
    () => currentDepositAmount.value > 0
  );
  const deleteDepositRequest = async (id: number) => {
    if (canDeleteDepositRequest.value) {
      await redeem(id, currentDepositAmount.value);
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
