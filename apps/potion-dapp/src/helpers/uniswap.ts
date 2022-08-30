// TODO: Add USDC and WETH address for goerli

import { ChainId } from "@uniswap/smart-order-router";

const getChainId = () => {
  switch (import.meta.env.VITE_ETHEREUM_NETWORK) {
    case "goerli":
      return ChainId.GÖRLI;
    default:
      return ChainId.MAINNET;
  }
};

const getUSDCAddress = () => {
  switch (import.meta.env.VITE_ETHEREUM_NETWORK) {
    case "goerli":
      return "";
    default:
      return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  }
};

const getWETHAddress = () => {
  switch (import.meta.env.VITE_ETHEREUM_NETWORK) {
    case "goerli":
      return "";
    default:
      return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  }
};

export { getChainId, getUSDCAddress, getWETHAddress };
