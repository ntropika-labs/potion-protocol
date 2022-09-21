import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import type { PotionLiquidityPool } from "potion-contracts/typechain";
import type { BondingCurveParams, Criteria } from "dapp-types";
import type { CounterpartyDetails } from "potion-router/src/types";
import {
  CurveCriteria,
  HyperbolicCurve,
  OrderedCriteria,
} from "contracts-math";
import _chunk from "lodash.chunk";
import { PotionLiquidityPool__factory } from "potion-contracts/typechain";
import { ref } from "vue";

import { useEthersProvider } from "@/composables/useEthersProvider";
import { useOtokenFactory } from "@/composables/useOtokenFactory";
import { contractsAddresses } from "@/helpers/contracts";
import { createValidExpiry } from "@/helpers/time";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";

import { useEthersContract } from "./useEthersContract";

export type PoolIdentifierStruct = PotionLiquidityPool.PoolIdentifierStruct;

export function usePotionLiquidityPoolContract() {
  const { initContract } = useEthersContract();
  const { PotionLiquidityPool, USDC } = contractsAddresses;
  const { connectedWallet } = useOnboard();
  const maxCounterparties = 100;
  //Provider initialization

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      PotionLiquidityPool__factory,
      PotionLiquidityPool.address.toLowerCase()
    ) as PotionLiquidityPool;
  };

  const initContractSigner = () => {
    return initContract(
      true,
      false,
      PotionLiquidityPool__factory,
      PotionLiquidityPool.address.toLowerCase()
    ) as PotionLiquidityPool;
  };

  //Contract methods

  //Create Pool
  const depositAndCreateCurveAndCriteriaTx = ref<ContractTransaction | null>(
    null
  );
  const depositAndCreateCurveAndCriteriaReceipt = ref<ContractReceipt | null>(
    null
  );
  const depositAndCreateCurveAndCriteriaLoading = ref(false);
  const depositAndCreateCurveAndCriteria = async (
    poolId: number,
    amount: number,
    bondingCurveParams: BondingCurveParams,
    criterias: Criteria[]
  ) => {
    const curve = new HyperbolicCurve(
      bondingCurveParams["a"],
      bondingCurveParams["b"],
      bondingCurveParams["c"],
      bondingCurveParams["d"],
      bondingCurveParams["maxUtil"]
    ).asSolidityStruct();
    const curveCriterias = criterias.map(
      (criteria) =>
        new CurveCriteria(
          criteria.token.address,
          USDC.address,
          true,
          criteria.maxStrike,
          criteria.maxDuration
        )
    );
    const orderedCriteria = OrderedCriteria.from(curveCriterias);
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        depositAndCreateCurveAndCriteriaLoading.value = true;
        depositAndCreateCurveAndCriteriaTx.value =
          await contractSigner.depositAndCreateCurveAndCriteria(
            poolId,
            parseUnits(amount.toString(), 6),
            curve,
            orderedCriteria
          );
        depositAndCreateCurveAndCriteriaReceipt.value =
          await depositAndCreateCurveAndCriteriaTx.value.wait();
        depositAndCreateCurveAndCriteriaLoading.value = false;
      } catch (error) {
        depositAndCreateCurveAndCriteriaLoading.value = false;
        if (error instanceof Error) {
          throw new Error(`Cannot create the pool: ${error.message}`);
        } else {
          throw new Error("Cannot create the pool");
        }
      }
    } else throw new Error("Connect your wallet first");
  };

  //Deposit Collateral
  const depositTx = ref<ContractTransaction | null>(null);
  const depositReceipt = ref<ContractReceipt | null>(null);
  const depositLoading = ref(false);
  const deposit = async (poolId: number, amount: number) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        depositLoading.value = true;
        depositTx.value = await contractSigner.deposit(
          poolId,
          parseUnits(amount.toString(), 6)
        );
        depositReceipt.value = await depositTx.value.wait();
        depositLoading.value = false;
      } catch (error) {
        depositLoading.value = false;
        if (error instanceof Error) {
          throw new Error(`Cannot deposit: ${error.message}`);
        } else {
          throw new Error("Cannot deposit");
        }
      }
    } else throw new Error("Connect your wallet first");
  };

  //Withdraw Collateral
  const withdrawTx = ref<ContractTransaction | null>(null);
  const withdrawReceipt = ref<ContractReceipt | null>(null);
  const withdrawLoading = ref(false);
  const withdraw = async (poolId: number, amount: number) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        withdrawLoading.value = true;
        withdrawTx.value = await contractSigner.withdraw(
          poolId,
          parseUnits(amount.toString(), 6)
        );
        withdrawReceipt.value = await withdrawTx.value.wait();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot withdraw: ${error.message}`);
        } else {
          throw new Error("Cannot withdraw");
        }
      } finally {
        withdrawLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };

  // Outstanding settlement for a specific otoken and pool
  const getOutstandingSettlement = async (
    otoken: string,
    pool: PoolIdentifierStruct
  ) => {
    try {
      const provider = initContractProvider();
      const refund = await provider.outstandingSettlement(otoken, pool);
      return parseFloat(formatUnits(refund, 6));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get outstanding settlement: ${error.message}`);
      } else {
        throw new Error("Cannot get outstanding settlement");
      }
    }
  };

  const getOutstandingSettlements = async (
    otokens: string[],
    pool: PoolIdentifierStruct
  ) => {
    try {
      const provider = initContractProvider();
      const refundMap = new Map<string, number>();
      await Promise.allSettled(
        otokens.map(async (otoken) => {
          const refund = await provider.outstandingSettlement(otoken, pool);
          refundMap.set(otoken, parseFloat(formatUnits(refund, 6)));
        })
      );
      return refundMap;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get outstanding settlement: ${error.message}`);
      } else {
        throw new Error("Cannot get outstanding settlement");
      }
    }
  };

  // Otoken settlement
  // settle
  const settleTx = ref<ContractTransaction | null>(null);
  const settleReceipt = ref<ContractReceipt | null>(null);
  const settleLoading = ref(false);
  const settle = async (address: string) => {
    if (connectedWallet.value) {
      try {
        settleLoading.value = true;
        const contractSigner = initContractSigner();
        settleTx.value = await contractSigner.settleAfterExpiry(address);
        settleReceipt.value = await settleTx.value.wait();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Cannot settle the otoken ${address}: ${error.message}`
          );
        }
        throw new Error(`Cannot settle the otoken ${address}`);
      } finally {
        settleLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };
  // Is settled
  const isSettled = async (address: string) => {
    try {
      const contractProvider = initContractProvider();
      return await contractProvider.isSettled(address);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Cannot check if the address is settled: ${error.message}`
        );
      }
      throw new Error(`Cannot check if the address is settled`);
    }
  };

  // Claim Collateral
  const claimCollateralTx = ref<ContractTransaction | null>(null);
  const claimCollateralReceipt = ref<ContractReceipt | null>(null);
  const claimCollateralLoading = ref(false);
  const claimCollateral = async (
    otoken: string,
    pools: PoolIdentifierStruct[]
  ) => {
    if (connectedWallet.value) {
      try {
        claimCollateralLoading.value = true;
        const contractSigner = initContractSigner();
        const settled = await isSettled(otoken);
        if (settled) {
          claimCollateralTx.value = await contractSigner.redistributeSettlement(
            otoken,
            pools
          );
        } else {
          claimCollateralTx.value =
            await contractSigner.settleAndRedistributeSettlement(otoken, pools);
        }
        claimCollateralReceipt.value = await claimCollateralTx.value.wait();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Cannot check if the address is settled: ${error.message}`
          );
        }
        throw new Error(`Cannot check if the address is settled`);
      } finally {
        claimCollateralLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };

  //Buy Potions
  const buyPotionTx = ref<ContractTransaction | null>(null);
  const buyPotionReceipt = ref<ContractReceipt | null>(null);
  const buyPotionLoading = ref(false);
  const buyOtokens = async (
    oTokenAddress: string,
    counterparties: CounterpartyDetails[],
    maxPremium: number
  ) => {
    if (connectedWallet.value) {
      try {
        buyPotionLoading.value = true;
        const contractSigner = initContractSigner();
        const maxPremiumToBigNumber = parseUnits(maxPremium.toFixed(6), 6);
        buyPotionTx.value = await contractSigner.buyOtokens(
          oTokenAddress,
          counterparties,
          maxPremiumToBigNumber
        );
        buyPotionReceipt.value = await buyPotionTx.value.wait();
        return buyPotionReceipt.value;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error buying from otoken with address ${oTokenAddress}: ${error.message}`
          );
        }
        throw new Error(
          `Error buying from otoken with address ${oTokenAddress}`
        );
      } finally {
        buyPotionLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };

  const createAndBuyOtokens = async (
    underlyingAddress: string,
    strikeAddress = USDC.address.toLowerCase(),
    collateralAddress = USDC.address.toLowerCase(),
    strikePrice: number,
    expiry: number,
    isPut: true,
    counterparties: CounterpartyDetails[],
    maxPremium: number
  ) => {
    if (connectedWallet.value) {
      try {
        buyPotionLoading.value = true;

        const contractSigner = initContractSigner();

        const maxPremiumToBigNumber = parseUnits(maxPremium.toFixed(6), 6);
        const strikePriceToBigNumber = parseUnits(strikePrice.toFixed(8), 8);

        buyPotionTx.value = await contractSigner.createAndBuyOtokens(
          underlyingAddress,
          strikeAddress,
          collateralAddress,
          strikePriceToBigNumber,
          expiry,
          isPut,
          counterparties,
          maxPremiumToBigNumber
        );
        buyPotionReceipt.value = await buyPotionTx.value.wait();
        buyPotionLoading.value = false;
        return buyPotionReceipt.value;
      } catch (error) {
        buyPotionLoading.value = false;

        if (error instanceof Error) {
          throw new Error(`Error deploy and buy from otoken: ${error.message}`);
        }
        throw new Error(`Error deploy and buy otoken`);
      }
    } else throw new Error("Connect your wallet first");
  };

  /**
   * Method to conditionally buy or create and buy otokens
   * if the number of counterparties is > maxCounterparties, we split the order by chunking the counterparties by 100
   * This is done to prevent gas limits to be hit. It's to be considered an hack solution for a very edge case considering the ethereum network and how the router works.
   * @param counterparties
   * @param maxPremium
   * @param oTokenAddress
   * @param underlyingAddress
   * @param strikePrice
   * @param duration
   * @param isPut
   * @param strikeAddress
   * @param collateralAddress
   */
  const buyPotions = async (
    counterparties: CounterpartyDetails[],
    maxPremium: number,
    oTokenAddress?: string,
    underlyingAddress?: string,
    strikePrice?: number,
    duration?: number,
    isPut = true,
    strikeAddress = USDC.address.toLowerCase(),
    collateralAddress = USDC.address.toLowerCase()
  ) => {
    const contractSigner = initContractSigner();
    const contractInterface = contractSigner.interface;
    // if you're trying to buy from an oToken you know and the counterparties are less than 100, run normally
    if (oTokenAddress && counterparties.length <= maxCounterparties) {
      await buyOtokens(oTokenAddress, counterparties, maxPremium);
    } else if (oTokenAddress && counterparties.length > maxCounterparties) {
      // else, chunk the counterparties and create a tx for each of the chunks
      const cpChunks = _chunk(counterparties, maxCounterparties);
      let newMaxPremium = 0;
      for (const chunk of cpChunks) {
        const receipt = await buyOtokens(
          oTokenAddress,
          chunk,
          maxPremium - newMaxPremium
        );
        const log = contractInterface.parseLog(
          receipt.logs[receipt.logs.length - 1]
        );
        newMaxPremium = newMaxPremium - parseFloat(formatUnits(log.args[3], 6));
      }
      //if we do not pass otokenaddress, this means that we want to know if the otoken exists before creating it
    } else if (
      underlyingAddress &&
      strikeAddress &&
      collateralAddress &&
      strikePrice &&
      duration &&
      isPut &&
      maxPremium
    ) {
      // if we don't know the otokenaddress, we need to check if an otoken with the same parameters exists
      // and calculate the valid expiration for it
      const { getTargetOtokenAddress, getOtoken } = useOtokenFactory();
      const { getBlock, blockTimestamp } = useEthersProvider();
      await getBlock("latest");
      const validExpiry = createValidExpiry(blockTimestamp.value, duration);
      const newOtokenAddress = await getTargetOtokenAddress(
        underlyingAddress,
        strikeAddress,
        collateralAddress,
        strikePrice,
        validExpiry,
        isPut
      );
      const existingOtokenAddress = await getOtoken(
        underlyingAddress,
        strikeAddress,
        collateralAddress,
        strikePrice,
        validExpiry,
        isPut
      );
      // getOtokens returns 0x0000... if the otoken does not exist and it return a valid address if it exists
      // getTargetOtokenAddress creates a valid address for an hypotetical otoken. If the addresses are the same, the otoken exists
      const exists = newOtokenAddress === existingOtokenAddress;
      // if we hit the counterparties limit we chunk them
      if (counterparties.length > maxCounterparties) {
        const cpChunks = _chunk(counterparties, maxCounterparties);
        //if the otoken exists, we fire n TX by calling buyOtokens
        if (exists) {
          let newMaxPremium = 0;
          for (const chunk of cpChunks) {
            const receipt = await buyOtokens(
              existingOtokenAddress,
              chunk,
              maxPremium - newMaxPremium
            );
            const log = contractInterface.parseLog(
              receipt.logs[receipt.logs.length - 1]
            );
            newMaxPremium =
              newMaxPremium - parseFloat(formatUnits(log.args[3], 6));
          }
        } else {
          //if the otoken doesn't exist, we need to create one with the first tx by selecting the first counterparty
          let newMaxPremium = 0;
          const receipt = await createAndBuyOtokens(
            underlyingAddress,
            strikeAddress,
            cpChunks[0],
            strikePrice,
            validExpiry,
            isPut,
            counterparties,
            maxPremium - newMaxPremium
          );
          const log = contractInterface.parseLog(
            receipt.logs[receipt.logs.length - 1]
          );
          newMaxPremium =
            newMaxPremium - parseFloat(formatUnits(log.args[3], 6));
          // we get the address of the otoken created above
          const existingOtokenAddress = await getOtoken(
            underlyingAddress,
            strikeAddress,
            collateralAddress,
            strikePrice,
            validExpiry,
            isPut
          );
          // we can then buy from that otoken by starting from the second counterparty
          for (let index = 1; index < cpChunks.length; index++) {
            const receipt = await buyOtokens(
              existingOtokenAddress,
              cpChunks[index],
              maxPremium - newMaxPremium
            );
            const log = contractInterface.parseLog(
              receipt.logs[receipt.logs.length - 1]
            );
            newMaxPremium =
              newMaxPremium + parseFloat(formatUnits(log.args[3], 6));
          }
        }
        //we buy the otoken with the address calculated before
      } else if (exists) {
        await buyOtokens(existingOtokenAddress, counterparties, maxPremium);
        // we buy the otoken by creating it
      } else {
        await createAndBuyOtokens(
          underlyingAddress,
          strikeAddress,
          collateralAddress,
          strikePrice,
          validExpiry,
          isPut,
          counterparties,
          maxPremium
        );
      }
    }
  };

  return {
    // deposit and create
    depositAndCreateCurveAndCriteriaTx,
    depositAndCreateCurveAndCriteriaReceipt,
    depositAndCreateCurveAndCriteriaLoading,
    depositAndCreateCurveAndCriteria,
    // deposit
    depositTx,
    depositReceipt,
    depositLoading,
    deposit,
    // withdraw
    withdrawTx,
    withdrawReceipt,
    withdrawLoading,
    withdraw,
    // claim collateral
    claimCollateralTx,
    claimCollateralReceipt,
    claimCollateralLoading,
    claimCollateral,
    // settle
    settleTx,
    settleReceipt,
    settleLoading,
    settle,
    // outstanding settlement
    getOutstandingSettlement,
    getOutstandingSettlements,
    // BuyPotions
    buyPotionTx,
    buyPotionReceipt,
    buyPotionLoading,
    buyOtokens,
    createAndBuyOtokens,
    buyPotions,
    maxCounterparties,
  };
}
