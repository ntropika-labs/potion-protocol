import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { FakeContract, MockContract } from "@defi-wonderland/smock";

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
} from "../smock/fakesLibrary";
import { deployHedgingVault, HedgingVaultDeployParams } from "../../scripts/hedging-vault/deployPotionHedgingVault";
import { PotionHedgingVaultDeploymentConfigs, PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export interface MockOptions {
    mockUSDC?: boolean;
    mockUnderlyingAsset?: boolean;
    mockUniswapV3SwapRouter?: boolean;
    mockPotionLiquidityPoolManager?: boolean;
    mockOpynController?: boolean;
    mockOpynFactory?: boolean;
}

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
    fakePotionProtocol?: FakeContract<IPotionLiquidityPool>;
    fakeOpynController?: FakeContract<IOpynController>;
    fakeOpynFactory?: FakeContract<IOpynFactory>;
    fakeUniswapV3?: FakeContract<ISwapRouter>;
}

async function mockContractsIfNeeded(mockOptions: MockOptions): Promise<Partial<TestingEnvironmentDeployment>> {
    const testingEnvironmentDeployment: Partial<TestingEnvironmentDeployment> = {};

    // Check if need to mock USDC
    if (mockOptions.mockUSDC) {
        testingEnvironmentDeployment.mockUSDC = await mockERC20();
        testingEnvironmentDeployment.USDC = testingEnvironmentDeployment.mockUSDC.address;
    }

    // Check if need to mock underlying asset
    if (mockOptions.mockUnderlyingAsset) {
        testingEnvironmentDeployment.mockUnderlyingAsset = await mockERC20();
        testingEnvironmentDeployment.underlyingAsset = testingEnvironmentDeployment.mockUnderlyingAsset.address;
    }

    // Check if need to mock PotionProtocol
    if (mockOptions.mockPotionLiquidityPoolManager) {
        testingEnvironmentDeployment.fakePotionProtocol = await mockPotionLiquidityPoolManager();
        testingEnvironmentDeployment.potionLiquidityPoolManager =
            testingEnvironmentDeployment.fakePotionProtocol.address;
    }

    // Check if need to mock OpynController
    if (mockOptions.mockOpynController) {
        testingEnvironmentDeployment.fakeOpynController = await mockOpynController();
        testingEnvironmentDeployment.opynController = testingEnvironmentDeployment.fakeOpynController.address;
    }

    // Check if need to mock OpynFactory
    if (mockOptions.mockOpynFactory) {
        testingEnvironmentDeployment.fakeOpynFactory = await mockOpynFactory();
        testingEnvironmentDeployment.opynFactory = testingEnvironmentDeployment.fakeOpynFactory.address;
    }

    // Check if need to mock UniswapV3SwapRouter
    if (mockOptions.mockUniswapV3SwapRouter) {
        testingEnvironmentDeployment.fakeUniswapV3 = await mockUniswapV3SwapRouter();
        testingEnvironmentDeployment.uniswapV3SwapRouter = testingEnvironmentDeployment.fakeUniswapV3.address;
    }

    return testingEnvironmentDeployment;
}

async function prepareDeploymentValues(
    deployer: SignerWithAddress,
    deploymentConfig: PotionHedgingVaultConfigParams,
    mockOptions: MockOptions,
): Promise<TestingEnvironmentDeployment> {
    const testingEnvironmentDeployment = await mockContractsIfNeeded(mockOptions);

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

export function getDeploymentConfig(networkName: string): PotionHedgingVaultConfigParams {
    return PotionHedgingVaultDeploymentConfigs[networkName];
}

export async function deployTestingEnv(
    deploymentConfig: PotionHedgingVaultConfigParams,
    mockOptions: MockOptions = {},
) {
    const deployer = (await ethers.getSigners())[0];

    const testEnvDeployment: TestingEnvironmentDeployment = await prepareDeploymentValues(
        deployer,
        deploymentConfig,
        mockOptions,
    );

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
