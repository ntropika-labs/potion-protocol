import { network, ethers } from "hardhat";
import { Deployments as PotionProtocolDeployments } from "@potion-protocol/core";
import { PotionHedgingVaultConfigParams } from "./config/deployConfig";
import { getDeploymentConfig, deployTestingEnv } from "./test/TestingEnv";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { initDeployment, exportDeployments } from "./utils/deployment";
import { getDeploymentsNetworkName, getHardhatNetworkName } from "./utils/network";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const potionProtocolDeployment = PotionProtocolDeployments["localhost"];
if (!potionProtocolDeployment) {
    throw new Error(`No deploy config found for network '${network.name}'`);
}

async function main() {
    const networkName = getHardhatNetworkName();
    const deploymentNetworkName = getDeploymentsNetworkName();

    await initDeployment();

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`---------------------------------------------------`);
    console.log(` Hedging Vault Deployment Script`);
    console.log(`---------------------------------------------------`);
    console.log(`- Network ${networkName}`);
    console.log(`- Deployment Config '${deploymentNetworkName}'`);
    console.log(`- Deployer: ${deployer}`);
    console.log(`---------------------------------------------------\n`);

    const deploymentConfig: PotionHedgingVaultConfigParams = getDeploymentConfig(deploymentNetworkName);
    if (!deploymentConfig) {
        throw new Error(`No deploy config found for network '${networkName}'`);
    }

    await deployTestingEnv(deploymentConfig, true);
    await exportDeployments();

    console.log("Deployment complete");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
