import { ethers } from "hardhat";
import { PotionLiquidityPool } from "../typechain";
import { config as deployConfiguration } from "./lib/deployConfig";
import type { NetworkDeployConfig } from "./lib/deployConfig";
import { Deployment } from "../deployments/deploymentConfig";
import { executePostDeployActions } from "./lib/postDeploy";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { DeploymentFlags, Deployments, getDeploymentType } from "contracts-utils";
import type { DeploymentContract } from "contracts-utils";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const ADDRESS_BOOK_CONTRACT_NAME = "AddressBook";
const OTOKEN_FACTORY_CONTRACT_NAME = "OtokenFactory";
const OTOKEN_CONTRACT_NAME = "Otoken";
const WHITELIST_CONTRACT_NAME = "Whitelist";
const ORACLE_CONTRACT_NAME = "Oracle";
const MARGIN_POOL_CONTRACT_NAME = "MarginPool";
const MARGIN_CALCULATOR_CONTRACT_NAME = "MarginCalculator";
const CONTROLLER_CONTRACT_NAME = "Controller";
const MARGIN_VAULT_LIB_NAME = "MarginVaultLib";
const CONTRACTS_TO_DEPLOY_WITH_NO_PARAM = [OTOKEN_CONTRACT_NAME, ORACLE_CONTRACT_NAME];
const CONTRACTS_TO_DEPLOY_WITH_ORACLE_PARAM = [MARGIN_CALCULATOR_CONTRACT_NAME];
const CONTRACTS_TO_DEPLOY_WITH_ADDRESSBOOK_PARAM = [
    OTOKEN_FACTORY_CONTRACT_NAME,
    WHITELIST_CONTRACT_NAME,
    MARGIN_POOL_CONTRACT_NAME,
];
const contractAddresses = new Map();

let deployConfig: NetworkDeployConfig;

async function init() {
    const deploymentType = getDeploymentType();

    Deployments.initialize({
        type: deploymentType,
        options: DeploymentFlags.Export | DeploymentFlags.Verify,
        deploymentsDir: resolve(__dirname, "../deployments"),
        indexDir: resolve(__dirname, "../src"),
    });

    const deploymentTypeName = Deployments.getDeploymentNameFromType(deploymentType);
    const legacyDeploymentTypeName = Deployments.getLegacyDeploymentNameFromType(deploymentType);

    deployConfig = deployConfiguration[deploymentTypeName];

    if (!deployConfig) {
        deployConfig = deployConfiguration[legacyDeploymentTypeName];
    }

    if (!deployConfig) {
        throw new Error(
            `No deploy config found for deployment type '${deploymentTypeName}' or '${legacyDeploymentTypeName}'`,
        );
    }

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`---------------------------------------------------`);
    console.log(` Potion Protocol Deployment Script`);
    console.log(`---------------------------------------------------`);
    console.log(`- Provider: ${deploymentType.provider}`);
    console.log(`- Network: ${deploymentType.network}`);
    console.log(`- Config: ${deploymentType.config}`);
    console.log(`- Deployer: ${deployer}`);
    console.log(`---------------------------------------------------\n`);
}

// Deploys a faucet token for use as test collateral, and returns its address
async function deployCollateralToken(): Promise<string> {
    process.stdout.write(`Deploying test collateral token (PUSDC)...`);
    const token = await Deployments.deploy("PotionTestUSD", [], { alias: "USDC" });

    console.log(` deployed at ${token.address}`);
    return token.address;
}

