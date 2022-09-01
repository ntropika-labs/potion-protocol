import { ethers } from "hardhat";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { deploy, initDeployment, exportDeployments, DeploymentOptions } from "./utils/deployment";
import { getHardhatNetworkName, getDeploymentsNetworkName } from "./utils/network";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const networkName = getDeploymentsNetworkName();

async function init() {
    await initDeployment();

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`Using network ${networkName}`);
    console.log(`Deploying from ${deployer}\n`);
}

async function deployUnderlyingToken(name: string, symbol: string, decimals = 18): Promise<string> {
    const networkName = getHardhatNetworkName();

    console.log(`--- Deploying test underlying token ${symbol} (${name}) with ${decimals} decimals ---`);
    const token = await deploy("TestERC20MinterPauser", [name, symbol, decimals], {
        alias: symbol,
        options:
            networkName === "localhost"
                ? DeploymentOptions.DeployAndExport
                : DeploymentOptions.DeployAndExportAndVerify,
        contract: "contracts/test/TestERC20MinterPauser.sol:TestERC20MinterPauser",
    });

    console.log(`\nToken ${symbol} (${name}) deployed at ${token.address}\n`);
    return token.address;
}

async function deployChainlinkAggregatorUSDC(): Promise<string> {
    const networkName = getHardhatNetworkName();

    console.log(`--- Deploying Chainlink Aggregator for USDC ---`);
    const aggregator = await deploy("ChainlinkAggregatorUSDC", [], {
        options:
            networkName === "localhost"
                ? DeploymentOptions.DeployAndExport
                : DeploymentOptions.DeployAndExportAndVerify,
    });

    console.log(`\nChainlink Aggregator for USDC deployed at ${aggregator.address}\n`);
    return aggregator.address;
}

async function main() {
    await init();

    const underlyingTokens = [
        {
            name: "PotionTestWETH",
            symbol: "WETH",
            decimals: 18,
        },
        {
            name: "PotionTestWBTC",
            symbol: "WBTC",
            decimals: 18,
        },
        {
            name: "PotionTestUSDC",
            symbol: "USDC",
            decimals: 6,
        },
    ];

    for (const underlyingToken of underlyingTokens) {
        const { name, symbol, decimals } = underlyingToken;
        await deployUnderlyingToken(name, symbol, decimals);
    }

    await deployChainlinkAggregatorUSDC();

    await exportDeployments();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
