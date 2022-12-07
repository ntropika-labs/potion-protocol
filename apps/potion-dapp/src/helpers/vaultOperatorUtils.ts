import type { BigNumberish } from "ethers";

import { getContractsFromVault } from "./hedgingVaultContracts";
import { UniswapActionType } from "@/types";

/**
 * This function is required to be able to mock the uniswap expected price rate to be able to run in a development environment
 * This is required because the expected price rate must match the one from the oracle for local development
 * @param _oraclePrice unused - see `mockedVaultOperatorUtils`
 * @param tradePrice The actual price retrieved from the uniswap alpha router
 * @param _actionType unused - see `mockedVaultOperatorUtils`
 * @returns The actual trade price for the swap
 */
const getExpectedPriceRate = (
  _oraclePrice: number,
  tradePrice: BigNumberish,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _actionType: UniswapActionType
) => {
  return tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

/**
 * This function is required to be able to mock the uniswap recipient to run the alpha router in a development environment.
 * @param vaultAddress Address of the vault we are acting on
 * @returns The address to use as an intermediate recipient in multihop swaps
 */
const getRecipientAddress = (vaultAddress: string): string => {
  const { PotionBuyAction } = getContractsFromVault(vaultAddress);

  return PotionBuyAction;
};

export { getExpectedPriceRate, getRecipientAddress };
