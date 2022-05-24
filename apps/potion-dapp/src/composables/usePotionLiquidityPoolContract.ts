import {
  CurveCriteria,
  HyperbolicCurve,
  OrderedCriteria,
} from "contracts-math";
import { PotionLiquidityPool__factory } from "potion-contracts/typechain";
import { computed, ref, watch } from "vue";

import { contractsAddresses } from "@/helpers/contracts";

import { useEthersContract } from "./useEthersContract";
import { useOnboard } from "./useOnboard";

import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import type { PotionLiquidityPool } from "potion-contracts/typechain";
import type { BondingCurveParams } from "dapp-types";
export function usePotionLiquidityPoolContract() {
  const { initContract } = useEthersContract();
  const { PotionLiquidityPool, PotionTestUSD } = contractsAddresses;
  const { connectedWallet } = useOnboard();
  const walletConnected = computed(() => {
    return connectedWallet.value !== null;
  });

  //Provider initialization
  let contractSigner: PotionLiquidityPool | null = null;

  watch(connectedWallet, (connectedWallet) => {
    if (connectedWallet && connectedWallet.accounts[0].address) {
      contractSigner = initContract(
        true,
        false,
        PotionLiquidityPool__factory,
        PotionLiquidityPool.address.toLowerCase()
      ) as PotionLiquidityPool;
    }
  });

  // const contractProvider = initContract(
  //   false,
  //   false,
  //   PotionLiquidityPool__factory,
  //   PotionLiquidityPool.address.toLowerCase()
  // ) as PotionLiquidityPool;

  //Contract methods

  //Create Pool
  const depositAndCreateCurveAndCriteriaTx = ref<ContractTransaction | null>(
    null
  );
  const depositAndCreateCurveAndCriteriaReceipt = ref<ContractReceipt | null>(
    null
  );
  const depositAndCreateCurveAndCriteria = async (
    poolId: number,
    amount: number,
    bondingCurveParams: BondingCurveParams,
    criterias: {
      tokenAddress: string;
      maxStrike: number;
      maxDuration: number;
    }[]
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
          criteria.tokenAddress,
          PotionTestUSD.address,
          true,
          criteria.maxStrike,
          criteria.maxDuration
        )
    );
    const orderedCriteria = OrderedCriteria.from(curveCriterias);
    if (walletConnected.value && contractSigner) {
      try {
        depositAndCreateCurveAndCriteriaTx.value =
          await contractSigner.depositAndCreateCurveAndCriteria(
            poolId,
            amount,
            curve,
            orderedCriteria
          );
        depositAndCreateCurveAndCriteriaReceipt.value =
          await depositAndCreateCurveAndCriteriaTx.value.wait();
      } catch (error) {
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
  const deposit = async (poolId: number, amount: number) => {
    if (walletConnected.value && contractSigner) {
      try {
        depositTx.value = await contractSigner.deposit(poolId, amount);
        depositReceipt.value = await depositTx.value.wait();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot deposit: ${error.message}`);
        } else {
          throw new Error("Cannot deposit");
        }
      }
    } else throw new Error("Connect your wallet first");
  };
  return {
    depositAndCreateCurveAndCriteriaTx,
    depositAndCreateCurveAndCriteriaReceipt,
    depositAndCreateCurveAndCriteria,
    depositTx,
    depositReceipt,
    deposit,
  };
}
