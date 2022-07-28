import { isRef, onMounted, ref, unref, watch } from "vue";

import { useEthersContract } from "@/composables/useEthersContract";
import { formatUnits } from "@ethersproject/units";
// import { useOnboard } from "@onboard-composable";
import { InvestmentVault__factory } from "@potion-protocol/hedging-vault/typechain";

import type { InvestmentVault } from "@potion-protocol/hedging-vault/typechain";
// import type {
//   ContractTransaction,
//   ContractReceipt,
// } from "@ethersproject/contracts";
import type { Ref } from "vue";

enum LifecycleState {
  Unlocked,
  Committed,
  Locked,
}

export function useInvestmentVaultContract(address: string | Ref<string>) {
  const { initContract } = useEthersContract();
  // const { connectedWallet } = useOnboard();
  // const initContractSigner = () => {
  //   return initContract(
  //     true,
  //     false,
  //     InvestmentVault__factory,
  //     unref(address).toLowerCase()
  //   ) as InvestmentVault;
  // };

  const initContractProvider = () => {
    return initContract(
      true,
      false,
      InvestmentVault__factory,
      unref(address).toLowerCase()
    ) as InvestmentVault;
  };

  const operator = ref("");
  const operatorLoading = ref(false);
  const getOperator = async () => {
    operatorLoading.value = true;
    const contract = initContractProvider();

    try {
      operator.value = await contract.getOperator();
      operatorLoading.value = false;
    } catch (error) {
      operatorLoading.value = false;

      if (error instanceof Error) {
        throw new Error(`cannot get the operator: ${error.message}`);
      } else {
        throw new Error(`cannot get the operator: ${error}`);
      }
    }
  };

  const admin = ref("");
  const adminLoading = ref(false);
  const getAdmin = async () => {
    adminLoading.value = true;
    const contract = initContractProvider();
    try {
      admin.value = await contract.getAdmin();
      adminLoading.value = false;
    } catch (error) {
      adminLoading.value = false;

      if (error instanceof Error) {
        throw new Error(`cannot get the admin: ${error.message}`);
      } else {
        throw new Error(`cannot get the admin: ${error}`);
      }
    }
  };

  const strategist = ref("");
  const strategistLoading = ref(false);
  const getStrategist = async () => {
    strategistLoading.value = true;
    const contract = initContractProvider();
    try {
      strategist.value = await contract.getStrategist();
      strategistLoading.value = false;
    } catch (error) {
      strategistLoading.value = false;

      if (error instanceof Error) {
        throw new Error(`cannot get the strategist: ${error.message}`);
      } else {
        throw new Error(`cannot get the strategist: ${error}`);
      }
    }
  };

  const principalPercentages = ref<number[]>([0]);
  const principalPercentagesLoading = ref(false);
  const getPrincipalPercentages = async () => {
    principalPercentagesLoading.value = true;
    const contract = initContractProvider();
    try {
      const response = await contract.getPrincipalPercentages();
      principalPercentages.value = response.map((x) => {
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
    const contract = initContractProvider();
    vaultStatusLoading.value = true;
    try {
      const vaultStateNumber = await contract.getLifecycleState();
      vaultStatus.value = vaultStateNumber as LifecycleState;
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

  // const vaultActionsAddresses = ref<string[]>([]);
  // const vaultActionsAddressesLoading = ref(false);
  // const vaultActionsAddressesError = ref<string | null>(null);
  // const getVaultActionsAddresses = async () => {
  //   vaultActionsAddressesError.value = null;
  //   vaultActionsAddressesLoading.value = true;
  //   const contract = initContractProvider();
  //   try {
  //     const responseActionsLength = await contract.getActionsLength();
  //     const actionsLength = formatUnits(responseActionsLength, 0);
  //     const actions = new Array(actionsLength);
  //     for (let i = 0; i < actions.length; i++) {
  //       const act = await contract.getAction(i);

  //       actions.push(act);
  //     }
  //     vaultActionsAddresses.value = actions;
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error
  //         ? `Cannot get vault actions addresses: ${error.message}`
  //         : `Cannot get vault actions addresses: ${error}`;

  //     vaultActionsAddressesError.value = errorMessage;
  //     throw new Error(errorMessage);
  //   } finally {
  //     vaultActionsAddressesLoading.value = false;
  //   }
  // };

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

  onMounted(async () => {
    await fetchInfo();
  });

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
