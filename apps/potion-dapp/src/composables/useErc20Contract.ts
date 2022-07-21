import type { ERC20Upgradeable } from "@potion-protocol/core/typechain";
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import { isArray } from "lodash";
import { isRef, onMounted, ref, unref, watch } from "vue";

import { useTokenList } from "@/composables/useTokenList";
import { MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useOnboard } from "@onboard-composable";
import { ERC20Upgradeable__factory } from "@potion-protocol/core/typechain";

import { useEthersContract } from "./useEthersContract";

import type { Ref } from "vue";
export function useErc20Contract(address: string | Ref<string>) {
  const { initContract } = useEthersContract();
  const { connectedWallet } = useOnboard();

  //Provider initialization
  const initContractProvider = () => {
    return initContract(
      true,
      false,
      ERC20Upgradeable__factory,
      unref(address).toLowerCase()
    ) as ERC20Upgradeable;
  };
  const initContractSigner = () => {
    return initContract(
      true,
      false,
      ERC20Upgradeable__factory,
      unref(address).toLowerCase()
    ) as ERC20Upgradeable;
  };

  const name = ref("");
  const symbol = ref("");
  const image = ref("");
  const decimals = ref(0);

  const getName = async () => {
    try {
      const contractProvider = initContractProvider();
      name.value = await contractProvider.name();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the name: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the name`);
      }
    }
  };
  const getSymbol = async () => {
    try {
      const contractProvider = initContractProvider();

      symbol.value = await contractProvider.symbol();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the symbol: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the symbol`);
      }
    }
  };
  const getDecimals = async () => {
    try {
      const contractProvider = initContractProvider();

      decimals.value = await contractProvider.decimals();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot fetch the decimals: ${error.message}`);
      } else {
        throw new Error(`Cannot fetch the decimals`);
      }
    }
  };

  const fetchErc20Info = async () => {
    await Promise.all([getName(), getSymbol(), getDecimals()]);
    const { image: tokenImage } = useTokenList(unref(address));
    image.value = tokenImage;
  };

  onMounted(async () => {
    if (unref(address).length === 42) {
      await fetchErc20Info();
    }
  });

  if (isRef(address) && unref(address).length === 42) {
    watch(address, async () => {
      if (unref(address).length === 42) {
        await fetchErc20Info();
      }
    });
  }

  const userBalance = ref(0);
  const balance = ref(0);
  const balances = ref<number[]>([]);
  /**
   *
   * @param self if true, the balance is the balance of the user connected, otherwise the balance of the walletAddress
   * @param walletAddresses can be an array of addresses or a single address
   * @return The return is added for convenience - it returns a number or an array of numbers
   */
  const getTokenBalance = async (
    self = true,
    walletAddresses?: string | string[]
  ) => {
    try {
      const contractProvider = initContractProvider();

      if (self === true && connectedWallet.value) {
        const result = await contractProvider.balanceOf(
          connectedWallet.value.accounts[0].address
        );
        userBalance.value = parseFloat(formatUnits(result, decimals.value));
        return userBalance.value;
      } else if (
        self === false &&
        walletAddresses &&
        !isArray(walletAddresses)
      ) {
        const result = await contractProvider.balanceOf(walletAddresses);
        balance.value = parseFloat(formatUnits(result, decimals.value));
        return balance.value;
      } else if (
        self === false &&
        walletAddresses &&
        isArray(walletAddresses)
      ) {
        const result = await Promise.all(
          walletAddresses.map(async (address) => {
            const result = await contractProvider.balanceOf(address);
            return parseFloat(formatUnits(result, decimals.value));
          })
        );
        balances.value = result;
        return balances.value;
      } else {
        throw new Error("Cannot fetch the balance");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get token balance: ${error.message}`);
      } else {
        throw new Error("Cannot get token balance");
      }
    }
  };

  const userAllowance = ref(0);
  const fetchUserAllowanceLoading = ref(false);

  const fetchUserAllowance = async (spender: string) => {
    fetchUserAllowanceLoading.value = true;
    try {
      const contractProvider = initContractProvider();

      if (connectedWallet.value) {
        const response = await contractProvider.allowance(
          connectedWallet.value.accounts[0].address,
          spender
        );
        console.info(
          `Address allowance for ${spender} is ${formatUnits(
            response,
            decimals.value
          )}`
        );
        userAllowance.value = parseFloat(formatUnits(response, decimals.value));
      } else {
        throw new Error("Connect your wallet first");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot retrieve the user allowance: ${error.message}`);
      } else {
        throw new Error("Cannot retrieve the user allowance");
      }
    } finally {
      fetchUserAllowanceLoading.value = false;
    }
  };

  const approveLoading = ref(false);
  const approveTx = ref<ContractTransaction | null>(null);
  const approveReceipt = ref<ContractReceipt | null>(null);
  const approveSpending = async (
    spender: string,
    amount: number,
    infinite = true
  ) => {
    approveLoading.value = true;
    try {
      if (connectedWallet.value) {
        const contractSigner = initContractSigner();
        approveTx.value = await contractSigner.approve(
          spender,
          infinite ? MaxUint256 : parseUnits(amount.toString(), 6)
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
    approveSpending,
    decimals,
    fetchUserAllowance,
    fetchUserAllowanceLoading,
    getDecimals,
    getName,
    getSymbol,
    getTokenBalance,
    image,
    name,
    symbol,
    userAllowance,
  };
}
