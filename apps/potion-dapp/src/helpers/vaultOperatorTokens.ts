import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/router-sdk";

import type { Token } from "dapp-types";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";
import type { Ref } from "vue";

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
  routeTrade: Trade<any, any, any>
) => {
  return IS_DEV_ENV
    ? oraclePrice.value //1000,
    : routeTrade.executionPrice.toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
};

const getExitExpectedPriceRate = (
  oraclePrice: Ref<number>,
  routeTrade: Trade<any, any, any>
) => {
  return IS_DEV_ENV
    ? 1 / oraclePrice.value //0.001,
    : routeTrade.executionPrice.invert().toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
};

export {
  convertCollateralToUniswapToken,
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
};
