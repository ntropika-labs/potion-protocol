import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { MockContract } from "@defi-wonderland/smock";

import {
    IPotionLiquidityPool,
    ISwapRouter,
    InvestmentVault,
    PotionBuyAction,
    IOpynController,
    ERC20PresetMinterPauser,
    IOpynFactory,
    IOpynAddressBook,
    IOpynOracle,
} from "../../typechain";
import {
    mockERC20,
    mockPotionLiquidityPoolManager,
    mockUniswapV3SwapRouter,
    mockOpynController,
    mockOpynFactory,
    mockOpynOracle,
    mockOpynAddressBook,
} from "./MocksLibrary";
import { connectContract } from "../utils/deployment";
import { deployHedgingVault, HedgingVaultDeployParams } from "../hedging-vault/deployPotionHedgingVault";
import { PotionHedgingVaultDeploymentConfigs, PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NetworksType } from "../../hardhat.helpers";

export interface TestingEnvironmentDeployment {
    // Contracts
    investmentVault: InvestmentVault;
    potionBuyAction: PotionBuyAction;
    USDC: ERC20PresetMinterPauser | MockContract<ERC20PresetMinterPauser>;
    underlyingAsset: ERC20PresetMinterPauser | MockContract<ERC20PresetMinterPauser>;
    potionLiquidityPoolManager: IPotionLiquidityPool | MockContract<IPotionLiquidityPool>;
    opynAddressBook: IOpynAddressBook | MockContract<IOpynAddressBook>;
    opynController: IOpynController | MockContract<IOpynController>;
    opynFactory: IOpynFactory | MockContract<IOpynFactory>;
    opynOracle: IOpynOracle | MockContract<IOpynOracle>;
    uniswapV3SwapRouter: ISwapRouter | MockContract<ISwapRouter>;

    // Config
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    underlyingAssetCap: BigNumber;
    maxPremiumPercentage: BigNumber;
    premiumSlippage: BigNumber;
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePercentage: BigNumber;
    hedgingPercentage: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;
}

