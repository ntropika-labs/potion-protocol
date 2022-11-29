import { mockWeb3Onboard } from "@/helpers/onboard";
import { UniswapActionType } from "@/types";
import type { BigNumberish } from "ethers";

console.log("Running a mocked version of 'vaultOperatorUtils'");

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

export { getExpectedPriceRate, getRecipientAddress };
