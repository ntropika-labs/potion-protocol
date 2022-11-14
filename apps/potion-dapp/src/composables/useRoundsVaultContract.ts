import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import { isRef, onMounted, ref, unref, watch } from "vue";

import { useErc20Contract } from "@/composables/useErc20Contract";
import { useEthersContract } from "@/composables/useEthersContract";
import { ContractInitError } from "@/helpers/errors";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";
import { BaseRoundsVaultUpgradeable__factory } from "@potion-protocol/hedging-vault/typechain";

import type { BaseRoundsVaultUpgradeable } from "@potion-protocol/hedging-vault/typechain";
import type { Ref } from "vue";
import type { BigNumberish } from "ethers";
export function useRoundsVaultContract(
  address: string | Ref<string>,
  asset: string | Ref<string>,
  fetchInitialData = true
) {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();

  const initContractSigner = () => {
    return initContract(
      true,
      false,
      BaseRoundsVaultUpgradeable__factory,
      unref(address).toLowerCase()
    ) as BaseRoundsVaultUpgradeable;
  };

  const initContractProvider = () => {
    try {
      return initContract(
        false,
        false,
        BaseRoundsVaultUpgradeable__factory,
        unref(address).toLowerCase()
      ) as BaseRoundsVaultUpgradeable;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? "Unable to init contract: " + error.message
          : "Unable to init contract";

      throw new ContractInitError(errorMessage);
    }
  };

  const {
    name: assetName,
    symbol: assetSymbol,
    // image: assetImage,
    decimals: assetDecimals,
    userAllowance: assetUserAllowance,
    // fetchUserAllowanceLoading: assetFetchUserAllowanceLoading,
    fetchUserAllowance: assetFetchUserAllowance,
    approveLoading: assetApproveLoading,
    approveTx: assetApproveTx,
    approveReceipt: assetApproveReceipt,
    approveSpending,
    fetchErc20Info: assetFetchErc20Info,
  } = useErc20Contract(asset, false);

  const balanceOfLoading = ref(false);
  const balanceOf = async (address: string, id: number) => {
    try {
      balanceOfLoading.value = true;
      const contract = initContractProvider();
      const balance = await contract.balanceOf(address, id);

      return balance;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the balance: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the balance`);
      }
    } finally {
      balanceOfLoading.value = false;
    }
  };

  const getExchangeRate = async (round: number) => {
    try {
      const contract = initContractProvider();
      const rate = await contract.getExchangeRate(round);
      return formatUnits(rate);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the exchange rate: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the exchange rate`);
      }
    }
  };

  const currentRound = ref("0");
  const getCurrentRound = async () => {
    try {
      const contract = initContractProvider();
      const response = await contract.getCurrentRound();
      currentRound.value = formatUnits(response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the current round: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the current round`);
      }
    }
  };
  const balanceOfAllLoading = ref(false);
  const balanceOfAll = async (address: string) => {
    try {
      balanceOfAllLoading.value = true;
      const contract = initContractProvider();
      const balance = await contract.balanceOfAll(address);
      return balance;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the balance: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the balance`);
      }
    } finally {
      balanceOfAllLoading.value = false;
    }
  };

  const balanceOfBatchLoading = ref(false);
  const balanceOfBatch = async (addresses: string[], ids: number[]) => {
    try {
      balanceOfBatchLoading.value = true;
      const contract = initContractProvider();
      const balances = await contract.balanceOfBatch(addresses, ids);
      return balances;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the balance: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the balance`);
      }
    } finally {
      balanceOfBatchLoading.value = false;
    }
  };

  const isApprovedForAll = ref(false);
  const getIsApprovedForAllLoading = ref(false);
  const getIsApprovedForAll = async (account: string, operator: string) => {
    try {
      getIsApprovedForAllLoading.value = true;
      const contract = initContractProvider();
      const isApproved = await contract.isApprovedForAll(account, operator);
      isApprovedForAll.value = isApproved;
      return isApproved;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the balance: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the balance`);
      }
    } finally {
      getIsApprovedForAllLoading.value = false;
    }
  };

  const setApprovalForAllLoading = ref(false);
  const setApprovalForAllTx = ref<ContractTransaction | null>(null);
  const setApprovalForAllReceipt = ref<ContractReceipt | null>(null);
  const setApprovalForAll = async (operator: string, approved: boolean) => {
    try {
      setApprovalForAllLoading.value = true;
      const contract = initContractSigner();
      const tx = await contract.setApprovalForAll(operator, approved);
      setApprovalForAllTx.value = tx;
      const receipt = await tx.wait();
      setApprovalForAllReceipt.value = receipt;
      isApprovedForAll.value = approved;
      return receipt;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the balance: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the balance`);
      }
    } finally {
      setApprovalForAllLoading.value = false;
    }
  };

  /**
   * For the Input Vault, we will need to approve the RoundsInputVault contract to spend the Underlying Address
   * ex: underlyingAssetContract.approve(RoundsInputVault.address, amount)
   *
   * For the Output Vault, we will need to approve the the RoundsOutputVault contract to spend the InvestmentVault asset (shares)
   * ex: investmentVaultContract.approve(RoundsOutputVault.address, amount)
   */

  const assetApproveSpending = async () => {
    await approveSpending(unref(address));
  };

  const depositTx = ref<ContractTransaction | null>(null);
  const depositReceipt = ref<ContractReceipt | null>(null);
  const depositLoading = ref(false);
  const deposit = async (
    amount: BigNumberish,
    self = true,
    receiver?: string
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        depositLoading.value = true;
        if (self === true) {
          depositTx.value = await contractSigner.deposit(
            amount,
            connectedWallet.value.accounts[0].address
          );
        } else if (self === false && receiver) {
          depositTx.value = await contractSigner.deposit(amount, receiver);
        } else {
          throw new Error("Invalid deposit parameters");
        }
        const receipt = await depositTx.value.wait();
        depositReceipt.value = receipt;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot deposit: ${error.message}`);
        } else {
          throw new Error("Cannot deposit");
        }
      } finally {
        depositLoading.value = false;
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  const redeemLoading = ref(false);
  const redeemTx = ref<ContractTransaction | null>(null);
  const redeemReceipt = ref<ContractReceipt | null>(null);

  const redeem = async (
    id: BigNumberish,
    amount: number,
    self = true,
    receiver?: string
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      const parsedAmount = parseUnits(amount.toString());
      try {
        redeemLoading.value = true;
        if (self === true) {
          redeemTx.value = await contractSigner.redeem(
            id,
            parsedAmount,
            connectedWallet.value.accounts[0].address,
            connectedWallet.value.accounts[0].address
          );
        } else if (self === false && receiver) {
          redeemTx.value = await contractSigner.redeem(
            id,
            parsedAmount,
            receiver,
            connectedWallet.value.accounts[0].address
          );
        } else {
          throw new Error("Invalid redeem parameters");
        }
        const receipt = await redeemTx.value.wait();
        redeemReceipt.value = receipt;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot redeem: ${error.message}`);
        } else {
          throw new Error("Cannot redeem");
        }
      } finally {
        redeemLoading.value = false;
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  const redeemExchangeAssetLoading = ref(false);
  const redeemExchangeAssetTx = ref<ContractTransaction | null>(null);
  const redeemExchangeAssetReceipt = ref<ContractReceipt | null>(null);
  const redeemExchangeAsset = async (
    id: BigNumberish,
    amount: BigNumberish,
    self = true,
    receiver?: string
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        redeemExchangeAssetLoading.value = true;
        if (self === true) {
          redeemExchangeAssetTx.value =
            await contractSigner.redeemExchangeAsset(
              id,
              amount,
              connectedWallet.value.accounts[0].address,
              connectedWallet.value.accounts[0].address
            );
        } else if (self === false && receiver) {
          redeemExchangeAssetTx.value =
            await contractSigner.redeemExchangeAsset(
              id,
              amount,
              receiver,
              connectedWallet.value.accounts[0].address
            );
        } else {
          throw new Error("Invalid redeemExchangeAsset parameters");
        }
        const receipt = await redeemExchangeAssetTx.value.wait();
        redeemExchangeAssetReceipt.value = receipt;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot redeemExchangeAsset: ${error.message}`);
        } else {
          throw new Error("Cannot redeemExchangeAsset");
        }
      } finally {
        redeemExchangeAssetLoading.value = false;
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  const redeemExchangeAssetBatchLoading = ref(false);
  const redeemExchangeAssetBatchTx = ref<ContractTransaction | null>(null);
  const redeemExchangeAssetBatchReceipt = ref<ContractReceipt | null>(null);
  const redeemExchangeAssetBatch = async (
    ids: BigNumberish[],
    amounts: BigNumberish[],
    self = true,
    receiver?: string
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      const parsedAmounts = amounts.map((amount) =>
        parseUnits(amount.toString())
      );
      try {
        redeemExchangeAssetBatchLoading.value = true;
        if (self === true) {
          redeemExchangeAssetBatchTx.value =
            await contractSigner.redeemExchangeAssetBatch(
              ids,
              parsedAmounts,
              connectedWallet.value.accounts[0].address,
              connectedWallet.value.accounts[0].address
            );
        } else if (self === false && receiver) {
          redeemExchangeAssetBatchTx.value =
            await contractSigner.redeemExchangeAssetBatch(
              ids,
              parsedAmounts,
              receiver,
              connectedWallet.value.accounts[0].address
            );
        } else {
          throw new Error("Invalid redeemExchangeAssetBatch parameters");
        }
        const receipt = await redeemExchangeAssetBatchTx.value.wait();
        redeemExchangeAssetBatchReceipt.value = receipt;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot redeemExchangeAssetBatch: ${error.message}`);
        } else {
          throw new Error("Cannot redeemExchangeAssetBatch");
        }
      } finally {
        redeemExchangeAssetBatchLoading.value = false;
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  if (fetchInitialData === true) {
    onMounted(async () => {
      if (unref(address) && unref(asset)) {
        await assetFetchErc20Info();
        await assetFetchUserAllowance(unref(address));
        await getCurrentRound();
      }
    });
    if (isRef(address) && unref(address) && isRef(asset) && unref(asset)) {
      watch([address, asset, connectedWallet], async () => {
        await assetFetchErc20Info();
        await assetFetchUserAllowance(unref(address));
        await getCurrentRound();
      });
    }
  }

  return {
    depositLoading,
    depositTx,
    depositReceipt,
    deposit,
    redeemLoading,
    redeemTx,
    redeemReceipt,
    redeem,
    redeemExchangeAssetLoading,
    redeemExchangeAssetTx,
    redeemExchangeAssetReceipt,
    redeemExchangeAsset,
    redeemExchangeAssetBatchLoading,
    redeemExchangeAssetBatchTx,
    redeemExchangeAssetBatchReceipt,
    redeemExchangeAssetBatch,
    setApprovalForAllLoading,
    setApprovalForAllTx,
    setApprovalForAllReceipt,
    setApprovalForAll,
    isApprovedForAll,
    getIsApprovedForAllLoading,
    getIsApprovedForAll,
    balanceOfLoading,
    balanceOf,
    balanceOfAllLoading,
    balanceOfAll,
    balanceOfBatchLoading,
    balanceOfBatch,
    assetName,
    assetSymbol,
    assetDecimals,
    assetUserAllowance,
    assetApproveLoading,
    assetApproveTx,
    assetApproveReceipt,
    assetApproveSpending,
    assetFetchErc20Info,
    getExchangeRate,
  };
}
