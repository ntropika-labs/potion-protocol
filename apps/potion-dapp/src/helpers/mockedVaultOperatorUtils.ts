import type { Ref } from "vue";
import { Token as UniswapToken } from "@uniswap/sdk-core";

import type { Token } from "dapp-types";

import { contractsAddresses } from "@/helpers/contracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";
import { mockWeb3Onboard } from "@/helpers/onboard";
import { UniswapActionType } from "@/types";
import type { BigNumberish } from "ethers";

console.log("Running a mocked version of 'vaultOperatorUtils'");

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    getWETHAddress(),
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertQuoteUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: contractsAddresses.USDC.address,
    decimals: uniToken.decimals,
  };
};

const getExpectedPriceRate = (
  oraclePrice: Ref<number>,
  _tradePrice: BigNumberish,
  actionType: UniswapActionType
) => {
  if (actionType === UniswapActionType.ENTER_POSITION) {
    return oraclePrice.value; // default to 1000
  } else {
    return 1 / oraclePrice.value; // default to 0.001,
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRecipientAddress = (_: string): string => {
  return mockWeb3Onboard.wallets[0]?.accounts[0]?.address;
};

export {
  convertCollateralToUniswapToken,
  convertQuoteUniswapTokenToToken,
  getExpectedPriceRate,
  getRecipientAddress,
};
