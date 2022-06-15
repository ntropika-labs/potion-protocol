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
  OrderedCriteria
} from "contracts-math";
import { PotionLiquidityPool__factory } from "potion-contracts/typechain";
import { ref } from "vue";

import { useEthersProvider } from "@/composables/useEthersProvider";
import { useOtokenFactory } from "@/composables/useOtokenFactory";
import { contractsAddresses } from "@/helpers/contracts";
import { createValidExpiry } from "@/helpers/time";
import { parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";

import { useEthersContract } from "./useEthersContract";

export type PoolIdentifierStruct = PotionLiquidityPool.PoolIdentifierStruct;

const { getTargetOtokenAddress, getOtoken } = useOtokenFactory();

export function usePotionLiquidityPoolContract() {
  const { initContract } = useEthersContract();
  const { PotionLiquidityPool, PotionTestUSD } = contractsAddresses;
  const { connectedWallet } = useOnboard();
  console.log(connectedWallet.value);

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
          PotionTestUSD.address,
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
      return refund.toNumber();
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
          refundMap.set(otoken, refund.toNumber());
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
    }
    throw new Error("Connect your wallet first");
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
    }
    throw new Error("Connect your wallet first");
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
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error buying from otoken with address ${oTokenAddress}: ${error.message}`
          );
        }
        throw new Error(
          `Error buying from otoken with address ${oTokenAddress}`
        );
      }
    }
    throw new Error("Connect your wallet first");
  };

  const createAndBuyOtokens = async (
    underlyingAddress: string,
    strikeAddress = PotionTestUSD.address.toLowerCase(),
    collateralAddress = PotionTestUSD.address.toLowerCase(),
    strikePrice: number,
    duration: number,
    isPut: true,
    counterparties: CounterpartyDetails[],
    maxPremium: number
  ) => {
    if (connectedWallet.value) {
      try {
        buyPotionLoading.value = true;

        const { getBlock, blockTimestamp } = useEthersProvider();
        await getBlock("latest");
        const validExpiry = createValidExpiry(blockTimestamp.value, duration);
        const contractSigner = initContractSigner();

        const maxPremiumToBigNumber = parseUnits(maxPremium.toFixed(6), 6);
        console.log(maxPremiumToBigNumber);
        const strikePriceToBigNumber = parseUnits(strikePrice.toFixed(6), 6);
        console.log(strikePriceToBigNumber);
        buyPotionTx.value = await contractSigner.createAndBuyOtokens(
          underlyingAddress,
          strikeAddress,
          collateralAddress,
          strikePriceToBigNumber,
          validExpiry,
          isPut,
          counterparties,
          maxPremiumToBigNumber
        );
        buyPotionReceipt.value = await buyPotionTx.value.wait();
        buyPotionLoading.value = false;
      } catch (error) {
        buyPotionLoading.value = false;

        if (error instanceof Error) {
          throw new Error(`Error deploy and buy from otoken: ${error.message}`);
        }
        throw new Error(`Error deploy and buy otoken`);
      }
    }
    throw new Error("Connect your wallet first");
  };

  // Method to conditionally buy or create and buy otokens
  const buyPotions = async (
    counterparties: CounterpartyDetails[],
    maxPremium: number,
    oTokenAddress?: string,
    underlyingAddress?: string,
    strikePrice?: number,
    duration?: number,
    isPut = true,
    strikeAddress = PotionTestUSD.address.toLowerCase(),
    collateralAddress = PotionTestUSD.address.toLowerCase()
  ) => {
    if (oTokenAddress) {
      await buyOtokens(oTokenAddress, counterparties, maxPremium);
    } else if (
      underlyingAddress &&
      strikeAddress &&
      collateralAddress &&
      strikePrice &&
      duration &&
      isPut &&
      maxPremium
    ) {
      const newOtokenAddress = await getTargetOtokenAddress(
        underlyingAddress,
        strikeAddress,
        collateralAddress,
        strikePrice,
        duration,
        isPut
      );
      const existingOtokenAddress = await getOtoken(
        underlyingAddress,
        strikeAddress,
        collateralAddress,
        strikePrice,
        duration,
        isPut
      );
      const exists = newOtokenAddress === existingOtokenAddress;
      if (exists) {
        await buyOtokens(existingOtokenAddress, counterparties, maxPremium);
      } else {
        await createAndBuyOtokens(
          underlyingAddress,
          strikeAddress,
          collateralAddress,
          strikePrice,
          duration,
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
  };
}
