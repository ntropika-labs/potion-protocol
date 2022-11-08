import { isRef, onMounted, onUnmounted, ref, unref, watch } from "vue";

import { LifecycleStates, Roles } from "hedging-vault-sdk";
import { InvestmentVault__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "@/composables/useEthersContract";
import { ContractInitError } from "@/helpers/errors";

import type { InvestmentVault } from "@potion-protocol/hedging-vault/typechain";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";
import { formatUnits } from "@ethersproject/units";

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
      operator.value = await contract.getRoleMember(Roles.Operator, 0);
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
      admin.value = await contract.getRoleMember(Roles.Admin, 0);
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
      strategist.value = await contract.getRoleMember(Roles.Strategist, 0);
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

  const fetchInfo = async () => {
    if (unref(address)) {
      return await Promise.all([
        getOperator(),
        getAdmin(),
        getStrategist(),
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
    vaultStatus,
    vaultStatusLoading,
    getVaultStatus,
    totalSupply,
    totalSupplyLoading,
    getTotalSupply,
    shareBalance,
    shareBalanceLoading,
    getShareBalance,
  };
}
