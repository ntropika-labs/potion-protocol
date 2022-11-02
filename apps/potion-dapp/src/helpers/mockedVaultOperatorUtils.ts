import type { Token } from "dapp-types";

import { contractsAddresses } from "./contracts";
import { getWETHAddress } from "@/helpers/uniswap";
import { mockWeb3Onboard } from "@/helpers/onboard";
import { UniswapActionType } from "@/types";
import type { BigNumberish } from "ethers";

console.log("Running a mocked version of 'vaultOperatorUtils'");

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This is required because we need a valid address for uniswap to run the router
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const mockCollateralToken = (token: Token): Token => {
  return {
    name: token.name || "",
    symbol: token.symbol || "",
    address: contractsAddresses.USDC.address.toLowerCase(),
    decimals: token.decimals,
  };
};

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This is required because we need a valid address for uniswap to run the router
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const mockUnderlyingToken = (token: Token): Token => {
  console.log(getWETHAddress());
  return {
    name: token.name || "",
    symbol: token.symbol || "",
    address: getWETHAddress(),
    decimals: token.decimals,
  };
};

const getExpectedPriceRate = (
  oraclePrice: number,
  _tradePrice: BigNumberish,
  actionType: UniswapActionType
) => {
  if (actionType === UniswapActionType.ENTER_POSITION) {
    return oraclePrice; // default to 1000
  } else {
    return 1 / oraclePrice; // default to 0.001,
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRecipientAddress = (_: string): string => {
  return mockWeb3Onboard.wallets[0]?.accounts[0]?.address;
};

export {
  getExpectedPriceRate,
  getRecipientAddress,
  mockCollateralToken,
  mockUnderlyingToken,
};
