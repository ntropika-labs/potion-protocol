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

export function useERC4626Upgradable(address: string | Ref<string>) {
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

  const vaultDecimals = ref(0);

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
      assetAddressLoading.value = false;
    } catch (error) {
      assetAddressLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the asset address: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the asset address`);
      }
    }
  };

  const totalAssets = ref<BigNumber>();
  const totalAssetsLoading = ref(false);
  const getTotalAssets = async () => {
    try {
      totalAssetsLoading.value = true;
      const contractProvider = initContractProvider();
      totalAssets.value = await contractProvider.totalAssets();
      totalAssetsLoading.value = false;
    } catch (error) {
      totalAssetsLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the total assets: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the total assets`);
      }
    }
  };

  onMounted(async () => {
    Promise.all([getAssetAddress(), getTotalAssets(), getVaultDecimals()]);
  });

  if (isRef(address)) {
    watch(address, async () => {
      Promise.all([getAssetAddress(), getTotalAssets(), getVaultDecimals()]);
    });
  }
  const { decimals } = useErc20Contract(assetAddress);

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
        maxDeposit.value = parseFloat(formatUnits(response, decimals.value));
        maxDepositLoading.value = false;
      } else if (self === false && address) {
        const response = await contractProvider.maxDeposit(address);
        maxDeposit.value = parseFloat(formatUnits(response, decimals.value));
        maxDepositLoading.value = false;
      } else {
        maxDepositLoading.value = false;
        throw new Error("No address provided");
      }
    } catch (error) {
      maxDepositLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max deposit: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max deposit`);
      }
    }
  };

  const previewDepositLoading = ref(false);
  const previewDeposit = async (amount: number) => {
    try {
      previewDepositLoading.value = true;
      const contractProvider = initContractProvider();
      const response = await contractProvider.previewDeposit(
        parseUnits(amount.toString(), decimals.value)
      );
      return formatUnits(response, vaultDecimals.value);
    } catch (error) {
      previewDepositLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot preview the deposit: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the deposit`);
      }
    }
  };

  const depositTx = ref<ContractTransaction | null>(null);
  const depositReceipt = ref<ContractReceipt | null>(null);
  const depositLoading = ref(false);
  const deposit = async (amount: number, self = true, receiver?: string) => {
    if (connectedWallet.value) {
      const contractSigner = initContractSigner();
      const parsedAmount = parseUnits(amount.toString(), decimals.value);
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
          depositLoading.value = false;
          throw new Error("Invalid deposit parameters");
        }
        const receipt = await depositTx.value.wait();
        depositReceipt.value = receipt;
        depositLoading.value = false;
      } catch (error) {
        depositLoading.value = false;
        if (error instanceof Error) {
          throw new Error(`Cannot deposit: ${error.message}`);
        } else {
          throw new Error("Cannot deposit");
        }
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
        maxMintLoading.value = false;
      } else if (self === false && address) {
        const response = await contractProvider.maxMint(address);
        maxMint.value = parseFloat(formatUnits(response, vaultDecimals.value));
        maxMintLoading.value = false;
      } else {
        maxMintLoading.value = false;
        throw new Error("No address provided");
      }
    } catch (error) {
      maxMintLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max mint: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max mint`);
      }
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
      return formatUnits(response, decimals.value);
    } catch (error) {
      previewMintLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot preview the mint: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the mint`);
      }
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
          mintLoading.value = false;
          throw new Error("Invalid mint parameters");
        }
        const receipt = await mintTx.value.wait();
        mintReceipt.value = receipt;
        mintLoading.value = false;
      } catch (error) {
        mintLoading.value = false;
        if (error instanceof Error) {
          throw new Error(`Cannot mint: ${error.message}`);
        } else {
          throw new Error("Cannot mint");
        }
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
        maxWithdraw.value = parseFloat(formatUnits(response, decimals.value));
        maxWithdrawLoading.value = false;
      } else if (self === false && address) {
        const response = await contractProvider.maxWithdraw(address);
        maxWithdraw.value = parseFloat(formatUnits(response, decimals.value));
        maxWithdrawLoading.value = false;
      } else {
        maxWithdrawLoading.value = false;
        throw new Error("No address provided");
      }
    } catch (error) {
      maxWithdrawLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max withdraw: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max withdraw`);
      }
    }
  };

  const previewWithdrawLoading = ref(false);
  const previewWithdraw = async (amount: number) => {
    try {
      previewWithdrawLoading.value = true;
      const contractProvider = initContractProvider();
      const response = await contractProvider.previewWithdraw(
        parseUnits(amount.toString(), decimals.value)
      );
      return formatUnits(response, decimals.value);
    } catch (error) {
      previewWithdrawLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot preview the withdraw: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the withdraw`);
      }
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
      const parsedAmount = parseUnits(amount.toString(), decimals.value);
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
          withdrawLoading.value = false;
          throw new Error("Invalid withdraw parameters");
        }
        const receipt = await withdrawTx.value.wait();
        withdrawReceipt.value = receipt;
        withdrawLoading.value = false;
      } catch (error) {
        withdrawLoading.value = false;
        if (error instanceof Error) {
          throw new Error(`Cannot withdraw: ${error.message}`);
        } else {
          throw new Error("Cannot withdraw");
        }
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
        maxRedeemLoading.value = false;
      } else if (self === false && address) {
        const response = await contractProvider.maxRedeem(address);
        maxRedeem.value = parseFloat(
          formatUnits(response, vaultDecimals.value)
        );
        maxRedeemLoading.value = false;
      } else {
        maxRedeemLoading.value = false;
        throw new Error("No address provided");
      }
    } catch (error) {
      maxRedeemLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the max redeem: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the max redeem`);
      }
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
      return formatUnits(response, decimals.value);
    } catch (error) {
      previewRedeemLoading.value = false;
      if (error instanceof Error) {
        throw new Error(`Cannot preview the redeem: ${error.message}`);
      } else {
        throw new Error(`Cannot preview the redeem`);
      }
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
          redeemLoading.value = false;
          throw new Error("Invalid redeem parameters");
        }
        const receipt = await redeemTx.value.wait();
        redeemReceipt.value = receipt;
        redeemLoading.value = false;
      } catch (error) {
        redeemLoading.value = false;
        if (error instanceof Error) {
          throw new Error(`Cannot redeem: ${error.message}`);
        } else {
          throw new Error("Cannot redeem");
        }
      }
    } else {
      throw new Error("Connect your wallet first");
    }
  };

  const convertToShares = async (amount: number) => {
    try {
      const contractProvider = initContractProvider();
      const parsedAmount = parseUnits(amount.toString(), decimals.value);
      const result = await contractProvider.convertToShares(parsedAmount);
      return formatUnits(result, vaultDecimals.value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot convert to shares: ${error.message}`);
      } else {
        throw new Error("Cannot convert to shares");
      }
    }
  };

  const convertToAssets = async (amount: BigNumber, digits: number) => {
    try {
      const contractProvider = initContractProvider();
      const parsedAmount = parseUnits(amount.toString(), decimals.value);
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

  const balanceOfUser = async () => {
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
      throw new Error("Connect your wallet first");
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
        approveLoading.value = false;
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      approveLoading.value = false;
      if (error instanceof Error) {
        throw new Error(
          `Cannot approve for the liquidity pool: ${error.message}`
        );
      } else {
        throw new Error("Cannot approve for the liquidity pool");
      }
    }
  };
  return {
    approveLoading,
    approveReceipt,
    approveSpending,
    approveTx,
    assetAddress,
    assetAddressLoading,
    balanceOfUser,
    convertToAssets,
    convertToShares,
    deposit,
    depositLoading,
    depositReceipt,
    depositTx,
    getAssetAddress,
    getMaxDeposit,
    getMaxMint,
    getMaxRedeem,
    getMaxWithdraw,
    getTotalAssets,
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
    withdraw,
    withdrawLoading,
    withdrawReceipt,
    withdrawTx,
  };
}
