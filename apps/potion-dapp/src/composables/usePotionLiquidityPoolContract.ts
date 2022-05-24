import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import type { PotionLiquidityPool } from "potion-contracts/typechain";
import type { BondingCurveParams } from "dapp-types";

import {
  CurveCriteria,
  HyperbolicCurve,
  OrderedCriteria,
} from "contracts-math";
import { PotionLiquidityPool__factory } from "potion-contracts/typechain";
import { ref } from "vue";

import { contractsAddresses } from "@/helpers/contracts";
import { parseUnits } from "@ethersproject/units";

import { useEthersContract } from "./useEthersContract";
import { useOnboard } from "./useOnboard";

export function usePotionLiquidityPoolContract() {
  const { initContract } = useEthersContract();
  const { PotionLiquidityPool, PotionTestUSD } = contractsAddresses;
  const { connectedWallet } = useOnboard();

  //Provider initialization

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
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        depositAndCreateCurveAndCriteriaTx.value =
          await contractSigner.depositAndCreateCurveAndCriteria(
            poolId,
            parseUnits(amount.toString(), 6),
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
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        depositTx.value = await contractSigner.deposit(
          poolId,
          parseUnits(amount.toString(), 6)
        );
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
