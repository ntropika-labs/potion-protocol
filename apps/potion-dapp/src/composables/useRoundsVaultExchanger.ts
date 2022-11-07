import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import { ref, unref } from "vue";

import { useEthersContract } from "@/composables/useEthersContract";
import { parseUnits } from "@ethersproject/units";
import { RoundsVaultExchanger__factory } from "@potion-protocol/hedging-vault/typechain";

import type { RoundsVaultExchanger } from "@potion-protocol/hedging-vault/typechain";
import type { Ref } from "vue";
import type { BigNumberish } from "ethers";

export function useRoundsVaultExchanger(
  address: string | Ref<string>,
  roundsInputAddress: string | Ref<string>,
  roundsOutputAddress: string | Ref<string>
) {
  const { initContract } = useEthersContract();

  const initContractSigner = () => {
    return initContract(
      true,
      false,
      RoundsVaultExchanger__factory,
      unref(address).toLowerCase()
    ) as RoundsVaultExchanger;
  };

  const exchangeInputForOutputLoading = ref(false);
  const exchangeInputForOutputTx = ref<ContractTransaction | null>(null);
  const exchangeInputForOutputReceipt = ref<ContractReceipt | null>(null);
  const exchangeInputForOutput = async (id: BigNumberish, amount: number) => {
    try {
      exchangeInputForOutputLoading.value = true;
      const contract = initContractSigner();
      const tx = await contract.exchangeInputForOutput(
        unref(roundsInputAddress),
        unref(roundsOutputAddress),
        id,
        parseUnits(amount.toString())
      );
      exchangeInputForOutputTx.value = tx;
      exchangeInputForOutputReceipt.value = await tx.wait();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot exchange: ${error.message}`);
      } else {
        throw new Error(`Cannot exchange`);
      }
    } finally {
      exchangeInputForOutputLoading.value = false;
    }
  };

  const exchangeInputForOutputBatchLoading = ref(false);
  const exchangeInputForOutputBatchTx = ref<ContractTransaction | null>(null);
  const exchangeInputForOutputBatchReceipt = ref<ContractReceipt | null>(null);
  const exchangeInputForOutputBatch = async (
    ids: BigNumberish[],
    amounts: number[]
  ) => {
    try {
      exchangeInputForOutputBatchLoading.value = true;
      const contract = initContractSigner();
      const tx = await contract.exchangeInputForOutputBatch(
        unref(roundsInputAddress),
        unref(roundsOutputAddress),
        ids,
        amounts.map((x) => parseUnits(x.toString()))
      );
      exchangeInputForOutputBatchTx.value = tx;
      exchangeInputForOutputBatchReceipt.value = await tx.wait();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot exchange: ${error.message}`);
      } else {
        throw new Error(`Cannot exchange`);
      }
    } finally {
      exchangeInputForOutputLoading.value = false;
    }
  };

  return {
    exchangeInputForOutput,
    exchangeInputForOutputLoading,
    exchangeInputForOutputTx,
    exchangeInputForOutputReceipt,
    exchangeInputForOutputBatch,
    exchangeInputForOutputBatchLoading,
    exchangeInputForOutputBatchTx,
    exchangeInputForOutputBatchReceipt,
  };
}
