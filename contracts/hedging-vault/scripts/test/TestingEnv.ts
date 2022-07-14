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
} from "../../typechain";
import {
    mockERC20,
    mockPotionLiquidityPoolManager,
    mockUniswapV3SwapRouter,
    mockOpynController,
    mockOpynFactory,
} from "./MocksLibrary";
import { exportContract, isContractExportEnabled } from "../utils/deployment";
import { deployHedgingVault, HedgingVaultDeployParams } from "../hedging-vault/deployPotionHedgingVault";
import { PotionHedgingVaultDeploymentConfigs, PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NetworksType } from "../../hardhat.helpers";

export interface TestingEnvironmentDeployment {
    // Contracts
    investmentVault: InvestmentVault;
    potionBuyAction: PotionBuyAction;

    // Config
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    USDC: string;
    underlyingAsset: string;
    underlyingAssetCap: BigNumber;
    maxPremiumPercentage: BigNumber;
    premiumSlippage: BigNumber;
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePriceInUSDC: BigNumber;
    hedgingPercentage: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;
    uniswapV3SwapRouter: string;
    potionLiquidityPoolManager: string;
    opynController: string;
    opynFactory: string;

    // Mocks
    mockUSDC?: MockContract<ERC20PresetMinterPauser>;
    mockUnderlyingAsset?: MockContract<ERC20PresetMinterPauser>;
    mockPotionProtocol?: MockContract<IPotionLiquidityPool>;
    mockOpynController?: MockContract<IOpynController>;
    mockOpynFactory?: MockContract<IOpynFactory>;
    mockUniswapV3?: MockContract<ISwapRouter>;
}

async function mockContractsIfNeeded(
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<Partial<TestingEnvironmentDeployment>> {
    const testingEnvironmentDeployment: Partial<TestingEnvironmentDeployment> = {};
    const exportContracts = isContractExportEnabled();

    // Check if need to mock USDC
    if (!deploymentConfig.USDC) {
        const mockingResult = await mockERC20(deploymentConfig, "USDC");

        testingEnvironmentDeployment.mockUSDC = mockingResult.softMock;
        testingEnvironmentDeployment.USDC = mockingResult.address;
    } else {
        testingEnvironmentDeployment.USDC = deploymentConfig.USDC;

        if (exportContracts) {
            await exportContract(testingEnvironmentDeployment.USDC, "USDC");
        }
    }

    // Check if need to mock underlying asset
    if (!deploymentConfig.underlyingAsset) {
        const mockingResult = await mockERC20(deploymentConfig, "UnderlyingAsset");

        testingEnvironmentDeployment.mockUnderlyingAsset = mockingResult.softMock;
        testingEnvironmentDeployment.underlyingAsset = mockingResult.address;
    } else {
        testingEnvironmentDeployment.underlyingAsset = deploymentConfig.underlyingAsset;

        if (exportContracts) {
            await exportContract(testingEnvironmentDeployment.underlyingAsset, "UnderlyingAsset");
        }
    }

    // Check if need to mock PotionProtocol
    if (!deploymentConfig.potionLiquidityPoolManager) {
        const mockingResult = await mockPotionLiquidityPoolManager(deploymentConfig);

        testingEnvironmentDeployment.mockPotionProtocol = mockingResult.softMock;
        testingEnvironmentDeployment.potionLiquidityPoolManager = mockingResult.address;
    } else {
        testingEnvironmentDeployment.potionLiquidityPoolManager = deploymentConfig.potionLiquidityPoolManager;

        if (exportContracts) {
            await exportContract(testingEnvironmentDeployment.potionLiquidityPoolManager, "PotionLiquidityPool");
        }
    }

    // Check if need to mock OpynController
    if (!deploymentConfig.opynController) {
        const mockingResult = await mockOpynController(deploymentConfig);

        testingEnvironmentDeployment.mockOpynController = mockingResult.softMock;
        testingEnvironmentDeployment.opynController = mockingResult.address;
    } else {
        testingEnvironmentDeployment.opynController = deploymentConfig.opynController;

        if (exportContracts) {
            await exportContract(testingEnvironmentDeployment.opynController, "OpynController");
        }
    }

    // Check if need to mock OpynFactory
    if (!deploymentConfig.opynFactory) {
        const mockingResult = await mockOpynFactory(deploymentConfig);

        testingEnvironmentDeployment.mockOpynFactory = mockingResult.softMock;
        testingEnvironmentDeployment.opynFactory = mockingResult.address;
    } else {
        testingEnvironmentDeployment.opynFactory = deploymentConfig.opynFactory;

        if (exportContracts) {
            await exportContract(testingEnvironmentDeployment.opynFactory, "OpynFactory");
        }
    }

    // Check if need to mock UniswapV3SwapRouter
    if (!deploymentConfig.uniswapV3SwapRouter) {
        const mockingResult = await mockUniswapV3SwapRouter(deploymentConfig);

        testingEnvironmentDeployment.mockUniswapV3 = mockingResult.softMock;
        testingEnvironmentDeployment.uniswapV3SwapRouter = mockingResult.address;
    } else {
        testingEnvironmentDeployment.uniswapV3SwapRouter = deploymentConfig.uniswapV3SwapRouter;

        if (exportContracts) {
            await exportContract(testingEnvironmentDeployment.uniswapV3SwapRouter, "UniswapV3SwapRouter");
        }
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
    testingEnvironmentDeployment.strikePriceInUSDC = deploymentConfig.strikePriceInUSDC;
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
        USDC: testEnvDeployment.USDC,
        underlyingAsset: testEnvDeployment.underlyingAsset,

        // Investment configuration
        underlyingAssetCap: testEnvDeployment.underlyingAssetCap,
        maxPremiumPercentage: testEnvDeployment.maxPremiumPercentage,
        premiumSlippage: testEnvDeployment.premiumSlippage,
        swapSlippage: testEnvDeployment.swapSlippage,
        maxSwapDurationSecs: testEnvDeployment.maxSwapDurationSecs,
        cycleDurationSecs: testEnvDeployment.cycleDurationSecs,
        strikePriceInUSDC: testEnvDeployment.strikePriceInUSDC,
        hedgingPercentage: testEnvDeployment.hedgingPercentage,

        // Fees configuration
        managementFee: testEnvDeployment.managementFee,
        performanceFee: testEnvDeployment.performanceFee,
        feesRecipient: testEnvDeployment.feesRecipient,

        // Third-party dependencies
        uniswapV3SwapRouter: testEnvDeployment.uniswapV3SwapRouter,
        potionLiquidityPoolManager: testEnvDeployment.potionLiquidityPoolManager,
        opynController: testEnvDeployment.opynController,
        opynFactory: testEnvDeployment.opynFactory,
    };

    const [investmentVault, potionBuyAction] = await deployHedgingVault(deploymentParams);

    testEnvDeployment.investmentVault = investmentVault;
    testEnvDeployment.potionBuyAction = potionBuyAction;

    return testEnvDeployment;
}
