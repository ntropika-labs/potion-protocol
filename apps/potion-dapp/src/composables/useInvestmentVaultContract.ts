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

  onMounted(async () => {
    if (unref(address)) {
      await Promise.all([
        getOperator(),
        getAdmin(),
        getStrategist(),
        getPrincipalPercentages(),
      ]);
    }
  });

  if (isRef(address)) {
    watch(address, async () => {
      if (unref(address)) {
        Promise.all([
          getOperator(),
          getAdmin(),
          getStrategist(),
          getPrincipalPercentages(),
        ]);
      }
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
  };
}
