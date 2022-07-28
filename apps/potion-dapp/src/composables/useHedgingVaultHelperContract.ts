import { onMounted, ref } from "vue";

import { contractsAddresses, Swap } from "@/helpers/hedgingVaultContracts";
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
import type { PotionBuyInfoStruct } from "@potion-protocol/hedging-vault/typechain/contracts/helpers/HedgingVaultOperatorHelper";
import { parseUnits } from "@ethersproject/units";

export interface UniSwapInfo {
  steps: Array<{ inputTokenAddress: string; fee: number }>;
  outputTokenAddress: string;
  expectedPriceRate: number; //The expected price of the swap to convert to a fixed point SD59x18 number
}

export type VaultStatus = "locked" | "unlocked" | "suspended";

export function useHedgingVaultHelperContract() {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();
  const { HedgingVaultOperatorHelper } = contractsAddresses;

  //Provider initialization
  const initContractSigner = () => {
    return initContract(
      true,
      false,
      HedgingVaultOperatorHelper__factory,
      HedgingVaultOperatorHelper.address.toLowerCase()
    ) as HedgingVaultOperatorHelper;
  };

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      HedgingVaultOperatorHelper__factory,
      HedgingVaultOperatorHelper.address.toLowerCase()
    ) as HedgingVaultOperatorHelper;
  };

  /**
   * Contract Vars
   */

  const hedgingVaultAddress = ref("");
  const actionsAddress = ref("");

  //

  /**
   * Contract methods
   **/

  //Enter Position
  const enterPositionTx = ref<ContractTransaction | null>(null);
  const enterPositionReceipt = ref<ContractReceipt | null>(null);
  const enterPositionLoading = ref(false);
  const enterPositionError = ref<string | null>(null);
  const enterPosition = async (
    swapInfo: UniSwapInfo,
    potionBuyInfo: PotionBuyInfoStruct
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        enterPositionLoading.value = true;
        //TODO: also cover multihop swap case [ input token, [token, fee]|fee, output token]
        const swapPath = new Swap(
          swapInfo.steps[0].inputTokenAddress,
          swapInfo.steps[0].fee,
          swapInfo.outputTokenAddress
        );
        const swapData: IUniswapV3Oracle.SwapInfoStruct = {
          inputToken: swapInfo.steps[0].inputTokenAddress,
          outputToken: swapInfo.outputTokenAddress,
          expectedPriceRate: parseUnits(
            swapInfo.expectedPriceRate.toString(),
            18
          ),
          swapPath: swapPath.toKeccak256(),
        };
        const potionBuyActionData: PotionBuyInfoStruct = {
          targetPotionAddress: potionBuyInfo.targetPotionAddress,
          underlyingAsset: potionBuyInfo.underlyingAsset,
          strikePriceInUSDC: parseUnits(
            potionBuyInfo.strikePriceInUSDC.toString(),
            6
          ),
          expirationTimestamp: potionBuyInfo.expirationTimestamp,
          sellers: potionBuyInfo.sellers,
          expectedPremiumInUSDC: parseUnits(
            potionBuyInfo.expectedPremiumInUSDC.toString(),
            18
          ),
          totalSizeInPotions: parseUnits(
            potionBuyInfo.totalSizeInPotions.toString(),
            8
          ),
        };
        console.log(swapData, potionBuyInfo);
        enterPositionTx.value = await contractSigner.enterPosition(
          swapData,
          potionBuyActionData
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
      canPositionBeEnteredError.value = null;

      const provider = initContractProvider();
      canPositionBeEntered.value = await provider.canPositionBeEntered();
      console.log("canPositionBeEntered", canPositionBeEntered.value);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get current position: ${error.message}`
          : `Cannot get current position: ${error}`;
      canPositionBeEnteredError.value = errorMessage;

      //throw new Error(errorMessage);
      canPositionBeEntered.value = false;
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
      canPositionBeExitedLoading.value = true;
      canPositionBeExitedError.value = null;

      const provider = initContractProvider();
      canPositionBeExited.value = await provider.canPositionBeExited();

      console.log("canPositionBeExited", canPositionBeExited.value);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Cannot get current position: ${error.message}`
          : `Cannot get current position: ${error}`;
      canPositionBeExitedError.value = errorMessage;

      //throw new Error(errorMessage);
      canPositionBeExited.value = false;
    } finally {
      canPositionBeExitedLoading.value = false;
    }
  };

  // Automatically fetch current position on composable init
  onMounted(async () => {
    const provider = initContractProvider();
    hedgingVaultAddress.value = await provider.hedgingVault();
    actionsAddress.value = await provider.potionBuyAction();
    await fetchCanPositionBeEntered();
    await fetchCanPositionBeExited();
  });

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