async function updateAddressBook(addressbook: DeploymentContract) {
    console.log(`Updating address book at ${addressbook.address}:`);
    let trx = await addressbook.setOtokenFactory(contractAddresses.get(OTOKEN_FACTORY_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${OTOKEN_FACTORY_CONTRACT_NAME}         to ${await addressbook.getOtokenFactory()}`);
    trx = await addressbook.setOtokenImpl(contractAddresses.get(OTOKEN_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${OTOKEN_CONTRACT_NAME}                to ${await addressbook.getOtokenImpl()}`);
    trx = await addressbook.setWhitelist(contractAddresses.get(WHITELIST_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${WHITELIST_CONTRACT_NAME}             to ${await addressbook.getWhitelist()}`);
    trx = await addressbook.setOracle(contractAddresses.get(ORACLE_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${ORACLE_CONTRACT_NAME}                to ${await addressbook.getOracle()}`);
    trx = await addressbook.setMarginPool(contractAddresses.get(MARGIN_POOL_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${MARGIN_POOL_CONTRACT_NAME}            to ${await addressbook.getMarginPool()}`);
    trx = await addressbook.setMarginCalculator(contractAddresses.get(MARGIN_CALCULATOR_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${MARGIN_CALCULATOR_CONTRACT_NAME}      to ${await addressbook.getMarginCalculator()}`);
    trx = await addressbook.setController(contractAddresses.get(CONTROLLER_CONTRACT_NAME));
    await trx.wait();
    console.log(` - Set ${CONTROLLER_CONTRACT_NAME}            to ${await addressbook.getController()}`);
}

// Deploys all of the Opyn contracts and returns the address of the addressbook contract
async function deployOpynContracts(): Promise<string> {
    console.log("Deploying Opyn Gamma protocol...");

    // Deploy the address book and other Opyn contracts
    const addressbook = await Deployments.deploy(ADDRESS_BOOK_CONTRACT_NAME);

    // Deploy contracts that take no constructor params
    for (const contractName of CONTRACTS_TO_DEPLOY_WITH_NO_PARAM) {
        const deployedContract = await Deployments.deploy(contractName);
        contractAddresses.set(contractName, deployedContract.address);
    }

    // Deploy contracts that take the oracle as a constructor param
    for (const contractName of CONTRACTS_TO_DEPLOY_WITH_ORACLE_PARAM) {
        const deployedContract = await Deployments.deploy(contractName, [contractAddresses.get(ORACLE_CONTRACT_NAME)]);
        contractAddresses.set(contractName, deployedContract.address);
    }

    // Deploy contracts that take the address book as a constructor param
    for (const contractName of CONTRACTS_TO_DEPLOY_WITH_ADDRESSBOOK_PARAM) {
        const deployedContract = await Deployments.deploy(contractName, [addressbook.address]);
        contractAddresses.set(contractName, deployedContract.address);
    }

    // Deploy Controller including linked library
    const marginVaultLib = await Deployments.deploy("MarginVault");
    contractAddresses.set(MARGIN_VAULT_LIB_NAME, marginVaultLib.address);

    const controller = await Deployments.deploy(CONTROLLER_CONTRACT_NAME, [], {
        libraries: {
            MarginVault: marginVaultLib.address,
        },
    });
    contractAddresses.set(CONTROLLER_CONTRACT_NAME, controller.address);

    await updateAddressBook(addressbook);

    return addressbook.address;
}

async function main() {
    await init();

    if (!deployConfig.opynAddressBook) {
        deployConfig.opynAddressBook = await deployOpynContracts();
    }
    const addressBook = await Deployments.attach("AddressBook", deployConfig.opynAddressBook);
    const otokenFactoryAddress = await addressBook.getOtokenFactory();
    const whitelistAddress = await addressBook.getWhitelist();

    if (!deployConfig.collateralToken) {
        deployConfig.collateralToken = await deployCollateralToken();
    } else {
        Deployments.attach("ERC20", deployConfig.collateralToken, "USDC");
    }

    process.stdout.write(`Deploying CurveManager... `);
    const curveManager = await Deployments.deploy("CurveManager");
    console.log(`deployed at ${curveManager.address}`);

    process.stdout.write(`Deploying CriteriaManager... `);
    const criteriaManager = await Deployments.deploy("CriteriaManager");
    console.log(`deployed at ${criteriaManager.address}`);

    process.stdout.write(`Deploying PotionLiquidityPool... `);
    const potionLiquidityPool = (await Deployments.deploy(
        "PotionLiquidityPool",
        [deployConfig.opynAddressBook, deployConfig.collateralToken, curveManager.address, criteriaManager.address],
        {
            options: DeploymentFlags.Export | DeploymentFlags.Verify | DeploymentFlags.Upgradeable,
        },
    )) as PotionLiquidityPool;

    const deployment = new Deployment({
        opynAddressBookAddress: deployConfig.opynAddressBook,
        collateralTokenAddress: deployConfig.collateralToken,
        potionLiquidityPoolAddress: potionLiquidityPool.address,
        curveManagerAddress: curveManager.address,
        criteriaManagerAddress: criteriaManager.address,
        marginVaultLibAddress: contractAddresses.get(MARGIN_VAULT_LIB_NAME),
        otokenFactoryAddress: otokenFactoryAddress,
        whitelistAddress: whitelistAddress,
    });
    console.log(`deployed at ${potionLiquidityPool.address}`);

    if (deployConfig.postDeployActions && deployConfig.postDeployActions.length > 0) {
        // Note that executePostDeployActions may persist updated config after every successful action
        await executePostDeployActions(deployConfig.postDeployActions, deployment, true);
    }

    Deployments.persist(true);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
