import { Token as UniswapToken, Price } from "@uniswap/sdk-core";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";

import type { Ref } from "vue";
import type { Token } from "dapp-types";
import type { Currency } from "@uniswap/sdk-core";

const IS_DEV_ENV = import.meta.env.DEV;

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    IS_DEV_ENV ? getWETHAddress() : token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertInputToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: IS_DEV_ENV ? contractsAddresses.USDC.address : uniToken.address,
    decimals: uniToken.decimals,
  };
};

const getEnterExpectedPriceRate = (
  oraclePrice: Ref<number>,
  tradePrice: Price<Currency, Currency>
) => {
  return IS_DEV_ENV
    ? oraclePrice.value //1000,
    : tradePrice.toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
};

const getExitExpectedPriceRate = (
  oraclePrice: Ref<number>,
  tradePrice: Price<Currency, Currency>
) => {
  return IS_DEV_ENV
    ? 1 / oraclePrice.value //0.001,
    : tradePrice.invert().toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
};

export {
  convertCollateralToUniswapToken,
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
};
