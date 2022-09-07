import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/router-sdk";

import type { Token } from "dapp-types";

import { getChainId } from "@/helpers/uniswap";
import type { Ref } from "vue";
import { contractsAddresses } from "./hedgingVaultContracts";

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    token.address,
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertInputToToken = (uniToken: UniswapToken): Token => {
  return {
    name: uniToken.name || "",
    symbol: uniToken.symbol || "",
    address: uniToken.address,
    decimals: uniToken.decimals,
  };
};

const getEnterExpectedPriceRate = (
  _: Ref<number>,
  routeTrade: Trade<any, any, any>
) => {
  return routeTrade.executionPrice.toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
};

const getExitExpectedPriceRate = (
  _: Ref<number>,
  routeTrade: Trade<any, any, any>
) => {
  return routeTrade.executionPrice.invert().toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
};

const getRecipientAddress = () => {
  const { PotionBuyAction } = contractsAddresses;

  return PotionBuyAction.address;
};

export {
  convertCollateralToUniswapToken,
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
  getRecipientAddress,
};
