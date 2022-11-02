import type { Ref } from "vue";
import type { BigNumberish } from "ethers";

import type { Token } from "dapp-types";

import { getContractsFromVault } from "./hedgingVaultContracts";
import { UniswapActionType } from "@/types";

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
    address: token.address,
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
  return {
    name: token.name || "",
    symbol: token.symbol || "",
    address: token.address,
    decimals: token.decimals,
  };
};

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This is required because the expected price rate must match the one from the oracle for local development
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const getExpectedPriceRate = (
  _oraclePrice: Ref<number>,
  tradePrice: BigNumberish,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _actionType: UniswapActionType
) => {
  return tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This is required because we need a valid address for uniswap to run the router
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const getRecipientAddress = (vaultAddress: string): string => {
  const { potionBuyAction } = getContractsFromVault(vaultAddress);

  return potionBuyAction;
};

export {
  getExpectedPriceRate,
  getRecipientAddress,
  mockCollateralToken,
  mockUnderlyingToken,
};
