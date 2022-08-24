import type {
  ContractReceipt,
  ContractTransaction,
} from "@ethersproject/contracts";
import type {
  HedgingVaultOperatorHelper,
  IUniswapV3Oracle,
} from "@potion-protocol/hedging-vault/typechain";
import { utils } from "ethers";
import { onMounted, ref } from "vue";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";
import { HedgingVaultOperatorHelper__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "./useEthersContract";

import type { BigNumberish } from "@ethersproject/bignumber";
import type { IPotionLiquidityPool } from "@potion-protocol/hedging-vault/typechain";
import type { PotionBuyInfoStruct } from "@potion-protocol/hedging-vault/typechain/contracts/helpers/HedgingVaultOperatorHelper";
import type { Token } from "dapp-types";

export interface UniSwapInfo {
  steps: Array<{ inputToken: Token; fee: number }>;
  outputToken: Token;
  expectedPriceRate: BigNumberish; //The expected price of the swap as a fixed point SD59x18 number
}

interface PotionBuyInfo {
  targetPotionAddress: string;
  underlyingAsset: string;
  strikePriceInUSDC: string;
  expirationTimestamp: BigNumberish;
  sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
  expectedPremiumInUSDC: string;
  totalSizeInPotions: BigNumberish;
}
export type VaultStatus = "locked" | "unlocked" | "suspended";

export function getEncodedSwapPath(tokensPath: string[], fee = 3000): string {
  const types = [];
  const values = [];

  for (let i = 0; i < tokensPath.length; i++) {
    types.push("address");
    values.push(tokensPath[i]);

    if (i !== tokensPath.length - 1) {
      types.push("uint24");
      values.push(fee);
    }
  }

  return utils.solidityPack(types, values);
}

export function toPRBMath(
  numberRepresentation: string,
  inputDecimals = 18,
  outputDecimals = 18
): BigNumber {
  if (inputDecimals === outputDecimals) {
    return parseUnits(numberRepresentation);
  } else if (inputDecimals > outputDecimals) {
    return parseUnits(numberRepresentation).div(
      BigNumber.from(10).pow(inputDecimals - outputDecimals)
    );
  } else {
    return parseUnits(numberRepresentation).mul(
      BigNumber.from(10).pow(outputDecimals - inputDecimals)
    );
  }
}

export function useHedgingVaultOperatorHelperContract() {
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
  const getSwapData = (
    swapInfo: UniSwapInfo
  ): IUniswapV3Oracle.SwapInfoStruct => {
    //TODO: also cover multihop swap case [ input token, [token, fee]|fee, output token]
    const inputToken = swapInfo.steps[0].inputToken;
    if (!inputToken) throw new Error("At list 1 hop is required for the swap");

    const expectedPriceRate = toPRBMath(
      swapInfo.expectedPriceRate.toString(),
      inputToken.decimals,
      swapInfo.outputToken.decimals
    );
    let swapPath = "";
    if (!(expectedPriceRate.isNegative() || expectedPriceRate.isZero())) {
      swapPath = getEncodedSwapPath(
        [inputToken.address, swapInfo.outputToken.address],
        swapInfo.steps[0].fee
      );
    } else {
      // TODO: when expectedPriceRate is 0 the currentPayout is also 0
      // signal to the contract we don't have a swap path
    }
    const swapData: IUniswapV3Oracle.SwapInfoStruct = {
      inputToken: inputToken.address,
      outputToken: swapInfo.outputToken.address,
      //TODO: !ONLY FOR TEST need to be the same as the price of the underlying asset at expiration date so the swap gives us the correct amount of underlying asset
      expectedPriceRate: expectedPriceRate,
      swapPath: swapPath,
    };

    console.log("swapData", swapData);
    console.log(
      "expectedPriceRate to String: ",
      swapData.expectedPriceRate.toString()
    );
    return swapData;
  };

  //Enter Position
  const enterPositionTx = ref<ContractTransaction | null>(null);
  const enterPositionReceipt = ref<ContractReceipt | null>(null);
  const enterPositionLoading = ref(false);
  const enterPositionError = ref<string | null>(null);
  const enterPosition = async (
    swapInfo: UniSwapInfo,
    potionBuyInfo: PotionBuyInfo
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        enterPositionError.value = null;
        enterPositionLoading.value = true;

        const swapData = getSwapData(swapInfo);
        // Superseded by toPRBMath()
        // const divider = BigNumber.from(10).pow(12);
        // swapData.expectedPriceRate = BigNumber.from(
        //   swapData.expectedPriceRate
        // ).div(divider);
        const potionBuyActionData: PotionBuyInfoStruct = {
          targetPotionAddress: potionBuyInfo.targetPotionAddress,
          underlyingAsset: potionBuyInfo.underlyingAsset,
          strikePriceInUSDC: parseUnits(potionBuyInfo.strikePriceInUSDC, 8),
          expirationTimestamp: potionBuyInfo.expirationTimestamp,
          sellers: potionBuyInfo.sellers,
          expectedPremiumInUSDC: parseUnits(
            potionBuyInfo.expectedPremiumInUSDC,
            6
          ),
          totalSizeInPotions: potionBuyInfo.totalSizeInPotions,
        };

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
  const exitPosition = async (swapInfo: UniSwapInfo) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        exitPositionError.value = null;
        exitPositionLoading.value = true;

        const swapData = getSwapData(swapInfo);
        // Superseded by toPRBMath()
        // const multiplier = BigNumber.from(10).pow(12);
        // swapData.expectedPriceRate = BigNumber.from(
        //   swapData.expectedPriceRate
        // ).mul(multiplier);
        console.log("swapData: ", swapData);
        exitPositionTx.value = await contractSigner.exitPosition(swapData);
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
