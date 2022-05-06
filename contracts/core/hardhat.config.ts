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
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                },
            },
            {
                version: "0.6.10",
                settings: {
                    optimizer: {
                        enabled: true,
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
        flat: true,
        only: [
            // There are lots of contracts, which have many direct and indirect dependencies
            // To avoid clutter, we only export the ABIs that we need
            // As we are flattening the output, we must also take care not to avoid duplicate contract names or one will overwrite the other
            // These are generally used in the vue or subgraph code to test or interact with our contracts
            ":PotionLiquidityPool$",
            ":ICriteriaManager$",
            ":ICurveManager$",
            ":IERC20MetadataUpgradeable$",
            ":ERC20$",
            // scripts/compareAbis.ts checks that our interface definitions are up to date
            // To facilitate this, we dump ABIs for our interfaces and for each of the contracts they represent
            // Some of these are alos required for the vue or subgraph code
            "opynInterface/*",
            "gamma-protocol.*:Otoken$",
            "gamma-protocol.*:OtokenFactory$",
            "gamma-protocol.*:Whitelist$",
            "gamma-protocol.*:Controller$",
            "gamma-protocol.*:AddressBook$",
            "gamma-protocol.*:MarginCalculator$",
            "gamma-protocol.*:Oracle$",
        ],
        spacing: 2,
        pretty: false,
    },
    etherscan: {
        apiKey: getEtherscanApiKey(),
    },
};

export default config;
