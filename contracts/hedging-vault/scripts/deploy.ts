import { network, ethers } from "hardhat";
import { Deployments as PotionProtocolDeployments } from "@potion-protocol/core";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { initDeployment, exportDeployments } from "./utils/deployment";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const potionProtocolDeployment = PotionProtocolDeployments["localhost"];
if (!potionProtocolDeployment) {
    throw new Error(`No deploy config found for network '${network.name}'`);
}

async function main() {
    await initDeployment();

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`Using network ${network.name}`);
    console.log(`Deploying from ${deployer}`);

    // TODO

    await exportDeployments();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
