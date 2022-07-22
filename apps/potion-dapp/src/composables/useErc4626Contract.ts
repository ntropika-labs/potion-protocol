import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

import { isRef, onMounted, ref, unref, watch } from "vue";

import { useErc20Contract } from "@/composables/useErc20Contract";
import { useEthersContract } from "@/composables/useEthersContract";
import { MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";
import { ERC4626CapUpgradeable__factory } from "@potion-protocol/hedging-vault/typechain";

import type { Ref } from "vue";
import type { ERC4626Upgradeable } from "@potion-protocol/hedging-vault/typechain";
import type { BigNumber } from "@ethersproject/bignumber";

export function useErc4626Contract(address: string | Ref<string>) {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();
  const initContractSigner = () => {
    return initContract(
      true,
      false,
      ERC4626CapUpgradeable__factory,
      unref(address).toLowerCase()
    ) as ERC4626Upgradeable;
  };

  const initContractProvider = () => {
    return initContract(
      true,
      false,
      ERC4626CapUpgradeable__factory,
      unref(address).toLowerCase()
    ) as ERC4626Upgradeable;
  };

  const {
    name: vaultName,
    symbol: vaultSymbol,
    image: vaultImage,
    decimals: vaultDecimals,
  } = useErc20Contract(address);

  const getVaultDecimals = async () => {
    const provider = initContractProvider();
    vaultDecimals.value = await provider.decimals();
  };

  const assetAddress = ref<string>("");
  const assetAddressLoading = ref(false);
  const getAssetAddress = async () => {
    try {
      assetAddressLoading.value = true;
      const contractProvider = initContractProvider();
      assetAddress.value = await contractProvider.asset();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the asset address: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the asset address`);
      }
    } finally {
      assetAddressLoading.value = false;
    }
  };

  const {
    name: assetName,
    symbol: assetSymbol,
    image: assetImage,
    decimals: assetDecimals,
  } = useErc20Contract(assetAddress);

  const totalAssets = ref(0);
  const totalAssetsLoading = ref(false);
  const getTotalAssets = async () => {
    try {
      totalAssetsLoading.value = true;
      const contractProvider = initContractProvider();
      totalAssets.value = parseFloat(
        formatUnits(await contractProvider.totalAssets(), assetDecimals.value)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the total assets: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the total assets`);
      }
    } finally {
      totalAssetsLoading.value = false;
    }
  };

  const getVaultAssetInfo = async () => {
    await Promise.all([getAssetAddress(), getTotalAssets()]);
  };

  onMounted(async () => {
    if (unref(address).length === 42) {
      await getVaultAssetInfo();
    }
  });

  if (isRef(address) && unref(address).length === 42) {
    watch(address, async () => {
      await getVaultAssetInfo();
    });
  }

  const maxDeposit = ref(0);
  const maxDepositLoading = ref(false);
  const getMaxDeposit = async (self = true, address?: string) => {
    try {
      maxDepositLoading.value = true;
      const contractProvider = initContractProvider();
      if (connectedWallet.value && self === true) {
        const response = await contractProvider.maxDeposit(
          connectedWallet.value.accounts[0].address
        );
        maxDeposit.value = parseFloat(
          formatUnits(response, assetDecimals.value)
        );
      } else if (self === false && address) {
        const response = await contractProvider.maxDeposit(address);
        maxDeposit.value = parseFloat(
          formatUnits(response, assetDecimals.value)
        );
      } else {
        throw new Error("No address provided");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max deposit: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max deposit`);
      }
    } finally {
      maxDepositLoading.value = false;
    }
  };

  const previewDepositLoading = ref(false);
  const previewDeposit = async (amount: number) => {
    try {
      previewDepositLoading.value = true;
      const contractProvider = initContractProvider();
      const response = await contractProvider.previewDeposit(
        parseUnits(amount.toString(), assetDecimals.value)
      );
      return formatUnits(response, vaultDecimals.value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot preview the deposit: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the deposit`);
      }
    } finally {
      previewDepositLoading.value = true;
    }
  };

  const depositTx = ref<ContractTransaction | null>(null);
  const depositReceipt = ref<ContractReceipt | null>(null);
  const depositLoading = ref(false);
  const deposit = async (amount: number, self = true, receiver?: string) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      const parsedAmount = parseUnits(amount.toString(), assetDecimals.value);
      try {
        depositLoading.value = true;
        if (self === true) {
          depositTx.value = await contractSigner.deposit(
            parsedAmount,
            connectedWallet.value.accounts[0].address
          );
        } else if (self === false && receiver) {
          depositTx.value = await contractSigner.deposit(
            parsedAmount,
            receiver
          );
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

  const maxMint = ref(0);
  const maxMintLoading = ref(false);
  const getMaxMint = async (self = true, address?: string) => {
    try {
      maxMintLoading.value = true;
      const contractProvider = initContractProvider();
      if (connectedWallet.value && self === true) {
        const response = await contractProvider.maxMint(
          connectedWallet.value.accounts[0].address
        );
        maxMint.value = parseFloat(formatUnits(response, vaultDecimals.value));
      } else if (self === false && address) {
        const response = await contractProvider.maxMint(address);
        maxMint.value = parseFloat(formatUnits(response, vaultDecimals.value));
      } else {
        throw new Error("No address provided");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max mint: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max mint`);
      }
    } finally {
      maxMintLoading.value = false;
    }
  };

  const previewMintLoading = ref(false);
  const previewMint = async (amount: number) => {
    try {
      previewMintLoading.value = true;
      const contractProvider = initContractProvider();
      const response = await contractProvider.previewMint(
        parseUnits(amount.toString(), vaultDecimals.value)
      );
      return formatUnits(response, assetDecimals.value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot preview the mint: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the mint`);
      }
    } finally {
      previewMintLoading.value = false;
    }
  };

  const mintTx = ref<ContractTransaction | null>(null);
  const mintReceipt = ref<ContractReceipt | null>(null);
  const mintLoading = ref(false);
  const mint = async (amount: number, self = true, receiver: string) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      const parsedAmount = parseUnits(amount.toString(), vaultDecimals.value);
      try {
        mintLoading.value = true;
        if (self === true) {
          mintTx.value = await contractSigner.mint(
            parsedAmount,
            connectedWallet.value.accounts[0].address
          );
        } else if (self === false && receiver) {
          mintTx.value = await contractSigner.mint(parsedAmount, receiver);
        } else {
          throw new Error("Invalid mint parameters");
        }
        const receipt = await mintTx.value.wait();
        mintReceipt.value = receipt;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot mint: ${error.message}`);
        } else {
          throw new Error("Cannot mint");
        }
      } finally {
        mintLoading.value = false;
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  const maxWithdraw = ref(0);
  const maxWithdrawLoading = ref(false);
  const getMaxWithdraw = async (self = true, address?: string) => {
    try {
      maxWithdrawLoading.value = true;
      const contractProvider = initContractProvider();
      if (connectedWallet.value && self === true) {
        const response = await contractProvider.maxWithdraw(
          connectedWallet.value.accounts[0].address
        );
        maxWithdraw.value = parseFloat(
          formatUnits(response, assetDecimals.value)
        );
      } else if (self === false && address) {
        const response = await contractProvider.maxWithdraw(address);
        maxWithdraw.value = parseFloat(
          formatUnits(response, assetDecimals.value)
        );
      } else {
        throw new Error("No address provided");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max withdraw: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max withdraw`);
      }
    } finally {
      maxWithdrawLoading.value = false;
    }
  };

  const previewWithdrawLoading = ref(false);
  const previewWithdraw = async (amount: number) => {
    try {
      previewWithdrawLoading.value = true;
      const contractProvider = initContractProvider();
      const response = await contractProvider.previewWithdraw(
        parseUnits(amount.toString(), assetDecimals.value)
      );
      return formatUnits(response, assetDecimals.value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot preview the withdraw: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the withdraw`);
      }
    } finally {
      previewWithdrawLoading.value = false;
    }
  };

  const withdrawTx = ref<ContractTransaction | null>(null);
  const withdrawReceipt = ref<ContractReceipt | null>(null);
  const withdrawLoading = ref(false);
  const withdraw = async (
    amount: number,
    self = true,
    receiver?: string,
    owner?: string
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      const parsedAmount = parseUnits(amount.toString(), assetDecimals.value);
      try {
        withdrawLoading.value = true;
        if (self === true) {
          withdrawTx.value = await contractSigner.withdraw(
            parsedAmount,
            connectedWallet.value.accounts[0].address,
            connectedWallet.value.accounts[0].address
          );
        } else if (self === false && receiver && owner) {
          withdrawTx.value = await contractSigner.withdraw(
            parsedAmount,
            receiver,
            owner
          );
        } else {
          throw new Error("Invalid withdraw parameters");
        }
        const receipt = await withdrawTx.value.wait();
        withdrawReceipt.value = receipt;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot withdraw: ${error.message}`);
        } else {
          throw new Error("Cannot withdraw");
        }
      } finally {
        withdrawLoading.value = false;
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  const maxRedeem = ref(0);
  const maxRedeemLoading = ref(false);
  const getMaxRedeem = async (self = true, address?: string) => {
    try {
      maxRedeemLoading.value = true;
      const contractProvider = initContractProvider();
      if (connectedWallet.value && self === true) {
        const response = await contractProvider.maxRedeem(
          connectedWallet.value.accounts[0].address
        );
        maxRedeem.value = parseFloat(
          formatUnits(response, vaultDecimals.value)
        );
      } else if (self === false && address) {
        const response = await contractProvider.maxRedeem(address);
        maxRedeem.value = parseFloat(
          formatUnits(response, vaultDecimals.value)
        );
      } else {
        throw new Error("No address provided");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max redeem: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max redeem`);
      }
    } finally {
      maxRedeemLoading.value = false;
    }
  };

  const previewRedeemLoading = ref(false);
  const previewRedeem = async (amount: number) => {
    try {
      previewRedeemLoading.value = true;
      const contractProvider = initContractProvider();
      const response = await contractProvider.previewRedeem(
        parseUnits(amount.toString(), vaultDecimals.value)
      );
      return formatUnits(response, assetDecimals.value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot preview the redeem: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the redeem`);
      }
    } finally {
      previewRedeemLoading.value = false;
    }
  };

  const redeemTx = ref<ContractTransaction | null>(null);
  const redeemReceipt = ref<ContractReceipt | null>(null);
  const redeemLoading = ref(false);
  const redeem = async (
    shares: number,
    self = true,
    receiver?: string,
    owner?: string
  ) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      try {
        redeemLoading.value = true;
        const sharesBigNumbers = parseUnits(
          shares.toString(),
          vaultDecimals.value
        );
        if (self === true) {
          redeemTx.value = await contractSigner.redeem(
            sharesBigNumbers,
            connectedWallet.value.accounts[0].address,
            connectedWallet.value.accounts[0].address
          );
        } else if (self === false && receiver && owner) {
          redeemTx.value = await contractSigner.redeem(
            sharesBigNumbers,
            receiver,
            owner
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

  const convertToShares = async (amount: number) => {
    try {
      const contractProvider = initContractProvider();
      const parsedAmount = parseUnits(amount.toString(), assetDecimals.value);
      const result = await contractProvider.convertToShares(parsedAmount);
      return parseFloat(formatUnits(result, vaultDecimals.value));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot convert to shares: ${error.message}`);
      } else {
        throw new Error("Cannot convert to shares");
      }
    }
  };

  const assetToShare = ref(0);
  onMounted(async () => {
    const response = await convertToShares(1);
    assetToShare.value = response;
  });

  const convertToAssets = async (amount: BigNumber, digits: number) => {
    try {
      const contractProvider = initContractProvider();
      const parsedAmount = parseUnits(amount.toString(), assetDecimals.value);
      const result = await contractProvider.convertToAssets(parsedAmount);
      return formatUnits(result, digits);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot convert to assets: ${error.message}`);
      } else {
        throw new Error("Cannot convert to assets");
      }
    }
  };

  const userBalance = ref(0);
  const getUserBalance = async () => {
    if (connectedWallet.value) {
      try {
        maxDepositLoading;
        const contractProvider = initContractProvider();
        const result = await contractProvider.balanceOf(
          connectedWallet.value.accounts[0].address
        );
        return formatUnits(result, vaultDecimals.value);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Cannot get balance: ${error.message}`);
        } else {
          throw new Error("Cannot get balance");
        }
      }
    } else {
      // throw new Error("Connect your wallet first");
      userBalance.value = 0;
    }
  };

  const userAssets = ref(0);

  onMounted(async () => {
    await getUserBalance();
    userAssets.value = parseFloat(
      await convertToAssets(
        parseUnits(userBalance.value.toString(), assetDecimals.value),
        assetDecimals.value
      )
    );
  });

  const allowance = ref(0);
  const allowanceLoading = ref(false);
  const getAllowance = async (self = true, spender: string, owner?: string) => {
    try {
      allowanceLoading.value = true;
      const contractProvider = initContractProvider();
      if (connectedWallet.value && self === true && spender) {
        const response = await contractProvider.allowance(
          connectedWallet.value.accounts[0].address,
          spender
        );
        allowance.value = parseFloat(
          formatUnits(response, vaultDecimals.value)
        );
      } else if (self === false && owner && spender) {
        const response = await contractProvider.allowance(owner, spender);
        allowance.value = parseFloat(
          formatUnits(response, vaultDecimals.value)
        );
      } else {
        throw new Error("No address provided");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get allowance: ${error.message}`);
      } else {
        throw new Error("Cannot get allowance");
      }
    } finally {
      allowanceLoading.value = false;
    }
  };

  const approveLoading = ref(false);
  const approveTx = ref<ContractTransaction | null>(null);
  const approveReceipt = ref<ContractReceipt | null>(null);
  const approveSpending = async (amount: number, infinite = true) => {
    approveLoading.value = true;
    try {
      if (connectedWallet.value) {
        const contractSigner = initContractSigner();
        approveTx.value = await contractSigner.approve(
          unref(address),
          infinite
            ? MaxUint256
            : parseUnits(amount.toString(), vaultDecimals.value)
        );
        approveReceipt.value = await approveTx.value.wait();
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Cannot approve for the liquidity pool: ${error.message}`
        );
      } else {
        throw new Error("Cannot approve for the liquidity pool");
      }
    } finally {
      approveLoading.value = false;
    }
  };
  return {
    allowance,
    allowanceLoading,
    approveLoading,
    approveReceipt,
    approveSpending,
    approveTx,
    assetAddress,
    assetAddressLoading,
    assetDecimals,
    assetImage,
    assetName,
    assetSymbol,
    assetToShare,
    convertToAssets,
    convertToShares,
    deposit,
    depositLoading,
    depositReceipt,
    depositTx,
    getAllowance,
    getAssetAddress,
    getMaxDeposit,
    getMaxMint,
    getMaxRedeem,
    getMaxWithdraw,
    getTotalAssets,
    getVaultDecimals,
    maxDeposit,
    maxDepositLoading,
    maxMint,
    maxMintLoading,
    maxRedeem,
    maxRedeemLoading,
    maxWithdraw,
    maxWithdrawLoading,
    mint,
    mintLoading,
    mintReceipt,
    mintTx,
    previewDeposit,
    previewDepositLoading,
    previewMint,
    previewMintLoading,
    previewRedeem,
    previewRedeemLoading,
    previewWithdraw,
    previewWithdrawLoading,
    redeem,
    redeemLoading,
    redeemReceipt,
    redeemTx,
    totalAssets,
    totalAssetsLoading,
    userAssets,
    userBalance,
    vaultDecimals,
    vaultImage,
    vaultName,
    vaultSymbol,
    withdraw,
    withdrawLoading,
    withdrawReceipt,
    withdrawTx,
  };
}
