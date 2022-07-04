import { network, ethers } from "hardhat";
import { FakeContract } from "@defi-wonderland/smock";

import { IERC20, IPotionLiquidityPool, ISwapRouter, InvestmentVault, PotionBuyAction } from "../../typechain";
import { fakeERC20, fakePotionLiquidityPoolManager, fakeUniswapV3SwapRouter } from "../smock/fakesLibrary";
import { deployHedgingVault, HedgingVaultDeployParams } from "../../scripts/hedging-vault/deployHedgingVault";
import { HedgingVaultDeploymentConfigs, HedgingVaultConfigParams } from "../../scripts/config/deployConfig";

export interface MockOptions {
    mockUSDC?: boolean;
    mockUnderlyingAsset?: boolean;
    mockUniswapV3SwapRouter?: boolean;
    mockPotionLiquidityPoolManager?: boolean;
}

export interface TestingEnvironmentDeployment {
    investmentVault: InvestmentVault;
    potionBuyAction: PotionBuyAction;
    fakeUSDC?: FakeContract<IERC20>;
    fakeUnderlyingAsset?: FakeContract<IERC20>;
    fakePotionProtocol?: FakeContract<IPotionLiquidityPool>;
    fakeUniswapV3?: FakeContract<ISwapRouter>;
}

async function mockContractsIfNeeded(
    deploymentConfig: HedgingVaultConfigParams,
    mockOptions: MockOptions,
): Promise<Partial<TestingEnvironmentDeployment>> {
    const testingEnvironmentDeployment: Partial<TestingEnvironmentDeployment> = {};

    // Check if need to mock USDC
    if (mockOptions.mockUSDC) {
        testingEnvironmentDeployment.fakeUSDC = await fakeERC20();
        deploymentConfig.USDC = testingEnvironmentDeployment.fakeUSDC.address;
    }

    // Check if need to mock underlying asset
    if (mockOptions.mockUnderlyingAsset) {
        testingEnvironmentDeployment.fakeUnderlyingAsset = await fakeERC20();
        deploymentConfig.underlyingAsset = testingEnvironmentDeployment.fakeUnderlyingAsset.address;
    }

    // Check if need to mock PotionProtocol
    if (mockOptions.mockPotionLiquidityPoolManager) {
        testingEnvironmentDeployment.fakePotionProtocol = await fakePotionLiquidityPoolManager();
        deploymentConfig.potionLiquidityPoolManager = testingEnvironmentDeployment.fakePotionProtocol.address;
    }

    // Check if need to mock UniswapV3SwapRouter
    if (mockOptions.mockUniswapV3SwapRouter) {
        testingEnvironmentDeployment.fakeUniswapV3 = await fakeUniswapV3SwapRouter();
        deploymentConfig.uniswapV3SwapRouter = testingEnvironmentDeployment.fakeUniswapV3.address;
    }

    return testingEnvironmentDeployment;
}

export function getDeploymentConfig(networkName: string): HedgingVaultConfigParams {
    return HedgingVaultDeploymentConfigs[networkName];
}

export async function deployTestingEnv(deploymentConfig: HedgingVaultConfigParams, mockOptions: MockOptions = {}) {
    const deployer = (await ethers.getSigners())[0];

    // Deployment config is modified here if contracts are mocked
    const testingEnvironmentDeployment = await mockContractsIfNeeded(deploymentConfig, mockOptions);

    if (!deploymentConfig.USDC) {
        throw new Error(`No USDC address provided and no mocking enabled`);
    }
    if (!deploymentConfig.underlyingAsset) {
        throw new Error(`No underlying asset address provided and no mocking enabled`);
    }
    if (!deploymentConfig.potionLiquidityPoolManager) {
        throw new Error(`No potionLiquidityPoolManager address provided and no mocking enabled`);
    }
    if (!deploymentConfig.uniswapV3SwapRouter) {
        throw new Error(`No uniswapV3SwapRouter address provided and no mocking enabled`);
    }

    const deploymentParams: HedgingVaultDeployParams = {
        // Roles
        adminAddress: deployer.address,
        strategistAddress: deploymentConfig.strategistAddress || deployer.address,
        operatorAddress: deploymentConfig.operatorAddress || deployer.address,

        // Assets addresses
        USDC: deploymentConfig.USDC,
        underlyingAsset: deploymentConfig.underlyingAsset,

        // Investment configuration
        maxPremiumPercentage: deploymentConfig.maxPremiumPercentage,
        premiumSlippage: deploymentConfig.premiumSlippage,
        swapSlippage: deploymentConfig.swapSlippage,
        maxSwapDurationSecs: deploymentConfig.maxSwapDurationSecs,
        cycleDurationSecs: deploymentConfig.cycleDurationSecs,

        // Fees configuration
        managementFee: deploymentConfig.managementFee,
        performanceFee: deploymentConfig.performanceFee,
        feesRecipient: deploymentConfig.feesRecipient || deployer.address,

        // Third-party dependencies
        uniswapV3SwapRouter: deploymentConfig.uniswapV3SwapRouter,
        potionLiquidityPoolManager: deploymentConfig.potionLiquidityPoolManager,
    };

    const [investmentVault, potionBuyAction] = await deployHedgingVault(deploymentParams);

    testingEnvironmentDeployment.investmentVault = investmentVault;
    testingEnvironmentDeployment.potionBuyAction = potionBuyAction;

    return testingEnvironmentDeployment as TestingEnvironmentDeployment;
}
