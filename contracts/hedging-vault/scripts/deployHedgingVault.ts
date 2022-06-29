import type { Contract } from "ethers";
import { network, ethers } from "hardhat";
import { Deployments as PotionProtocolDeployments } from "@potion-protocol/core";
import { InvestmentVault, PotionBuyAction } from "../typechain";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { deploy, deployUpgrade, initDeployment, exportDeployments, exportContract } from "./utils/deployment";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const deployConfig = PotionProtocolDeployments["localhost"];
if (!deployConfig) {
    throw new Error(`No deploy config found for network '${network.name}'`);
}

async function init() {
    await initDeployment();

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`Using network ${network.name}`);
    console.log(`Deploying from ${deployer}`);
}

interface PotionBuyActionDeployParams {
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    investmentAsset: string;
    USDC: string;
    potionLiquidityPoolManager: string;
    maxPremiumPercentage: number;
    premiumSlippage: number;
    swapSlippage: number;
    maxSwapDurationSecs: number;
    cycleDurationSecs: number;
}

async function deployPotionBuyAction(parameters: PotionBuyActionDeployParams) {
    const potionBuyAction: Contract = await deployUpgrade("PotionBuyAction", [
        parameters.adminAddress,
        parameters.strategistAddress,
        parameters.operatorAddress,
        parameters.investmentAsset,
        parameters.USDC,
        parameters.potionLiquidityPoolManager,
        parameters.maxPremiumPercentage,
        parameters.premiumSlippage,
        parameters.swapSlippage,
        parameters.maxSwapDurationSecs,
        parameters.cycleDurationSecs,
    ]);
}

async function main() {
    await init();

    await exportDeployments();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
