import { network, ethers } from "hardhat";
import { Deployments as PotionProtocolDeployments } from "@potion-protocol/core";
import { PotionHedgingVaultConfigParams } from "./config/deployConfig";
import { getDeploymentConfig, deployTestingEnv } from "./test/TestingEnv";
import { getDeploymentType } from "contracts-utils";
import type { DeploymentType } from "contracts-utils";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { DeploymentFlags, Deployments } from "contracts-utils";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const potionProtocolDeployment = PotionProtocolDeployments["localhost"];
if (!potionProtocolDeployment) {
    throw new Error(`No deploy config found for network '${network.name}'`);
}

async function main() {
    const deploymentType: DeploymentType = getDeploymentType();

    const deployments = Deployments.Init({
        type: deploymentType,
        options: DeploymentFlags.Export | DeploymentFlags.Verify,
        deploymentsDir: resolve(__dirname, "../deployments"),
        indexDir: resolve(__dirname, "../src"),
    });

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`---------------------------------------------------`);
    console.log(` Hedging Vault Deployment Script`);
    console.log(`---------------------------------------------------`);
    console.log(`- Provider: ${deploymentType.provider}`);
    console.log(`- Network: ${deploymentType.network}`);
    console.log(`- Config: ${deploymentType.config}`);
    console.log(`- Deployer: ${deployer}`);
    console.log(`---------------------------------------------------\n`);

    const deploymentConfig: PotionHedgingVaultConfigParams = getDeploymentConfig(deploymentType);
    if (!deploymentConfig) {
        throw new Error(
            `No deploy config found for deployment type '${Deployments.GetDeploymentNameFromType(deploymentType)}'`,
        );
    }

    await deployTestingEnv(deploymentConfig, true);
    deployments.persist(true);

    console.log("Deployment complete");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
