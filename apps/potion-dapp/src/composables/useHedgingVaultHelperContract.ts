import { onMounted, ref } from "vue";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { useOnboard } from "@onboard-composable";
import { HedgingVaultOperatorHelper__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "./useEthersContract";

import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import type {
  HedgingVaultOperatorHelper,
  IUniswapV3Oracle,
} from "@potion-protocol/hedging-vault/typechain";
// TODO: fix types
// export interface UniSwapInfo {
//   inputToken: Token;
//   outputToken: Token;
//   expectedPriceRate: any; //The expected price of the swap as a fixed point SD59x18 number
//   swapPath: {
//     input: string;
//     hops?: { poolAddress: string; fee: number };
//     output: string;
//   };
// }

export function useHedgingVaultHelperContract() {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();
  const { InvestmentVault } = contractsAddresses;

  //Provider initialization
  const initContractSigner = () => {
    return initContract(
      true,
      false,
      HedgingVaultOperatorHelper__factory,
      InvestmentVault.address.toLowerCase()
    ) as HedgingVaultOperatorHelper;
  };

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      HedgingVaultOperatorHelper__factory,
      InvestmentVault.address.toLowerCase()
    ) as HedgingVaultOperatorHelper;
  };

  /**
   * Contract Vars
   */

  const hedgingVaultAddress = ref("");
  const actionsAddress = ref("");

  onMounted(async () => {
    const provider = initContractProvider();
    hedgingVaultAddress.value = await provider.hedgingVault();
    actionsAddress.value = await provider.potionBuyAction();
  });
  //

  /**
   * Contract methods
   **/

  //Enter Position
  const enterPositionTx = ref<ContractTransaction | null>(null);
  const enterPositionReceipt = ref<ContractReceipt | null>(null);
  const enterPositionLoading = ref(false);
  const enterPositionError = ref<string | null>(null);
  const enterPosition = async (swapInfo: any, potionBuyInfo: any) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        enterPositionLoading.value = true;
        // const swapPath: any = {}; TODO: convert to kekkac encoded [ input, [pool, fee]|fee, output]
        const swapData: IUniswapV3Oracle.SwapInfoStruct = {
          inputToken: swapInfo.inputToken.address,
          outputToken: swapInfo.outputToken.address,
          expectedPriceRate: swapInfo.expectedPriceRate,
          swapPath: swapInfo,
        };
        enterPositionTx.value = await contractSigner.enterPosition(
          swapData,
          potionBuyInfo
        );
        enterPositionReceipt.value = await enterPositionTx.value.wait();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `Cannot enter Position: ${error.message}`
            : "Cannot enter Position";
        enterPositionError.value = errorMessage;

        throw new Error(errorMessage);
      } finally {
        enterPositionLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };

  //Exit Position
  const exitPositionTx = ref<ContractTransaction | null>(null);
  const exitPositionReceipt = ref<ContractReceipt | null>(null);
  const exitPositionLoading = ref(false);
  const exitPositionError = ref<string | null>(null);
  const exitPosition = async (swapInfo: any) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        exitPositionLoading.value = true;
        exitPositionTx.value = await contractSigner.exitPosition(swapInfo);
        exitPositionReceipt.value = await exitPositionTx.value.wait();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `Cannot exit Position: ${error.message}`
            : "Cannot exit Position";
        exitPositionError.value = errorMessage;

        throw new Error(errorMessage);
      } finally {
        exitPositionLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };

  //Can be entered
  const canPositionBeEntered = ref(false);
  const canPositionBeEnteredLoading = ref(false);
  const canPositionBeEnteredError = ref<string | null>(null);
  const fetchCanPositionBeEntered = async () => {
    try {
      canPositionBeEnteredLoading.value = true;

      const provider = initContractProvider();
      return await provider.canPositionBeEntered();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get current position: ${error.message}`
          : "Cannot get current position";
      canPositionBeEnteredError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      canPositionBeEnteredLoading.value = false;
    }
  };

  //Can be exited
  const canPositionBeExited = ref(false);
  const canPositionBeExitedLoading = ref(false);
  const canPositionBeExitedError = ref<string | null>(null);
  const fetchCanPositionBeExited = async () => {
    try {
      const provider = initContractProvider();
      return await provider.canPositionBeExited();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get current position: ${error.message}`
          : "Cannot get current position";
      canPositionBeExitedError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      canPositionBeExitedLoading.value = false;
    }
  };

  // Automatically fetch current position on composable init
  fetchCanPositionBeEntered();
  fetchCanPositionBeExited();

  return {
    enterPositionTx,
    enterPositionReceipt,
    enterPositionLoading,
    enterPositionError,
    enterPosition,
    exitPositionTx,
    exitPositionReceipt,
    exitPositionLoading,
    exitPositionError,
    exitPosition,
    canPositionBeEntered,
    canPositionBeEnteredLoading,
    canPositionBeEnteredError,
    fetchCanPositionBeEntered,
    canPositionBeExited,
    canPositionBeExitedLoading,
    canPositionBeExitedError,
    fetchCanPositionBeExited,
    hedgingVaultAddress,
    actionsAddress,
  };
}
