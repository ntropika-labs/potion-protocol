import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";

import hre from "hardhat";
import { ethers, network, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { FactoryOptions } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

const NUM_CONFIRMATIONS_WAIT = 5;
const deploymentsDir = resolve(__dirname, "../../deployments");

export enum DeploymentFlags {
    Deploy = 1 << 0,
    DeployAndVerify = 1 << 1,
}

export async function initDeployment() {
    // Initialize deployment info
    const latestDeploymentFilename = network.name + ".json";
    const latestDeploymentPath = resolve(deploymentsDir, latestDeploymentFilename);

    // Cycle the previous deployment info to keep a history of deployments. When deploying to localhost
    // only the latest deployment is kept.
    if (network.name !== "localhost" && network.name !== "hardhat" && fs.existsSync(latestDeploymentPath)) {
        const latestDeployment = JSON.parse(fs.readFileSync(latestDeploymentPath, "utf8"));
        const timestamp = latestDeployment.timestamp;

        const newDeploymentPath = resolve(deploymentsDir, network.name + "-" + timestamp + ".json");
        fs.renameSync(latestDeploymentPath, newDeploymentPath);
    }

    const deploymentsObject = {
        timestamp: Math.floor(new Date().getTime() / 1000),
        network: network.name,
        contracts: {},
    };

    fs.writeFileSync(latestDeploymentPath, JSON.stringify(deploymentsObject, null, 2));
}

export async function exportContract(name: string, address: string, blockNumber: number) {
    // Export deployment info
    const latestDeploymentFilename = network.name + ".json";
    const latestDeploymentPath = resolve(deploymentsDir, latestDeploymentFilename);

    if (!fs.existsSync(latestDeploymentPath)) {
        throw new Error("initDeployment must be called first before calling deploy");
    }

    const latestDeployment = JSON.parse(fs.readFileSync(latestDeploymentPath, "utf8"));
    latestDeployment.contracts[name] = { address, blockNumber };
    fs.writeFileSync(latestDeploymentPath, JSON.stringify(latestDeployment, null, 2));
}

export async function verify(contractAddress: string, args: unknown[]): Promise<boolean> {
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        console.error(error);
        return false;
    }

    return true;
}

export async function deploy(
    contractName: string,
    args: unknown[] = [],
    options: Signer | FactoryOptions | undefined = undefined,
    flags: DeploymentFlags = DeploymentFlags.Deploy,
): Promise<Contract> {
    const contractFactory = await ethers.getContractFactory(contractName, options);
    const contract = await contractFactory.deploy(...args);
    const transactionReceipt = await contract.deployTransaction.wait();

    // Export the deployed contract
    await exportContract(contractName, contract.address, transactionReceipt.blockNumber);

    if ((flags & DeploymentFlags.DeployAndVerify) === DeploymentFlags.DeployAndVerify) {
        await contract.deployTransaction.wait(NUM_CONFIRMATIONS_WAIT);
        await verify(contract.address, args);
    }

    return contract.deployed();
}

export async function deployUpgrade(
    contractName: string,
    args: unknown[] = [],
    options: Signer | FactoryOptions | undefined = undefined,
    flags: DeploymentFlags = DeploymentFlags.Deploy,
): Promise<Contract> {
    const contractFactory = await ethers.getContractFactory(contractName, options);
    const contract = await upgrades.deployProxy(contractFactory, args);
    const transactionReceipt = await contract.deployTransaction.wait();

    // Export the deployed contract
    await exportContract(contractName, contract.address, transactionReceipt.blockNumber);

    if ((flags & DeploymentFlags.DeployAndVerify) === DeploymentFlags.DeployAndVerify) {
        await contract.deployTransaction.wait(NUM_CONFIRMATIONS_WAIT);
        await verify(contract.address, args);
    }

    return contract.deployed();
}
