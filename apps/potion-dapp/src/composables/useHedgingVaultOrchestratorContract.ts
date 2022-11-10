import type {
  ContractReceipt,
  ContractTransaction,
} from "@ethersproject/contracts";
import type {
  HedgingVaultOrchestrator,
  IUniswapV3Oracle,
} from "@potion-protocol/hedging-vault/typechain";
import { utils } from "ethers";
import { getRateInUD60x18 } from "hedging-vault-sdk";
import { onMounted, ref, unref } from "vue";

import { getContractsFromVault } from "@/helpers/hedgingVaultContracts";
import { parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";
import { HedgingVaultOrchestrator__factory } from "@potion-protocol/hedging-vault/typechain";

import { useEthersContract } from "./useEthersContract";

import type { PotionBuyInfoStruct } from "@potion-protocol/hedging-vault/typechain/contracts/helpers/HedgingVaultOrchestrator";
import type { PotionBuyInfo, UniSwapInfo } from "@/types";
import type { MaybeRef } from "@vueuse/core";

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

export function useHedgingVaultOrchestratorContract(
  vaultAddress: MaybeRef<string>
) {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();
  const { HedgingVaultOrchestrator } = getContractsFromVault(
    unref(vaultAddress)
  );

  //Provider initialization
  const initContractSigner = () => {
    return initContract(
      true,
      false,
      HedgingVaultOrchestrator__factory,
      HedgingVaultOrchestrator
    ) as HedgingVaultOrchestrator;
  };

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      HedgingVaultOrchestrator__factory,
      HedgingVaultOrchestrator
    ) as HedgingVaultOrchestrator;
  };

  const getSwapData = (
    swapInfo: UniSwapInfo
  ): IUniswapV3Oracle.SwapInfoStruct => {
    //TODO: also cover multihop swap case [ input token, [token, fee]|fee, output token]
    const inputToken = swapInfo.steps[0].inputToken;
    if (!inputToken) throw new Error("At list 1 hop is required for the swap");

    const expectedPriceRate = getRateInUD60x18(
      parseFloat(swapInfo.expectedPriceRate.toString()),
      1,
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
      swapPath = getEncodedSwapPath(
        [inputToken.address, swapInfo.outputToken.address],
        0
      );
    }
    const swapData: IUniswapV3Oracle.SwapInfoStruct = {
      inputToken: inputToken.address,
      outputToken: swapInfo.outputToken.address,
      //TODO: !ONLY FOR TEST need to be the same as the price of the underlying asset at expiration date so the swap gives us the correct amount of underlying asset
      expectedPriceRate: expectedPriceRate,
      swapPath: swapPath,
    };
    return swapData;
  };

  const getPotionBuyActionData = (
    potionBuyInfo: PotionBuyInfo
  ): PotionBuyInfoStruct => {
    console.log("potionBuyInfo", potionBuyInfo);

    return {
      sellers: potionBuyInfo.sellers,
      targetPotionAddress: potionBuyInfo.targetPotionAddress,
      underlyingAsset: potionBuyInfo.underlyingAsset,
      strikePriceInUSDC: parseUnits(
        potionBuyInfo.strikePriceInUSDC.toFixed(8), // 8 digits are required for the strike price
        8
      ),
      expirationTimestamp: potionBuyInfo.expirationTimestamp,
      expectedPremiumInUSDC: parseUnits(
        potionBuyInfo.expectedPremiumInUSDC.toFixed(6),
        6
      ),
    };
  };

  /**
   * Contract Vars
   */

  const actionsAddress = ref("");

  //

  /**
   * Contract methods
   **/

  //Next Round
  const nextRoundTx = ref<ContractTransaction | null>(null);
  const nextRoundReceipt = ref<ContractReceipt | null>(null);
  const nextRoundLoading = ref(false);
  const nextRoundError = ref<string | null>(null);
  const enterNextRound = async (
    enterSwapInfo: UniSwapInfo,
    enterPotionBuyInfo: PotionBuyInfo,
    exitSwapInfo: UniSwapInfo,
    fallbackEnterSwapInfoUSDC: UniSwapInfo,
    fallbackExitSwapInfoUSDC: UniSwapInfo
  ) => {
    if (!connectedWallet.value) {
      throw new Error("Connect your wallet first");
    }

    try {
      const contractSigner = initContractSigner();
      nextRoundError.value = null;
      nextRoundLoading.value = true;

      const enterSwapData = getSwapData(enterSwapInfo),
        exitSwapData = getSwapData(exitSwapInfo),
        fallbackEnterSwapData = getSwapData(fallbackEnterSwapInfoUSDC),
        fallbackExitSwapData = getSwapData(fallbackExitSwapInfoUSDC);

      const potionBuyActionData = getPotionBuyActionData(enterPotionBuyInfo);

      console.log(
        "FINAL DATA",
        potionBuyActionData,
        enterSwapData,
        exitSwapData,
        fallbackEnterSwapData,
        fallbackExitSwapData
      );
      nextRoundTx.value = await contractSigner.nextRound(
        exitSwapData,
        potionBuyActionData,
        enterSwapData,
        fallbackExitSwapData,
        fallbackEnterSwapData
      );
      nextRoundReceipt.value = await nextRoundTx.value.wait();
    } catch (error) {
      const errorMessage = `Cannot enter NextRound: ${
        error instanceof Error ? error.message : error
      }`;
      nextRoundError.value = errorMessage;

      throw new Error(errorMessage);
    } finally {
      nextRoundLoading.value = false;
    }
  };

  // Can next cycle
  const canEnterNextRound = ref(false);
  const canEnterNextRoundLoading = ref(false);
  const canEnterNextRoundError = ref<string | null>(null);
  const fetchCanEnterNextRound = async () => {
    try {
      canEnterNextRoundLoading.value = true;
      canEnterNextRoundError.value = null;

      const provider = initContractProvider();
      canEnterNextRound.value = await provider.canEnterNextRound();
    } catch (error) {
      const errorMessage = `Cannot enter next cycle: ${
        error instanceof Error ? error.message : error
      }`;
      canEnterNextRoundError.value = errorMessage;
      canEnterNextRound.value = false;
      throw new Error(errorMessage);
    } finally {
      canEnterNextRoundLoading.value = false;
    }
  };

  // Automatically fetch current position on composable init
  onMounted(async () => {
    const provider = initContractProvider();
    //hedgingVaultAddress.value = await provider.hedgingVault();
    actionsAddress.value = await provider.potionBuyAction();

    await fetchCanEnterNextRound();
  });

  return {
    nextRoundTx,
    nextRoundReceipt,
    nextRoundLoading,
    nextRoundError,
    canEnterNextRound,
    enterNextRound,
    fetchCanEnterNextRound,
    //hedgingVaultAddress,
    actionsAddress,
  };
}
