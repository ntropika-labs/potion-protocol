import type { Ref } from "vue";
import type { BigNumberish } from "ethers";
import { Token as UniswapToken } from "@uniswap/sdk-core";

import type { Token } from "dapp-types";

import { contractsAddresses } from "./hedgingVaultContracts";
import { getChainId } from "@/helpers/uniswap";

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertQuoteUniswapTokenToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
    decimals: uniToken.decimals,
  };
};

const getEnterExpectedPriceRate = (
  _: Ref<number>,
  tradePrice: BigNumberish
) => {
  return tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

const getExitExpectedPriceRate = (_: Ref<number>, tradePrice: BigNumberish) => {
  return tradePrice.toString(); //The expected price of the swap as a fixed point SD59x18 number
};

const getRecipientAddress = (): string => {
  const { PotionBuyAction } = contractsAddresses;

  return PotionBuyAction.address;
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
