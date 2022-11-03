import type { Token } from "dapp-types";

import { contractsAddresses } from "./contracts";
import { getWETHAddress } from "@/helpers/uniswap";
import { mockWeb3Onboard } from "@/helpers/onboard";
import { UniswapActionType } from "@/types";
import type { BigNumberish } from "ethers";

console.log("Running a mocked version of 'vaultOperatorUtils'");

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This replaces the official address of the collateral token with the one for USDC from the local deployment
 * @param token Potion token we are using as a collateral
 * @returns Potion token with the address mocked with the one from the local deployment
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
 * This replaces the alocal deployment ddress of the underlying token with the official one for WETH
 * @param token Potion token we are using as underlying
 * @returns Potion token with the address mocked with the official one
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
