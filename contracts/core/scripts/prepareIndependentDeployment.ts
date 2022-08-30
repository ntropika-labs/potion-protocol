import { network, ethers } from "hardhat";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { deploy, initDeployment, exportDeployments, exportContract } from "./utils/deployment";

dotenvConfig({ path: resolve(__dirname, "./.env") });

let networkName = network.name;
if (process.env.NETWORK_SUFFIX) {
    networkName = networkName + "." + process.env.NETWORK_SUFFIX;
}

async function init() {
    await initDeployment("independent");

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`Using network ${networkName}`);
    console.log(`Deploying from ${deployer}`);
}

async function deployUnderlyingToken(name: string, symbol: string, decimals = 18): Promise<string> {
    process.stdout.write(`Deploying test underlying token ${symbol} (${name}) with ${decimals} decimals... `);
    const token = await deploy("FaucetToken", [0, name, decimals, symbol], { alias: symbol });

    console.log(` deployed at ${token.address}`);
    return token.address;
}

async function deployChainlinkAggregatorUSDC(): Promise<string> {
    process.stdout.write(`Deploying Chainlink Aggregator for USDC... `);
    const aggregator = await deploy("ChainlinkAggregatorUSDC");

    console.log(` deployed at ${aggregator.address}`);
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