async function mockContractsIfNeeded(
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<Partial<TestingEnvironmentDeployment>> {
    const testingEnvironmentDeployment: Partial<TestingEnvironmentDeployment> = {};

    // Check if need to mock USDC
    if (!deploymentConfig.USDC) {
        const mockingResult = await mockERC20(deploymentConfig, "USDC");
        testingEnvironmentDeployment.USDC = mockingResult.softMock ? mockingResult.softMock : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.USDC = await connectContract<ERC20PresetMinterPauser>(
            "ERC20PresetMinterPauser",
            deploymentConfig.USDC,
            {
                alias: "USDC",
            },
        );
    }

    // Check if need to mock underlying asset
    if (!deploymentConfig.underlyingAsset) {
        const mockingResult = await mockERC20(deploymentConfig, "UnderlyingAsset");
        testingEnvironmentDeployment.underlyingAsset = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.underlyingAsset = await connectContract<ERC20PresetMinterPauser>(
            "ERC20PresetMinterPauser",
            deploymentConfig.underlyingAsset,
            {
                alias: "UnderlyingAsset",
            },
        );
    }

    // Check if need to mock PotionProtocol
    if (!deploymentConfig.potionLiquidityPoolManager) {
        const mockingResult = await mockPotionLiquidityPoolManager(deploymentConfig);
        testingEnvironmentDeployment.potionLiquidityPoolManager = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.potionLiquidityPoolManager = await connectContract<IPotionLiquidityPool>(
            "IPotionLiquidityPool",
            deploymentConfig.potionLiquidityPoolManager,
            {
                alias: "PotionLiquidityPool",
            },
        );
    }

    // Check if need to mock OpynController
    if (!deploymentConfig.opynController) {
        const mockingResult = await mockOpynController(deploymentConfig);
        testingEnvironmentDeployment.opynController = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.opynController = await connectContract<IOpynController>(
            "IOpynController",
            deploymentConfig.opynController,
            {
                alias: "OpynController",
            },
        );
    }

    // Check if need to mock OpynFactory
    if (!deploymentConfig.opynFactory) {
        const mockingResult = await mockOpynFactory(deploymentConfig);
        testingEnvironmentDeployment.opynFactory = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.opynFactory = await connectContract<IOpynFactory>(
            "IOpynFactory",
            deploymentConfig.opynFactory,
            {
                alias: "OpynFactory",
            },
        );
    }

    // Check if need to mock OpynFactory
    if (!deploymentConfig.opynOracle) {
        const mockingResult = await mockOpynFactory(deploymentConfig);
        testingEnvironmentDeployment.opynFactory = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.opynFactory = await connectContract<IOpynFactory>(
            "IOpynFactory",
            deploymentConfig.opynOracle,
            {
                alias: "OpynFactory",
            },
        );
    }

    if (!deploymentConfig.opynAddressBook) {
        const opynController = await mockOpynController(deploymentConfig);
        const opynFactory = await mockOpynFactory(deploymentConfig);
        const opynOracle = await mockOpynOracle(deploymentConfig);

        testingEnvironmentDeployment.opynController = opynController.softMock
            ? opynController.softMock
            : opynController.hardMock;
        testingEnvironmentDeployment.opynFactory = opynFactory.softMock ? opynFactory.softMock : opynFactory.hardMock;
        testingEnvironmentDeployment.opynOracle = opynOracle.softMock ? opynOracle.softMock : opynOracle.hardMock;

        const mockingResult = await mockOpynAddressBook(
            deploymentConfig,
            testingEnvironmentDeployment.opynController.address,
            testingEnvironmentDeployment.opynFactory.address,
            testingEnvironmentDeployment.opynOracle.address,
        );
        testingEnvironmentDeployment.opynAddressBook = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.opynFactory = await connectContract<IOpynFactory>(
            "IOpynFactory",
            deploymentConfig.opynAddressBook,
            {
                alias: "OpynAddressBook",
            },
        );
    }

    // Check if need to mock UniswapV3SwapRouter
    if (!deploymentConfig.uniswapV3SwapRouter) {
        const mockingResult = await mockUniswapV3SwapRouter(deploymentConfig);
        testingEnvironmentDeployment.uniswapV3SwapRouter = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.uniswapV3SwapRouter = await connectContract<ISwapRouter>(
            "ISwapRouter",
            deploymentConfig.uniswapV3SwapRouter,
            {
                alias: "SwapRouter",
            },
        );
    }

    return testingEnvironmentDeployment;
}

async function prepareTestEnvironment(
    deployer: SignerWithAddress,
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<TestingEnvironmentDeployment> {
    const testingEnvironmentDeployment = await mockContractsIfNeeded(deploymentConfig);

    testingEnvironmentDeployment.adminAddress = deployer.address;
    testingEnvironmentDeployment.strategistAddress = deploymentConfig.strategistAddress || deployer.address;
    testingEnvironmentDeployment.operatorAddress = deploymentConfig.operatorAddress || deployer.address;
    testingEnvironmentDeployment.underlyingAssetCap =
        deploymentConfig.underlyingAssetCap || ethers.constants.MaxUint256;

    testingEnvironmentDeployment.maxPremiumPercentage = deploymentConfig.maxPremiumPercentage;
    testingEnvironmentDeployment.premiumSlippage = deploymentConfig.premiumSlippage;
    testingEnvironmentDeployment.swapSlippage = deploymentConfig.swapSlippage;
    testingEnvironmentDeployment.maxSwapDurationSecs = deploymentConfig.maxSwapDurationSecs;
    testingEnvironmentDeployment.cycleDurationSecs = deploymentConfig.cycleDurationSecs;
    testingEnvironmentDeployment.strikePercentage = deploymentConfig.strikePercentage;
    testingEnvironmentDeployment.hedgingPercentage = deploymentConfig.hedgingPercentage;
    testingEnvironmentDeployment.managementFee = deploymentConfig.managementFee;
    testingEnvironmentDeployment.performanceFee = deploymentConfig.performanceFee;
    testingEnvironmentDeployment.feesRecipient = deploymentConfig.feesRecipient || deployer.address;

    // Check if the deployment is valid
    if (!testingEnvironmentDeployment.USDC) {
        throw new Error(`No USDC address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.underlyingAsset) {
        throw new Error(`No underlying asset address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.potionLiquidityPoolManager) {
        throw new Error(`No potionLiquidityPoolManager address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.opynController) {
        throw new Error(`No opynController address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.opynFactory) {
        throw new Error(`No opynFactory address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.uniswapV3SwapRouter) {
        throw new Error(`No uniswapV3SwapRouter address provided and no mocking enabled`);
    }

    return testingEnvironmentDeployment as TestingEnvironmentDeployment;
}

export function getDeploymentConfig(networkName: NetworksType): PotionHedgingVaultConfigParams {
    return PotionHedgingVaultDeploymentConfigs[networkName];
}

export async function deployTestingEnv(
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<TestingEnvironmentDeployment> {
    const deployer = (await ethers.getSigners())[0];

    const testEnvDeployment: TestingEnvironmentDeployment = await prepareTestEnvironment(deployer, deploymentConfig);

    const deploymentParams: HedgingVaultDeployParams = {
        // Roles
        adminAddress: deployer.address,
        strategistAddress: testEnvDeployment.strategistAddress,
        operatorAddress: testEnvDeployment.operatorAddress,

        // Assets addresses
        USDC: testEnvDeployment.USDC.address,
        underlyingAsset: testEnvDeployment.underlyingAsset.address,

        // Investment configuration
        underlyingAssetCap: testEnvDeployment.underlyingAssetCap,
        maxPremiumPercentage: testEnvDeployment.maxPremiumPercentage,
        premiumSlippage: testEnvDeployment.premiumSlippage,
        swapSlippage: testEnvDeployment.swapSlippage,
        maxSwapDurationSecs: testEnvDeployment.maxSwapDurationSecs,
        cycleDurationSecs: testEnvDeployment.cycleDurationSecs,
        strikePercentage: testEnvDeployment.strikePercentage,
        hedgingPercentage: testEnvDeployment.hedgingPercentage,

        // Fees configuration
        managementFee: testEnvDeployment.managementFee,
        performanceFee: testEnvDeployment.performanceFee,
        feesRecipient: testEnvDeployment.feesRecipient,

        // Third-party dependencies
        uniswapV3SwapRouter: testEnvDeployment.uniswapV3SwapRouter.address,
        potionLiquidityPoolManager: testEnvDeployment.potionLiquidityPoolManager.address,
        opynAddressBook: testEnvDeployment.opynAddressBook.address,
    };

    const [investmentVault, potionBuyAction] = await deployHedgingVault(deploymentParams);

    testEnvDeployment.investmentVault = investmentVault;
    testEnvDeployment.potionBuyAction = potionBuyAction;

    return testEnvDeployment;
}
