import type { Ref } from "vue";
import type { BigNumberish } from "ethers";
import { Token as UniswapToken } from "@uniswap/sdk-core";

import type { Token } from "dapp-types";

import { getContractsFromVault } from "./hedgingVaultContracts";
import { getChainId } from "@/helpers/uniswap";
import { UniswapActionType } from "@/types";

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This is required because we need a valid address for uniswap to run the router
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

/**
 * This function was developed with no other purpose than being able to change the recipient by mocking this file.
 * This is required because we need a valid address for uniswap to run the router
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const convertQuoteUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
    decimals: uniToken.decimals,
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
  convertCollateralToUniswapToken,
  convertQuoteUniswapTokenToToken,
  getExpectedPriceRate,
  getRecipientAddress,
};
