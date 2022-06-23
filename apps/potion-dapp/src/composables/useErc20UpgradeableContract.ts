import type { ERC20Upgradeable } from "potion-contracts/typechain";

import { ERC20Upgradeable__factory } from "potion-contracts/typechain";
import { formatUnits } from "@ethersproject/units";
import { useEthersContract } from "./useEthersContract";

export function useErc20UpgradeableContract() {
  const { initContract } = useEthersContract();

  //Provider initialization

  const initContractProvider = (address: string) => {
    return initContract(
      false,
      false,
      ERC20Upgradeable__factory,
      address
    ) as ERC20Upgradeable;
  };

  const getTokenBalance = async (
    walletAddress: string,
    tokenAddress: string
  ) => {
    try {
      const provider = initContractProvider(tokenAddress);
      const balance = await provider.balanceOf(walletAddress);
      return formatUnits(balance, 8);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get token balance: ${error.message}`);
      } else {
        throw new Error("Cannot get token balance");
      }
    }
  };

  const getTokensBalance = async (
    walletAddress: string,
    tokensAddresses: string[]
  ) => {
    try {
      const result = new Map<string, string>();
      const promises = tokensAddresses.map(async (tokenAddress) => {
        result.set(
          tokenAddress,
          await getTokenBalance(walletAddress, tokenAddress)
        );
      });
      await Promise.allSettled(promises);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get multiple tokens balance: ${error.message}`);
      } else {
        throw new Error("Cannot get multiple tokens balance");
      }
    }
  };

  return {
    getTokenBalance,
    getTokensBalance,
  };
}
