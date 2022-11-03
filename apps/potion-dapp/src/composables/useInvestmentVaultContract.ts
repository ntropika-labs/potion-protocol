import { isRef, onMounted, onUnmounted, ref, unref, watch } from "vue";

import { LifecycleStates } from "hedging-vault-sdk";
import { InvestmentVault__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "@/composables/useEthersContract";
import { ContractInitError } from "@/helpers/errors";

import type { InvestmentVault } from "@potion-protocol/hedging-vault/typechain";
import type { MaybeRef } from "@vueuse/core";
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import type { BigNumberish } from "ethers";
import { parseUnits } from "@ethersproject/units";

export function useInvestmentVaultContract(
  address: MaybeRef<string>,
  fetchInitialData = true,
  eventListeners = false
) {
  const { initContract } = useEthersContract();

  const initContractProviderWS = () => {
    return initContract(
      false,
      true,
      InvestmentVault__factory,
      unref(address).toLowerCase()
    ) as InvestmentVault;
  };

  const initContractProvider = () => {
    try {
      return initContract(
        false,
        false,
        InvestmentVault__factory,
        unref(address).toLowerCase()
      ) as InvestmentVault;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? "Unable to init contract: " + error.message
          : "Unable to init contract";

      throw new ContractInitError(errorMessage);
    }
  };

  const initContractSigner = () => {
    try {
      return initContract(
        true,
        false,
        InvestmentVault__factory,
        unref(address).toLowerCase()
      ) as InvestmentVault;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? "Unable to init contract: " + error.message
          : "Unable to init contract";

      throw new ContractInitError(errorMessage);
    }
  };

  const depositTransaction = ref<ContractTransaction | null>(null);
  const depositReceipt = ref<ContractReceipt | null>(null);
  const depositLoading = ref(false);
  const deposit = async (assets: BigNumberish, receiver: string) => {
    try {
      depositLoading.value = true;
      const contract = initContractSigner();
      depositTransaction.value = await contract.deposit(
        parseUnits(assets.toString(), 6),
        receiver
      );
      depositReceipt.value = await depositTransaction.value.wait();
    } catch (error) {
      const message =
        error instanceof Error
          ? `Cannot deposit: ${error.message}`
          : "Cannot deposit";

      throw new Error(message);
    } finally {
      depositLoading.value = false;
    }
  };

  const redeemTransaction = ref<ContractTransaction | null>(null);
  const redeemReceipt = ref<ContractReceipt | null>(null);
  const redeemLoading = ref(false);
  const redeem = async (
    shares: BigNumberish,
    receiver: string,
    owner: string
  ) => {
    try {
      redeemLoading.value = true;
      const contract = initContractSigner();
      redeemTransaction.value = await contract.redeem(
        parseUnits(shares.toString(), 6),
        receiver,
        owner
      );
      redeemReceipt.value = await redeemTransaction.value.wait();
    } catch (error) {
      const message =
        error instanceof Error
          ? `Cannot redeem: ${error.message}`
          : "Cannot redeem";

      throw new Error(message);
    } finally {
      redeemLoading.value = false;
    }
  };

  const vaultStatus = ref<LifecycleStates>(LifecycleStates.Unlocked);
  const vaultStatusLoading = ref(false);
  const getVaultStatus = async () => {
    try {
      const contract = initContractProvider();
      vaultStatusLoading.value = true;
      const vaultStateNumber = await contract.getLifecycleState();
      vaultStatus.value = vaultStateNumber as LifecycleStates;
    } catch (error) {
      const message =
        error instanceof Error
          ? `Cannot get vault status: ${error.message}`
          : `Cannot get vault status: ${error}`;

      throw new Error(message);
    } finally {
      vaultStatusLoading.value = false;
    }
  };

  if (eventListeners) {
    const wsContract = initContractProviderWS();
    wsContract.on(
      "LifecycleStateChanged",
      (prevState: BigNumberish, nextState: BigNumberish) => {
        vaultStatus.value = nextState as LifecycleStates;
      }
    );

    onUnmounted(() => {
      wsContract.removeAllListeners();
      //@ts-expect-error the contract instance is not typed. The provider here is a websocket provider
      wsContract.provider.destroy();
    });
  }

  if (fetchInitialData) {
    onMounted(async () => {
      await getVaultStatus();
    });
  }

  if (isRef(address)) {
    watch(address, async () => {
      await getVaultStatus();
    });
  }

  return {
    deposit,
    depositLoading,
    depositReceipt,
    depositTransaction,
    getVaultStatus,
    redeem,
    redeemLoading,
    redeemReceipt,
    redeemTransaction,
    vaultStatus,
    vaultStatusLoading,
  };
}
