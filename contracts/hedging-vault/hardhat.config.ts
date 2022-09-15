import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

import "./tasks/accounts";
import "./tasks/clean";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

import { getChainConfig, getHardhatChainConfig, getLocalhostChainConfig, getEtherscanApiKey } from "./hardhat.helpers";

import "./tasks/fast-forward";
import "./tasks/set-prices";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    gasReporter: {
        currency: "USD",
        coinmarketcap: `${process.env.COINMARKETCAP_API_KEY}`,
        enabled: !!(process.env.GAS_REPORT_FILE && process.env.GAS_REPORT_FILE != "false"),
        excludeContracts: [],
        src: "./contracts",
        outputFile: process.env.GAS_REPORT_FILE,
    },
    networks: {
        localhost: getLocalhostChainConfig(),
        hardhat: getHardhatChainConfig(),
        goerli: getChainConfig("goerli"),
        kovan: getChainConfig("kovan"),
        rinkeby: getChainConfig("rinkeby"),
        ropsten: getChainConfig("ropsten"),
        "arb-mainnet": getChainConfig("arb-mainnet"),
        "arb-rinkeby": getChainConfig("arb-rinkeby"),
        "ply-mainnet": getChainConfig("ply-mainnet"),
        "ply-mumbai": getChainConfig("ply-mumbai"),
        "opt-mainnet": getChainConfig("opt-mainnet"),
        "opt-kovan": getChainConfig("opt-kovan"),
        "palm-mainnet": getChainConfig("palm-mainnet"),
        "palm-rinkeby": getChainConfig("palm-rinkeby"),
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
                version: "0.8.14",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                    outputSelection: {
                        "*": {
                            "*": ["storageLayout"],
                        },
                    },
                },
            },
        ],
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
};

export default config;
