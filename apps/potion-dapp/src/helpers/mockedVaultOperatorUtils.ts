import type { Ref } from "vue";
import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/router-sdk";

import type { Token } from "dapp-types";

import { contractsAddresses } from "@/helpers/contracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";
import { mockWeb3Onboard } from "@/helpers/onboard";

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

const getEnterExpectedPriceRate = (
  oraclePrice: Ref<number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Trade<never, never, never>
) => {
  return oraclePrice.value; // default to 1000
};

const getExitExpectedPriceRate = (
  oraclePrice: Ref<number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Trade<never, never, never>
) => {
  return 1 / oraclePrice.value; // default to 0.001,
};

const getRecipientAddress = (): string => {
  return mockWeb3Onboard.wallets[0]?.accounts[0]?.address;
};

const evaluatePremium = (routerPremium: number, premiumSlippage: number) =>
  routerPremium + (premiumSlippage * routerPremium) / 100;

export {
  convertCollateralToUniswapToken,
  convertQuoteUniswapTokenToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
  getRecipientAddress,
  evaluatePremium,
};
