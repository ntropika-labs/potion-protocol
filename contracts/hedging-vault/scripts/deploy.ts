import { PotionHedgingVaultConfigParams } from "./config/deployConfig";
import { getDeploymentConfig, deployTestingEnv } from "./test/testingEnv";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { DeploymentFlags, Deployments, getDeploymentType } from "contracts-utils";
import type { DeploymentType } from "contracts-utils";
import { ethers } from "hardhat";

dotenvConfig({ path: resolve(__dirname, "./.env") });

async function main() {
    const deploymentType: DeploymentType = getDeploymentType();

    Deployments.initialize({
        type: deploymentType,
        options: DeploymentFlags.Export | DeploymentFlags.Verify,
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

    const deployment = await deployTestingEnv(deploymentConfig);

    Deployments.persist(true);

    // Deposit some amount
    const underlyingDecimals = await deployment.underlyingAsset.decimals();

    const mintAmount = ethers.utils.parseUnits("100000000", underlyingDecimals);
    await deployment.underlyingAsset.mint(deployer, mintAmount);
    await deployment.underlyingAsset.approve(deployment.roundsInputVault.address, ethers.constants.MaxUint256);

    const depositAmount = ethers.utils.parseUnits("10000000", underlyingDecimals);
    await deployment.roundsInputVault.deposit(depositAmount, deployer);

    console.log(
        `- Deposited ${ethers.utils.formatUnits(depositAmount, underlyingDecimals)} into vault for config ${
            deploymentType.config
        }`,
    );

    console.log("\n[DEPLOYMENT COMPLETE]\n");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
