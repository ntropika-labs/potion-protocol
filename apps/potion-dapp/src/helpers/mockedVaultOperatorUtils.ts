import { mockWeb3Onboard } from "@/helpers/onboard";
import { UniswapActionType } from "@/types";
import type { BigNumberish } from "ethers";

console.log("Running a mocked version of 'vaultOperatorUtils'");

/**
 * This function is required to be able to mock the uniswap expected price rate to be able to run in a development environment
 * This is required because the expected price rate must match the one from the oracle for local development
 * @param oraclePrice The current oracle price
 * @param _tradePrice unused - see `vaultOperatorUtils`
 * @param actionType The action type we are going to execute
 * @returns The actual trade price for the swap
 */
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

/**
 * This function is required to be able to mock the uniswap recipient to run the alpha router in a development environment.
 * @param _vaultAddress unused - see `vaultOperatorUtils`
 * @returns The address to use as an intermediate recipient in multihop swaps.
 * In a dev environment this is set to the first account from `mockWeb3Onboard`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRecipientAddress = (_vaultAddress: string): string => {
  return mockWeb3Onboard.wallets[0]?.accounts[0]?.address;
};

export { getExpectedPriceRate, getRecipientAddress };
