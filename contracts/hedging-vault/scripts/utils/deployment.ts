import { config as dotenvConfig } from "dotenv";
import { Contract, Signer, BaseContract } from "ethers";
import fs from "fs";
import hre, { ethers, upgrades } from "hardhat";
import { FactoryOptions } from "hardhat/types";
import { resolve } from "path";
import { smock, MockContract } from "@defi-wonderland/smock";
import { getDeploymentsNetworkName, getHardhatNetworkName } from "./network";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

const NUM_CONFIRMATIONS_WAIT = 5;
const deploymentsDir = resolve(__dirname, "../../deployments");
const indexDir = resolve(__dirname, "../../src");

const DEPLOYMENTS_INDEX_FILE = "index.ts";

export enum DeploymentFlags {
    Deploy = 1 << 0,
    Export = 1 << 1,
    Verify = 1 << 2,
}

export enum DeploymentOptions {
    Deploy = DeploymentFlags.Deploy,
    DeployAndExport = DeploymentFlags.Deploy | DeploymentFlags.Export,
    DeployAndVerify = DeploymentFlags.Deploy | DeploymentFlags.Verify,
    DeployAndExportAndVerify = DeploymentFlags.Deploy | DeploymentFlags.Export | DeploymentFlags.Verify,
}

let GlobalDefaultDeploymentOptions = { options: DeploymentOptions.Deploy };

export interface DeploymentParams extends FactoryOptions {
    options?: DeploymentOptions;
    alias?: string; // The deployed contract will be exported in the JSON file with this alias
    contract?: string; // Path and name of the contract to be verified i.e.: contracts/Example.sol:ExampleContract
}

export function isDeploymentParams(options: Signer | DeploymentParams | undefined): options is DeploymentParams {
    return (
        options !== undefined &&
        ((options as DeploymentParams).options !== undefined || (options as DeploymentParams).alias !== undefined)
    );
}

export async function initDeployment(
    defaultDeploymentOptions = { options: DeploymentOptions.DeployAndExportAndVerify },
) {
    GlobalDefaultDeploymentOptions = defaultDeploymentOptions;

    const deploymentNetworkName = getDeploymentsNetworkName();
    const hardatNetworkName = getHardhatNetworkName();

    // Initialize deployment info
    const latestDeploymentFilename = deploymentNetworkName + ".json";
    const latestDeploymentPath = resolve(deploymentsDir, latestDeploymentFilename);

    // Cycle the previous deployment info to keep a history of deployments. When deploying to localhost
    // only the latest deployment is kept.
    if (hardatNetworkName !== "localhost" && hardatNetworkName !== "hardhat" && fs.existsSync(latestDeploymentPath)) {
        const latestDeployment = JSON.parse(fs.readFileSync(latestDeploymentPath, "utf8"));
        const timestamp = latestDeployment.timestamp;

        const newDeploymentPath = resolve(deploymentsDir, deploymentNetworkName + "-" + timestamp + ".json");
        fs.renameSync(latestDeploymentPath, newDeploymentPath);
    }

    const deploymentsObject = {
        timestamp: Math.floor(new Date().getTime() / 1000),
        network: hardatNetworkName,
        contracts: {},
    };

    fs.writeFileSync(latestDeploymentPath, JSON.stringify(deploymentsObject, null, 2));
}

export async function exportDeployments() {
    const allDeploymentFiles = fs.readdirSync(deploymentsDir);

    // Filter out all deployment files that have a timestamp in them
    const latestDeploymentFiles = allDeploymentFiles.filter(
        fileName => fileName.endsWith(".json") && !/\d/.test(fileName),
    );

    const indexFilePath = resolve(indexDir, DEPLOYMENTS_INDEX_FILE);

    // Not using a stream write here because it simplifies the code and there are only
    // 3 writes in total
    fs.writeFileSync(indexFilePath, `// Autogenerated by the deployments script\n`, "utf8");
    fs.appendFileSync(indexFilePath, `export * as Typechain from "../typechain";`, "utf8");

    const deploymentExport = {};

    latestDeploymentFiles.forEach(file => {
        const deployment = JSON.parse(fs.readFileSync(resolve(deploymentsDir, file), "utf8"));
        const deploymentName = file.replace(".json", "");

        Object.assign(deploymentExport, { [deploymentName]: deployment });
    });

    fs.appendFileSync(
        indexFilePath,
        `\nexport const Deployments = ${JSON.stringify(deploymentExport, null, 2)}`,
        "utf8",
    );
}

export async function exportContract(name: string, address: string, blockNumber: number = 0) {
    const networkName = getDeploymentsNetworkName();

    // Export deployment info
    const latestDeploymentFilename = networkName + ".json";
    const latestDeploymentPath = resolve(deploymentsDir, latestDeploymentFilename);

    if (!fs.existsSync(latestDeploymentPath)) {
        throw new Error("initDeployment must be called first before calling deploy");
    }

    const latestDeployment = JSON.parse(fs.readFileSync(latestDeploymentPath, "utf8"));
    latestDeployment.contracts[name] = { address, blockNumber };
    fs.writeFileSync(latestDeploymentPath, JSON.stringify(latestDeployment, null, 2));
}

