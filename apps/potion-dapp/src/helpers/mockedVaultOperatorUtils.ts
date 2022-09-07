import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/router-sdk";

import type { Token } from "dapp-types";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { getChainId, getWETHAddress } from "@/helpers/uniswap";
import type { Ref } from "vue";

const convertCollateralToUniswapToken = (token: Token): UniswapToken => {
  return new UniswapToken(
    getChainId(),
    getWETHAddress(),
    token.decimals || 0,
    token.symbol,
    token.name
  );
};

const convertInputToToken = (uniToken: UniswapToken): Token => {
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

export {
  convertCollateralToUniswapToken,
  convertInputToToken,
  getEnterExpectedPriceRate,
  getExitExpectedPriceRate,
};
