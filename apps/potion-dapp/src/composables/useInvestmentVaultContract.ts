import { isRef, onMounted, onUnmounted, ref, unref, watch } from "vue";
import { formatUnits } from "@ethersproject/units";

import { InvestmentVault__factory } from "@potion-protocol/hedging-vault/typechain";

import { LifecycleStates } from "hedging-vault-sdk";
import { useEthersContract } from "@/composables/useEthersContract";
import { ContractInitError } from "@/helpers/errors";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "ethers";
import type { InvestmentVault } from "@potion-protocol/hedging-vault/typechain";

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

  const totalSupply = ref<number>(0);
  const totalSupplyLoading = ref(false);
  const getTotalSupply = async () => {
    try {
      totalSupplyLoading.value = true;
      const contract = initContractProvider();

      const totalSupplyBN = await contract.totalSupply();

      totalSupply.value = parseFloat(formatUnits(totalSupplyBN, 18));
    } catch (error) {
      const message =
        error instanceof Error
          ? `Cannot get total supply: ${error.message}`
          : `Cannot get total supply: ${error}`;

      throw new Error(message);
    } finally {
      totalSupplyLoading.value = false;
    }
  };

  const shareBalance = ref<number>(0);
  const shareBalanceLoading = ref(false);
  const getShareBalance = async (address: string) => {
    try {
      const contract = initContractProvider();

      const shareBalanceBN = await contract.balanceOf(address);

      shareBalance.value = parseFloat(formatUnits(shareBalanceBN, 18));
    } catch (error) {
      const message =
        error instanceof Error
          ? `Cannot get share balance: ${error.message}`
          : `Cannot get share balance: ${error}`;

      throw new Error(message);
    } finally {
      shareBalanceLoading.value = false;
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
    totalSupply,
    totalSupplyLoading,
    getTotalSupply,
    shareBalance,
    shareBalanceLoading,
    getShareBalance,
  };
}
