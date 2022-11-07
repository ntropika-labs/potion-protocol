import { isRef, onMounted, onUnmounted, ref, unref, watch } from "vue";

import { LifecycleStates } from "hedging-vault-sdk";
import { InvestmentVault__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "@/composables/useEthersContract";
import { ContractInitError } from "@/helpers/errors";

import type { InvestmentVault } from "@potion-protocol/hedging-vault/typechain";
import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "ethers";

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
    getVaultStatus,
    vaultStatus,
    vaultStatusLoading,
  };
}
