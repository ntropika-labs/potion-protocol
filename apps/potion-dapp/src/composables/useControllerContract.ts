import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import type { ControllerInterface } from "potion-contracts/typechain";

import { contractsAddresses } from "@/helpers/contracts";
import { ControllerInterface__factory } from "potion-contracts/typechain";
import { parseUnits } from "@ethersproject/units";
import { useEthersContract } from "./useEthersContract";
import { useOnboard } from "@onboard-composable";

import { ref } from "vue";

enum ActionType {
  OpenVault,
  MintShortOption,
  BurnShortOption,
  DepositLongOption,
  WithdrawLongOption,
  DepositCollateral,
  WithdrawCollateral,
  SettleVault,
  Redeem,
  Call,
  Liquidate,
}

const COLLATERAL_DECIMALS = 10 ** 6;

export function useControllerContract() {
  const { initContract } = useEthersContract();
  const { Controller } = contractsAddresses;
  const { connectedWallet } = useOnboard();

  //Provider initialization

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      ControllerInterface__factory,
      Controller.address.toLowerCase()
    ) as ControllerInterface;
  };

  const initContractSigner = () => {
    return initContract(
      true,
      false,
      ControllerInterface__factory,
      Controller.address.toLowerCase()
    ) as ControllerInterface;
  };

  const redeemTx = ref<ContractTransaction | null>(null);
  const redeemReceipt = ref<ContractReceipt | null>(null);
  const redeemLoading = ref(false);
  const redeem = async (
    oTokenAddress: string,
    amount: string,
    buyerAddress: string
  ) => {
    if (connectedWallet.value) {
      try {
        const controllerContract = initContractSigner();

        redeemLoading.value = true;
        const vault = await controllerContract.getAccountVaultCounter(
          buyerAddress
        );

        const redeemArgs = [
          {
            actionType: ActionType.Redeem,
            owner: buyerAddress,
            secondAddress: buyerAddress,
            asset: oTokenAddress,
            vaultId: vault.toString(),
            amount: parseUnits(amount, 8),
            index: "0",
            data: "0x0000000000000000000000000000000000000000",
          },
        ];
        redeemTx.value = await controllerContract.operate(redeemArgs);
        redeemReceipt.value = await redeemTx.value.wait();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot redeem: ${error.message}`);
        } else {
          throw new Error("Cannot redeem");
        }
      } finally {
        redeemLoading.value = false;
      }
    } else throw new Error("Connect your wallet first");
  };

  const getPayout = async (address: string, amount: string) => {
    try {
      const controllerContract = initContractProvider();

      const payout = await controllerContract.getPayout(
        address,
        parseUnits(amount, 8)
      );
      return payout.div(COLLATERAL_DECIMALS).toString();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get payout: ${error.message}`);
      } else {
        throw new Error("Cannot get payout");
      }
    }
  };

  const getPayouts = async (records: { address: string; amount: string }[]) => {
    try {
      const controllerContract = initContractProvider();

      const payoutsMap = new Map<string, string>();

      const promises = records.map(async ({ address, amount }) => {
        const payout = await controllerContract.getPayout(
          address,
          parseUnits(amount, 8)
        );
        payoutsMap.set(address, payout.div(COLLATERAL_DECIMALS).toString());
      });
      await Promise.allSettled(promises);

      return payoutsMap;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get payouts: ${error.message}`);
      } else {
        throw new Error("Cannot get payouts");
      }
    }
  };

  return {
    redeemTx,
    redeemReceipt,
    redeemLoading,
    redeem,
    getPayout,
    getPayouts,
  };
}
