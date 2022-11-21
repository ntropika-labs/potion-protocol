import { ethers } from "hardhat";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { Deployments, DeploymentFlags, getDeploymentType } from "contracts-utils";

dotenvConfig({ path: resolve(__dirname, "./.env") });

async function init() {
    const deploymentType = getDeploymentType();

    await Deployments.initialize({
        type: deploymentType,
        options: DeploymentFlags.Export | DeploymentFlags.Verify,
        deploymentsDir: resolve(__dirname, "../deployments"),
        indexDir: resolve(__dirname, "../../src"),
    });

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`---------------------------------------------------`);
    console.log(` Independent Deployment Preparation Script`);
    console.log(`---------------------------------------------------`);
    console.log(`- Provider: ${deploymentType.provider}`);
    console.log(`- Network: ${deploymentType.network}`);
    console.log(`- Config: ${deploymentType.config}`);
    console.log(`- Deployer: ${deployer}`);
    console.log(`---------------------------------------------------\n`);
}

async function deployToken(name: string, symbol: string, decimals = 18): Promise<string> {
    console.log(`--- Deploying token ${symbol} (${name}) with ${decimals} decimals ---`);
    const token = await Deployments.deploy("TestERC20MinterPauser", [name, symbol, decimals], {
        alias: symbol,
        contract: "contracts/test/TestERC20MinterPauser.sol:TestERC20MinterPauser",
    });

    console.log(`\nToken ${symbol} (${name}) deployed at ${token.address}\n`);
    return token.address;
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
            decimals: 8,
        },
        {
            name: "PotionTestLINK",
            symbol: "LINK",
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
        await deployToken(name, symbol, decimals);
    }

    Deployments.persist(true);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });