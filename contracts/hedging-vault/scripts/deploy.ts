import { PotionHedgingVaultConfigParams } from "./config/deployConfig";
import { getDeploymentConfig, deployHedgingVaultEnvironment } from "./hedging-vault/deployHedgingVaultEnvironment";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { DeploymentFlags, Deployments, getDeploymentType } from "contracts-utils";
import type { DeploymentType } from "contracts-utils";
import { ethers } from "hardhat";
import { verifyHedgingVaultEnvironment } from "./hedging-vault/verifyHedgingVaultEnvironment";

dotenvConfig({ path: resolve(__dirname, "./.env") });

async function main() {
    const deploymentType: DeploymentType = getDeploymentType();

    Deployments.initialize({
        type: deploymentType,
        options: DeploymentFlags.Export,
        deploymentsDir: resolve(__dirname, "../deployments"),
        indexDir: resolve(__dirname, "../src"),
    });

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`--------------------------------------------------------------------------------`);
    console.log(`                         Hedging Vault Deployment`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`- Provider: ${deploymentType.provider}`);
    console.log(`- Network: ${deploymentType.network}`);
    console.log(`- Config: ${deploymentType.config}`);
    console.log(`- Deployer: ${deployer}`);
    console.log(`---------------------------------------------------\n`);

    const deploymentConfig: PotionHedgingVaultConfigParams = getDeploymentConfig(deploymentType);
    if (!deploymentConfig) {
        throw new Error(
            `No deploy config found for deployment type '${Deployments.getDeploymentNameFromType(deploymentType)}'`,
        );
    }

    const hedgingVaultEnvironment = await deployHedgingVaultEnvironment(deploymentConfig);
    await verifyHedgingVaultEnvironment(deploymentConfig, hedgingVaultEnvironment);

    Deployments.persist(true);

    console.log("\n[DEPLOYMENT COMPLETE]\n");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