export async function verify(
    contractAddress: string,
    args: unknown[],
    contract: unknown = undefined,
): Promise<boolean> {
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
            contract: contract,
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
    params: Signer | DeploymentParams = GlobalDefaultDeploymentOptions,
): Promise<Contract> {
    let options = undefined,
        alias = undefined,
        verifyContract = undefined;

    if (isDeploymentParams(params)) {
        options = params.options;
        alias = params.alias;
        verifyContract = params.contract;
    }

    let contract;
    let transactionReceipt;
    if (options === undefined || options & DeploymentFlags.Deploy) {
        const contractFactory = await ethers.getContractFactory(contractName, params);
        contract = await contractFactory.deploy(...args);
        transactionReceipt = await contract.deployTransaction.wait();
    }

    if (contract === undefined) {
        throw new Error("Contract not deployed, make sure to call deploy with the DeploymentOptions.Deploy flag");
    }
    const networkName = getHardhatNetworkName();

    if (contract && transactionReceipt && networkName !== "hardhat" && options && options & DeploymentFlags.Export) {
        if (alias) {
            await exportContract(alias, contract.address, transactionReceipt.blockNumber);
        } else {
            await exportContract(contractName, contract.address, transactionReceipt.blockNumber);
        }
    }

    if (
        contract &&
        options &&
        options & DeploymentFlags.Verify &&
        networkName !== "localhost" &&
        networkName !== "hardhat"
    ) {
        await contract.deployTransaction.wait(NUM_CONFIRMATIONS_WAIT);
        await verify(contract.address, args, verifyContract);
    }

    return contract.deployed();
}

export async function deployUpgrade(
    contractName: string,
    args: unknown[] = [],
    params: Signer | DeploymentParams = GlobalDefaultDeploymentOptions,
): Promise<Contract> {
    let options = undefined,
        alias = undefined;

    if (isDeploymentParams(params)) {
        options = params.options;
        alias = params.alias;
    }

    let contract;
    let transactionReceipt;
    if (options == undefined || options & DeploymentFlags.Deploy) {
        const contractFactory = await ethers.getContractFactory(contractName, params);
        contract = await upgrades.deployProxy(contractFactory, args);
        transactionReceipt = await contract.deployTransaction.wait();
    }

    if (contract === undefined) {
        throw new Error("Contract not deployed, make sure to call deploy with the DeploymentOptions.Deploy flag");
    }

    const networkName = getHardhatNetworkName();

    // Export the deployed contract
    if (contract && transactionReceipt && networkName !== "hardhat" && options && options & DeploymentFlags.Export) {
        if (alias) {
            await exportContract(alias, contract.address, transactionReceipt.blockNumber);
        } else {
            await exportContract(contractName, contract.address, transactionReceipt.blockNumber);
        }
    }

    if (
        contract &&
        options &&
        options & DeploymentFlags.Verify &&
        networkName !== "localhost" &&
        networkName !== "hardhat"
    ) {
        const implementationAddress = await getImplementationAddress(ethers.provider, contract.address);
        await contract.deployTransaction.wait(NUM_CONFIRMATIONS_WAIT);
        await verify(implementationAddress, args);
    }

    return contract.deployed();
}

export async function deployMock<T extends BaseContract>(
    contractName: string,
    args: unknown[] = [],
    params: Signer | DeploymentParams = GlobalDefaultDeploymentOptions,
): Promise<MockContract<T>> {
    const contractFactory = await smock.mock(contractName);
    const contract = await contractFactory.deploy(...args);
    const transactionReceipt = await contract.deployTransaction.wait();

    let options = undefined,
        alias = undefined;

    if (isDeploymentParams(params)) {
        options = params.options;
        alias = params.alias;
    }

    const networkName = getHardhatNetworkName();

    // Export the deployed contract
    if (contract && transactionReceipt && networkName !== "hardhat" && options && options & DeploymentFlags.Export) {
        if (alias) {
            await exportContract(alias, contract.address, transactionReceipt.blockNumber);
        } else {
            await exportContract(contractName, contract.address, transactionReceipt.blockNumber);
        }
    }

    return contract as unknown as MockContract<T>;
}

export async function attachContract<T extends Contract>(
    contractName: string,
    contractAddress: string,
    params: Signer | DeploymentParams | undefined = undefined,
): Promise<T> {
    let options = undefined,
        alias = undefined;

    if (isDeploymentParams(params)) {
        options = params.options;
        alias = params.alias;
    }

    if (options && options & DeploymentFlags.Export) {
        if (alias) {
            await exportContract(alias, contractAddress);
        } else {
            await exportContract(contractName, contractAddress);
        }
    }

    return ethers.getContractAt(contractName, contractAddress) as Promise<T>;
}
