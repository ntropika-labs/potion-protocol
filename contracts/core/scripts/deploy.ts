import type { Contract } from "ethers";
import { network, ethers } from "hardhat";
import { PotionLiquidityPool } from "../typechain";
import { config as deployConfiguration, NetworkDeployConfig } from "./lib/deployConfig";
import { Deployment } from "../deployments/deploymentConfig";
import { executePostDeployActions } from "./lib/postDeploy";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { deploy, deployUpgrade, initDeployment, exportDeployments, exportContract } from "./utils/deployment";

dotenvConfig({ path: resolve(__dirname, "./.env") });

let networkName = network.name;
if (process.env.INDEPENDENT_DEPLOYMENT) {
    networkName = networkName + ".independent";
}

const deployConfig = deployConfiguration[networkName];

if (!deployConfig) {
    throw new Error(`No deploy config found for network '${networkName}'`);
}
const ADDRESS_BOOK_CONTRACT_NAME = "AddressBook";
const OTOKEN_FACTORY_CONTRACT_NAME = "OtokenFactory";
const OTOKEN_CONTRACT_NAME = "Otoken";
const WHITELIST_CONTRACT_NAME = "Whitelist";
const ORACLE_CONTRACT_NAME = "Oracle";
const MARGIN_POOL_CONTRACT_NAME = "MarginPool";
const MARGIN_CALCULATOR_CONTRACT_NAME = "MarginCalculator";
const CONTROLLER_CONTRACT_NAME = "Controller";
const MARGIN_VAULT_LIB_NAME = "MarginVaultLib";
const CHAINLINK_PRICER_CONTRACT_NAME = "ChainLinkPricer";
const CONTRACTS_TO_DEPLOY_WITH_NO_PARAM = [OTOKEN_CONTRACT_NAME, ORACLE_CONTRACT_NAME];
const CONTRACTS_TO_DEPLOY_WITH_ORACLE_PARAM = [MARGIN_CALCULATOR_CONTRACT_NAME];
const CONTRACTS_TO_DEPLOY_WITH_ADDRESSBOOK_PARAM = [
    OTOKEN_FACTORY_CONTRACT_NAME,
    WHITELIST_CONTRACT_NAME,
    MARGIN_POOL_CONTRACT_NAME,
];
const contractAddresses = new Map();

async function init() {
    await initDeployment();

    const deployer = (await ethers.provider.listAccounts())[0];

    console.log(`Using network ${networkName}`);
    console.log(`Deploying from ${deployer}`);
}

// Deploys a faucet token for use as test collateral, and returns its address
async function deployCollateralToken(): Promise<string> {
    process.stdout.write(`Deploying test collateral token (PUSDC)...`);
    const token = await deploy("PotionTestUSD");

    await exportContract("USDC", token.address, 0);

    console.log(` deployed at ${token.address}`);
    return token.address;
}

async function updateAddressBook(addressbook: Contract) {
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
async function deployOpynContracts(deployConfig: NetworkDeployConfig): Promise<string> {
    console.log("Deploying Opyn Gamma protocol...");

    // Deploy the address book and other Opyn contracts
    const addressbook = await deploy(ADDRESS_BOOK_CONTRACT_NAME);

    // Deploy contracts that take no constructor params
    for (const contractName of CONTRACTS_TO_DEPLOY_WITH_NO_PARAM) {
        const deployedContract = await deploy(contractName);
        contractAddresses.set(contractName, deployedContract.address);
    }

    // Deploy contracts that take the oracle as a constructor param
    for (const contractName of CONTRACTS_TO_DEPLOY_WITH_ORACLE_PARAM) {
        const deployedContract = await deploy(contractName, [contractAddresses.get(ORACLE_CONTRACT_NAME)]);
        contractAddresses.set(contractName, deployedContract.address);
    }

    // Deploy contracts that take the address book as a constructor param
    for (const contractName of CONTRACTS_TO_DEPLOY_WITH_ADDRESSBOOK_PARAM) {
        const deployedContract = await deploy(contractName, [addressbook.address]);
        contractAddresses.set(contractName, deployedContract.address);
    }

    // Deploy Controller including linked library
    const marginVaultLib = await deploy("MarginVault");
    contractAddresses.set(MARGIN_VAULT_LIB_NAME, marginVaultLib.address);

    const ControllerFactory = await ethers.getContractFactory(CONTROLLER_CONTRACT_NAME, {
        libraries: {
            MarginVault: marginVaultLib.address,
        },
    });
    const controllerDeployTrx = await ControllerFactory.deploy();
    await controllerDeployTrx.deployed();

    const controller = await deploy(CONTROLLER_CONTRACT_NAME, [], {
        libraries: {
            MarginVault: marginVaultLib.address,
        },
    });
    contractAddresses.set(CONTROLLER_CONTRACT_NAME, controller.address);

    await updateAddressBook(addressbook);

    if (deployConfig.pricerConfigs !== undefined) {
        const oracleAddress = contractAddresses.get(ORACLE_CONTRACT_NAME);
        const oracleFactory = await ethers.getContractFactory(ORACLE_CONTRACT_NAME);
        const oracle = await oracleFactory.attach(oracleAddress);

        console.log("Deploying pricers...");
        for (const pricerConfig of deployConfig.pricerConfigs) {
            const pricer = await deploy(
                CHAINLINK_PRICER_CONTRACT_NAME,
                [
                    pricerConfig.relayerAddress,
                    pricerConfig.assetAddress,
                    pricerConfig.chainlinkAggregatorAddress,
                    contractAddresses.get(ORACLE_CONTRACT_NAME),
                ],
                {
                    alias: CHAINLINK_PRICER_CONTRACT_NAME + pricerConfig.assetName,
                },
            );

            console.log(`  - Deployed ${pricerConfig.assetName} pricer to ${pricer.address}`);

            const tx = await oracle.setAssetPricer(pricerConfig.assetAddress, pricer.address);
            await tx.wait();

            console.log(`  - Configured ${pricerConfig.assetName} pricer for Oracle`);
        }
    }

    return addressbook.address;
}

async function main() {
    await init();

    if (!deployConfig.opynAddressBook) {
        deployConfig.opynAddressBook = await deployOpynContracts(deployConfig);
    }
    const AddressBookFactory = await ethers.getContractFactory("AddressBook");
    const addressBook = await AddressBookFactory.attach(deployConfig.opynAddressBook);
    const otokenFactoryAddress = await addressBook.getOtokenFactory();
    const whitelistAddress = await addressBook.getWhitelist();

    if (!deployConfig.collateralToken) {
        deployConfig.collateralToken = await deployCollateralToken();
    } else {
        await exportContract("USDC", deployConfig.collateralToken, 0);
    }

    process.stdout.write(`Deploying CurveManager... `);
    const curveManager = await deploy("CurveManager");
    console.log(`deployed at ${curveManager.address}`);

    process.stdout.write(`Deploying CriteriaManager... `);
    const criteriaManager = await deploy("CriteriaManager");
    console.log(`deployed at ${criteriaManager.address}`);

    process.stdout.write(`Deploying PotionLiquidityPool... `);
    const potionLiquidityPool = (await deployUpgrade("PotionLiquidityPool", [
        deployConfig.opynAddressBook,
        deployConfig.collateralToken,
        curveManager.address,
        criteriaManager.address,
    ])) as PotionLiquidityPool;

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

    await exportDeployments();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
