import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-truffle5";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "solidity-docgen";

import type { HardhatUserConfig } from "hardhat/config";

import {
  getChainConfig,
  getHardhatChainConfig,
  getLocalhostChainConfig,
  getEtherscanApiKey,
} from "./hardhat.helpers";

export const DefaultHardhatConfig: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    coinmarketcap: `${process.env.COINMARKETCAP_API_KEY}`,
    enabled: process.env.ENABLE_GAS_REPORT === "true",
    excludeContracts: [],
    src: "./contracts",
    outputFile: process.env.GAS_REPORT_FILE,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  networks: {
    localhost: getLocalhostChainConfig(),
    hardhat: getHardhatChainConfig(),
    goerli: getChainConfig("goerli"),
    sepolia: getChainConfig("sepolia"),
    "arb-mainnet": getChainConfig("arb-mainnet"),
    "arb-rinkeby": getChainConfig("arb-rinkeby"),
    "ply-mainnet": getChainConfig("ply-mainnet"),
    "ply-mumbai": getChainConfig("ply-mumbai"),
    "opt-mainnet": getChainConfig("opt-mainnet"),
    "opt-kovan": getChainConfig("opt-kovan"),
    "palm-mainnet": getChainConfig("palm-mainnet"),
    "palm-rinkeby": getChainConfig("palm-rinkeby"),
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 2,
    pretty: false,
  },
  etherscan: {
    apiKey: getEtherscanApiKey(),
  },
  docgen: {
    outputDir: "reference",
    templates: "templates",
  },
};

export function getHardhatConfig(userConfig: HardhatUserConfig) {
  return Object.assign({}, DefaultHardhatConfig, userConfig);
}