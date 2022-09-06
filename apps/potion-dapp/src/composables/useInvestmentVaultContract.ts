import { isRef, onMounted, onUnmounted, ref, unref, watch } from "vue";
import { formatUnits } from "@ethersproject/units";

import { LifecycleStates } from "hedging-vault-sdk";
import { InvestmentVault__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "@/composables/useEthersContract";
import { ContractInitError } from "@/helpers/errors";

import type { InvestmentVault } from "@potion-protocol/hedging-vault/typechain";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";

export function useInvestmentVaultContract(
  address: string | Ref<string>,
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

  const operator = ref("");
  const operatorLoading = ref(false);
  const getOperator = async () => {
    try {
      operatorLoading.value = true;
      const contract = initContractProvider();
      operator.value = await contract.getOperator();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`cannot get the operator: ${error.message}`);
      } else {
        throw new Error(`cannot get the operator: ${error}`);
      }
    } finally {
      operatorLoading.value = false;
    }
  };

  const admin = ref("");
  const adminLoading = ref(false);
  const getAdmin = async () => {
    try {
      adminLoading.value = true;
      const contract = initContractProvider();
      admin.value = await contract.getAdmin();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`cannot get the admin: ${error.message}`);
      } else {
        throw new Error(`cannot get the admin: ${error}`);
      }
    } finally {
      adminLoading.value = false;
    }
  };

  const strategist = ref("");
  const strategistLoading = ref(false);
  const getStrategist = async () => {
    try {
      strategistLoading.value = true;
      const contract = initContractProvider();
      strategist.value = await contract.getStrategist();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`cannot get the strategist: ${error.message}`);
      } else {
        throw new Error(`cannot get the strategist: ${error}`);
      }
    } finally {
      strategistLoading.value = false;
    }
  };

  const principalPercentages = ref<number[]>([0]);
  const principalPercentagesLoading = ref(false);
  const getPrincipalPercentages = async () => {
    try {
      principalPercentagesLoading.value = true;
      const contract = initContractProvider();
      const response = await contract.getPrincipalPercentages();
      principalPercentages.value = response.map((x: BigNumberish) => {
        return parseFloat(formatUnits(x, 6));
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `cannot get the principal percentages: ${error.message}`
        );
      } else {
        throw new Error(`cannot get the principal percentages: ${error}`);
      }
    } finally {
      principalPercentagesLoading.value = false;
    }
  };

  const vaultStatus = ref<number>(0);
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

  const fetchInfo = async () => {
    if (unref(address)) {
      return await Promise.all([
        getOperator(),
        getAdmin(),
        getStrategist(),
        getPrincipalPercentages(),
        getVaultStatus(),
      ]);
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
    wsContract.on(
      "PrincipalPercentagesUpdated",
      (newPrincipalPercentages: BigNumberish[]) => {
        principalPercentages.value = newPrincipalPercentages.map((x) => {
          return parseFloat(formatUnits(x, 6));
        });
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
      await fetchInfo();
    });
  }

  if (isRef(address)) {
    watch(address, async () => {
      await fetchInfo();
    });
  }

  return {
    operator,
    operatorLoading,
    getOperator,
    admin,
    adminLoading,
    getAdmin,
    strategist,
    strategistLoading,
    getStrategist,
    principalPercentages,
    principalPercentagesLoading,
    getPrincipalPercentages,
    vaultStatus,
    vaultStatusLoading,
    getVaultStatus,
  };
}
