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
    HedgingVaultOrchestrator,
    MockOpynOracle,
    RoundsInputVault,
    RoundsOutputVault,
    RoundsVaultExchanger,
    SwapToUSDCAction,
    IChainlinkAggregatorV3,
} from "../../typechain";
import {
    mockERC20,
    mockPotionLiquidityPoolManager,
    mockUniswapV3SwapRouterWithOracle,
    mockOpynController,
    mockOpynFactory,
    mockOpynOracle,
    mockOpynAddressBook,
    mockChainlinkAggregator,
} from "../test/contractsMocks";
import { asMock, Deployments } from "contracts-utils";
import type { DeploymentType } from "contracts-utils";
import { fromSolidityPercentage } from "hedging-vault-sdk";
import {
    deployHedgingVault,
    printHedgingVaultDeployParams,
    HedgingVaultDeploymentResult,
    HedgingVaultDeployParams,
} from "./deployPotionHedgingVault";
import { PotionHedgingVaultDeploymentConfigs, PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Deployments as PotionDeployments } from "@potion-protocol/core";

export interface HedgingVaultEnvironmentDeployment {
    // Contracts
    investmentVault: InvestmentVault;
    potionBuyAction: PotionBuyAction;
    swapToUSDCAction: SwapToUSDCAction;
    hedgingVaultOrchestrator: HedgingVaultOrchestrator;
    roundsInputVault: RoundsInputVault;
    roundsOutputVault: RoundsOutputVault;
    roundsVaultExchanger: RoundsVaultExchanger;

    USDC: ERC20PresetMinterPauser | MockContract<ERC20PresetMinterPauser>;
    underlyingAsset: ERC20PresetMinterPauser | MockContract<ERC20PresetMinterPauser>;
    potionLiquidityPoolManager: IPotionLiquidityPool | MockContract<IPotionLiquidityPool>;
    opynAddressBook: IOpynAddressBook | MockContract<IOpynAddressBook>;
    opynController: IOpynController | MockContract<IOpynController>;
    opynFactory: IOpynFactory | MockContract<IOpynFactory>;
    opynOracle: IOpynOracle | MockContract<IOpynOracle>;
    opynMockOracle: MockOpynOracle | MockContract<MockOpynOracle>;
    opynMockOtoken: ERC20PresetMinterPauser | MockContract<ERC20PresetMinterPauser>;
    uniswapV3SwapRouter: ISwapRouter | MockContract<ISwapRouter>;
    chainlinkAggregatorUSDC: IChainlinkAggregatorV3 | MockContract<IChainlinkAggregatorV3>;
    chainlinkAggregatorUnderlying: IChainlinkAggregatorV3 | MockContract<IChainlinkAggregatorV3>;

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
    hedgingRate: BigNumber;
    hedgingRateSlippage: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;
    inputReceiptsURI: string;
    outputReceiptsURI: string;
    sharesName: string;
    sharesSymbol: string;
}

function getTokensFromUniswapPath(uniswapPath: string) {
    const pathArray = ethers.utils.arrayify(uniswapPath);

    const firstToken = ethers.utils.hexlify(pathArray.subarray(0, 20));
    const secondToken = ethers.utils.hexlify(pathArray.subarray(23, 43));

    return { firstToken, secondToken };
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function setupUniswapV3Mock(tEnv: HedgingVaultEnvironmentDeployment) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    asMock(tEnv.uniswapV3SwapRouter)?.exactInput.returns(async (args: any) => {
        const { firstToken: paramsTokenIn, secondToken: paramsTokenOut } = getTokensFromUniswapPath(args.params.path);

        const tokenIn = paramsTokenIn === tEnv.underlyingAsset.address.toLowerCase() ? tEnv.underlyingAsset : tEnv.USDC;
        const tokenOut =
            paramsTokenOut === tEnv.underlyingAsset.address.toLowerCase() ? tEnv.underlyingAsset : tEnv.USDC;

        await tokenIn.transferFrom(
            tEnv.potionBuyAction.address,
            tEnv.uniswapV3SwapRouter.address,
            args.params.amountIn,
        );
        await tokenOut.transferFrom(
            tEnv.uniswapV3SwapRouter.address,
            tEnv.potionBuyAction.address,
            args.params.amountOutMinimum,
        );
    });
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    asMock(tEnv.uniswapV3SwapRouter)?.exactOutput.returns(async (args: any) => {
        const { firstToken: paramsTokenIn, secondToken: paramsTokenOut } = getTokensFromUniswapPath(args.params.path);

        console.log(paramsTokenIn);
        console.log(paramsTokenOut);

        console.log(tEnv.underlyingAsset.address);

        const tokenIn = paramsTokenIn === tEnv.underlyingAsset.address.toLowerCase() ? tEnv.underlyingAsset : tEnv.USDC;
        const tokenOut =
            paramsTokenOut === tEnv.underlyingAsset.address.toLowerCase() ? tEnv.underlyingAsset : tEnv.USDC;

        console.log("tokenIn", tokenIn.address);
        console.log("tokenOut", tokenOut.address);

        await tokenIn.transferFrom(
            tEnv.potionBuyAction.address,
            tEnv.uniswapV3SwapRouter.address,
            args.params.amountInMaximum,
        );
        await tokenOut.transferFrom(
            tEnv.uniswapV3SwapRouter.address,
            tEnv.potionBuyAction.address,
            args.params.amountOut,
        );

        return args.params.amountInMaximum;
    });
}

async function mockContractsIfNeeded(
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<Partial<HedgingVaultEnvironmentDeployment>> {
    const testingEnvironmentDeployment: Partial<HedgingVaultEnvironmentDeployment> = {};

    // Check if need to mock USDC
    if (!deploymentConfig.USDC) {
        testingEnvironmentDeployment.USDC = await mockERC20("USDC", 6);
    } else {
        testingEnvironmentDeployment.USDC = await Deployments.attach<ERC20PresetMinterPauser>(
            "ERC20PresetMinterPauser",
            deploymentConfig.USDC,
            "USDC",
        );
    }

    // Check if need to mock underlying asset
    if (!deploymentConfig.underlyingAsset) {
        testingEnvironmentDeployment.underlyingAsset = await mockERC20("UnderlyingAsset");
    } else {
        testingEnvironmentDeployment.underlyingAsset = await Deployments.attach<ERC20PresetMinterPauser>(
            "ERC20PresetMinterPauser",
            deploymentConfig.underlyingAsset,
            "UnderlyingAsset",
        );
    }

    // Check if need to mock PotionProtocol
    if (!deploymentConfig.potionLiquidityPoolManager) {
        testingEnvironmentDeployment.potionLiquidityPoolManager = await mockPotionLiquidityPoolManager();
    } else {
        testingEnvironmentDeployment.potionLiquidityPoolManager = await Deployments.attach<IPotionLiquidityPool>(
            "IPotionLiquidityPool",
            deploymentConfig.potionLiquidityPoolManager,
            "PotionLiquidityPool",
        );
    }

    if (!deploymentConfig.opynAddressBook) {
        testingEnvironmentDeployment.opynMockOtoken = await mockERC20("Otoken", 8);
        testingEnvironmentDeployment.opynController = await mockOpynController();
        testingEnvironmentDeployment.opynFactory = await mockOpynFactory(
            testingEnvironmentDeployment.opynMockOtoken.address,
        );
        const opynOracle = await mockOpynOracle();

        testingEnvironmentDeployment.opynOracle = opynOracle;
        testingEnvironmentDeployment.opynMockOracle = opynOracle;

        testingEnvironmentDeployment.opynAddressBook = await mockOpynAddressBook(
            testingEnvironmentDeployment.opynController.address,
            testingEnvironmentDeployment.opynFactory.address,
            testingEnvironmentDeployment.opynOracle.address,
        );
    } else {
        testingEnvironmentDeployment.opynAddressBook = await Deployments.attach<IOpynAddressBook>(
            "IOpynAddressBook",
            deploymentConfig.opynAddressBook,
            "OpynAddressBook",
        );

        testingEnvironmentDeployment.opynController = await Deployments.attach<IOpynController>(
            "IOpynController",
            await testingEnvironmentDeployment.opynAddressBook.getController(),
            "OpynController",
        );

        testingEnvironmentDeployment.opynFactory = await Deployments.attach<IOpynFactory>(
            "IOpynFactory",
            await testingEnvironmentDeployment.opynAddressBook.getOtokenFactory(),
            "OpynFactory",
        );

        testingEnvironmentDeployment.opynOracle = await Deployments.attach<IOpynOracle>(
            "IOpynOracle",
            await testingEnvironmentDeployment.opynAddressBook.getOracle(),
            "OpynOracle",
        );

        // TODO: Is this still needed?
        if (deploymentConfig.opynMockOracle) {
            testingEnvironmentDeployment.opynMockOracle = await Deployments.attach<MockOpynOracle>(
                "MockOpynOracle",
                deploymentConfig.opynMockOracle,
                "MockOpynOracle",
            );
        }
    }

    // Check if need to mock UniswapV3SwapRouter
    if (!deploymentConfig.uniswapV3SwapRouter) {
        const chainlinkAggregatorUSDC = await mockChainlinkAggregator("ChainlinkAggregatorUSDC", 1.0);
        const chainlinkAggregatorUnderlying = await mockChainlinkAggregator(
            "ChainlinkAggregatorUnderlyingAsset",
            0.001,
        );

        testingEnvironmentDeployment.uniswapV3SwapRouter = await mockUniswapV3SwapRouterWithOracle(
            [testingEnvironmentDeployment.USDC.address, testingEnvironmentDeployment.underlyingAsset.address],
            [chainlinkAggregatorUSDC.address, chainlinkAggregatorUnderlying.address],
        );

        testingEnvironmentDeployment.chainlinkAggregatorUSDC = chainlinkAggregatorUSDC;
        testingEnvironmentDeployment.chainlinkAggregatorUnderlying = chainlinkAggregatorUnderlying;

        // Mint some tokens to the Uniswap Router
        await testingEnvironmentDeployment.USDC.mint(
            testingEnvironmentDeployment.uniswapV3SwapRouter.address,
            ethers.utils.parseUnits("10000000", 6),
        );
        await testingEnvironmentDeployment.underlyingAsset.mint(
            testingEnvironmentDeployment.uniswapV3SwapRouter.address,
            ethers.utils.parseEther("10000000"),
        );
    } else {
        testingEnvironmentDeployment.uniswapV3SwapRouter = await Deployments.attach<ISwapRouter>(
            "ISwapRouter",
            deploymentConfig.uniswapV3SwapRouter,
            "SwapRouter",
        );
    }

    return testingEnvironmentDeployment;
}

async function prepareHedgingVaultEnvironment(
    deployer: SignerWithAddress,
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<HedgingVaultEnvironmentDeployment> {
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
    testingEnvironmentDeployment.hedgingRate = deploymentConfig.hedgingRate;
    testingEnvironmentDeployment.hedgingRateSlippage = deploymentConfig.hedgingRateSlippage;
    testingEnvironmentDeployment.sharesName = deploymentConfig.sharesName;
    testingEnvironmentDeployment.sharesSymbol = deploymentConfig.sharesSymbol;
    testingEnvironmentDeployment.managementFee = deploymentConfig.managementFee;
    testingEnvironmentDeployment.performanceFee = deploymentConfig.performanceFee;
    testingEnvironmentDeployment.feesRecipient = deploymentConfig.feesRecipient || deployer.address;
    testingEnvironmentDeployment.inputReceiptsURI =
        deploymentConfig.inputReceiptsURI || "https://potion.finance/receipts/in-{id}.json";
    testingEnvironmentDeployment.outputReceiptsURI =
        deploymentConfig.outputReceiptsURI || "https://potion.finance/receipts/out-{id}.json";

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
    if (!testingEnvironmentDeployment.opynOracle) {
        throw new Error(`No opynOracle address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.opynAddressBook) {
        throw new Error(`No opynAddressBook address provided and no mocking enabled`);
    }
    if (!testingEnvironmentDeployment.uniswapV3SwapRouter) {
        throw new Error(`No uniswapV3SwapRouter address provided and no mocking enabled`);
    }

    return testingEnvironmentDeployment as HedgingVaultEnvironmentDeployment;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function getPotionProtocolDeployments(networkName: string): any {
    /* @ts-expect-error iterator is not defined */
    const deployment = PotionDeployments[networkName];

    if (deployment === undefined) {
        return undefined;
    }

    return deployment.contracts;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function usePotionDeployments(hedgingVaultConfig: PotionHedgingVaultConfigParams, potionProtocolDeployments: any) {
    if (!hedgingVaultConfig.USDC) {
        hedgingVaultConfig.USDC = potionProtocolDeployments.USDC?.address;
    }

    if (!hedgingVaultConfig.underlyingAsset) {
        hedgingVaultConfig.underlyingAsset = potionProtocolDeployments.SampleUnderlyingToken?.address;
    }

    if (!hedgingVaultConfig.potionLiquidityPoolManager) {
        hedgingVaultConfig.potionLiquidityPoolManager = potionProtocolDeployments.PotionLiquidityPool?.address;
    }

    if (!hedgingVaultConfig.opynAddressBook) {
        hedgingVaultConfig.opynAddressBook = potionProtocolDeployments.AddressBook?.address;
    }

    if (!hedgingVaultConfig.opynMockOracle) {
        hedgingVaultConfig.opynMockOracle = potionProtocolDeployments.MockOracle?.address;
    }
}

function addPotionDeployments(deploymentName: string, hedgingVaultConfig: PotionHedgingVaultConfigParams) {
    const potionDeploymentName = hedgingVaultConfig.potionProtocolDeployConfigName || deploymentName;
    const potionDeploymentType = Deployments.getDeploymentTypeFromName(potionDeploymentName);

    let potionProtocolDeployments = getPotionProtocolDeployments(potionDeploymentName);

    if (potionProtocolDeployments === undefined) {
        const legacyDeploymentTypeName = Deployments.getLegacyDeploymentNameFromType(potionDeploymentType);
        potionProtocolDeployments = getPotionProtocolDeployments(legacyDeploymentTypeName);
    }

    if (potionProtocolDeployments !== undefined) {
        usePotionDeployments(hedgingVaultConfig, potionProtocolDeployments);
    }

    return hedgingVaultConfig;
}

export function getDeploymentConfig(deploymentType: DeploymentType): PotionHedgingVaultConfigParams {
    const deploymentTypeName = Deployments.getDeploymentNameFromType(deploymentType);
    const hedgingVaultConfig = PotionHedgingVaultDeploymentConfigs[deploymentTypeName];

    addPotionDeployments(deploymentTypeName, hedgingVaultConfig);

    // Return a copy of the config
    return Object.assign({}, hedgingVaultConfig);
}

async function testDepositInVault(testDepositAmount: BigNumber, testEnvDeployment: HedgingVaultEnvironmentDeployment) {
    // Deposit some amount
    const deployer = (await ethers.provider.listAccounts())[0];
    const underlyingDecimals = await testEnvDeployment.underlyingAsset.decimals();

    await testEnvDeployment.underlyingAsset.mint(deployer, testDepositAmount);
    await testEnvDeployment.underlyingAsset.approve(
        testEnvDeployment.roundsInputVault.address,
        ethers.constants.MaxUint256,
    );

    await testEnvDeployment.roundsInputVault.deposit(testDepositAmount, deployer);

    console.log(
        `- Deposited ${ethers.utils.formatUnits(testDepositAmount, underlyingDecimals)} into vault ${
            testEnvDeployment.roundsInputVault.address
        }`,
    );
}

export async function deployHedgingVaultEnvironment(
    deploymentConfig: PotionHedgingVaultConfigParams,
): Promise<HedgingVaultEnvironmentDeployment> {
    const deployer = (await ethers.getSigners())[0];

    const testEnvDeployment: HedgingVaultEnvironmentDeployment = await prepareHedgingVaultEnvironment(
        deployer,
        deploymentConfig,
    );

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
        hedgingRate: testEnvDeployment.hedgingRate,
        hedgingRateSlippage: testEnvDeployment.hedgingRateSlippage,

        // Shares configuration
        sharesName: testEnvDeployment.sharesName,
        sharesSymbol: testEnvDeployment.sharesSymbol,

        // Fees configuration
        managementFee: testEnvDeployment.managementFee,
        performanceFee: testEnvDeployment.performanceFee,
        feesRecipient: testEnvDeployment.feesRecipient,

        // Receipt URI
        inputReceiptsURI: testEnvDeployment.inputReceiptsURI,
        outputReceiptsURI: testEnvDeployment.outputReceiptsURI,

        // Third-party dependencies
        uniswapV3SwapRouter: testEnvDeployment.uniswapV3SwapRouter.address,
        potionLiquidityPoolManager: testEnvDeployment.potionLiquidityPoolManager.address,
        opynAddressBook: testEnvDeployment.opynAddressBook.address,
    };

    printHedgingVaultDeployParams(deploymentParams);

    console.log(`--------------------------------------------------------------------------------`);
    console.log(`                           DEPLOYMENT ACTIONS`);
    console.log(`--------------------------------------------------------------------------------`);

    const deployment: HedgingVaultDeploymentResult = await deployHedgingVault(deploymentParams);

    testEnvDeployment.investmentVault = deployment.vault;
    testEnvDeployment.potionBuyAction = deployment.potionBuyAction;
    testEnvDeployment.swapToUSDCAction = deployment.swapToUSDCAction;
    testEnvDeployment.hedgingVaultOrchestrator = deployment.orchestrator;
    testEnvDeployment.roundsInputVault = deployment.roundsInputVault;
    testEnvDeployment.roundsOutputVault = deployment.roundsOutputVault;
    testEnvDeployment.roundsVaultExchanger = deployment.roundsVaultExchanger;

    console.log(`--------------------------------------------------------------------------------\n`);

    printDeploymentEnvironment(testEnvDeployment);

    if (deploymentConfig.testDepositAmount !== undefined && deploymentConfig.testDepositAmount !== BigNumber.from(0)) {
        await testDepositInVault(deploymentConfig.testDepositAmount, testEnvDeployment);
    }

    return testEnvDeployment;
}

export async function printDeploymentEnvironment(environmentDeployment: HedgingVaultEnvironmentDeployment) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`                         DEPLOYMENT ENVIRONMENT`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`  - Investment Vault: ${environmentDeployment.investmentVault.address}`);
    console.log(`  - Potion Buy Action: ${environmentDeployment.potionBuyAction.address}`);
    console.log(`  - Swap To USDC Action: ${environmentDeployment.swapToUSDCAction.address}`);
    console.log(`  - Orchestrator: ${environmentDeployment.hedgingVaultOrchestrator.address}`);
    console.log(`  - Rounds Input Vault: ${environmentDeployment.roundsInputVault.address}`);
    console.log(`  - Rounds Output Vault: ${environmentDeployment.roundsOutputVault.address}`);
    console.log(`  - Rounds Vault Exchanger: ${environmentDeployment.roundsVaultExchanger.address}`);
    console.log(`------------------------------------------------------`);
    console.log(`  - Underlying Asset: ${environmentDeployment.underlyingAsset.address}`);
    console.log(`  - USDC: ${environmentDeployment.USDC.address}`);
    console.log(`------------------------------------------------------`);
    if (environmentDeployment.chainlinkAggregatorUSDC !== undefined) {
        console.log(`  - Chainlink Aggregator USDC: ${environmentDeployment.chainlinkAggregatorUSDC.address}`);
    }
    if (environmentDeployment.chainlinkAggregatorUnderlying !== undefined) {
        console.log(
            `  - Chainlink Aggregator Underlying Asset: ${environmentDeployment.chainlinkAggregatorUnderlying.address}`,
        );
    }
    console.log(`  - Potion Liquidity Pool Manager: ${environmentDeployment.potionLiquidityPoolManager.address}`);
    console.log(`  - Opyn Oracle: ${environmentDeployment.opynOracle.address}`);
    console.log(`  - Opyn Address Book: ${environmentDeployment.opynAddressBook.address}`);
    console.log(`  - Opyn Controller: ${environmentDeployment.opynController.address}`);
    console.log(`  - Opyn Factory: ${environmentDeployment.opynFactory.address}`);
    console.log(`  - Opyn Oracle: ${environmentDeployment.opynOracle.address}`);
    console.log(`  - Opyn Swap Router: ${environmentDeployment.uniswapV3SwapRouter.address}`);
    console.log(`------------------------------------------------------`);
    console.log(`  - Admin: ${environmentDeployment.adminAddress.toString()}`);
    console.log(`  - Strategist: ${environmentDeployment.strategistAddress.toString()}`);
    console.log(`  - Operator: ${environmentDeployment.operatorAddress.toString()}`);
    console.log(`  - Shares Name: ${environmentDeployment.sharesName}`);
    console.log(`  - Shares Symbol: ${environmentDeployment.sharesSymbol}`);
    console.log(
        `  - Underlying Asset Cap: ${
            environmentDeployment.underlyingAssetCap.eq(ethers.constants.MaxUint256)
                ? "Maximum (uint256)"
                : ethers.utils.formatUnits(environmentDeployment.underlyingAssetCap)
        }`,
    );
    console.log(
        `  - Max Premium Percentage: ${environmentDeployment.maxPremiumPercentage.toString()} (${fromSolidityPercentage(
            environmentDeployment.maxPremiumPercentage,
        )}%)`,
    );
    console.log(
        `  - Premium Slippage: ${environmentDeployment.premiumSlippage.toString()} (${fromSolidityPercentage(
            environmentDeployment.premiumSlippage,
        )}%)`,
    );
    console.log(
        `  - Swap Slippage: ${environmentDeployment.swapSlippage.toString()} (${fromSolidityPercentage(
            environmentDeployment.swapSlippage,
        )}%)`,
    );
    console.log(`  - Max Swap Duration: ${environmentDeployment.maxSwapDurationSecs.toString()} seconds`);
    console.log(
        `  - Cycle Duration: ${environmentDeployment.cycleDurationSecs.toString()} seconds (${environmentDeployment.cycleDurationSecs
            .div(BigNumber.from(3600))
            .toString()} hours, ${environmentDeployment.cycleDurationSecs.div(BigNumber.from(86400)).toString()} days)`,
    );
    console.log(
        `  - Strike Percentage: ${environmentDeployment.strikePercentage.toString()} (${fromSolidityPercentage(
            environmentDeployment.strikePercentage,
        )}%)`,
    );
    console.log(
        `  - Hedging Percentage: ${environmentDeployment.hedgingRate.toString()} (${fromSolidityPercentage(
            environmentDeployment.hedgingRate,
        )}%)`,
    );
    console.log(
        `  - Management Fee: ${environmentDeployment.managementFee.toString()} (${fromSolidityPercentage(
            environmentDeployment.managementFee,
        )}%)`,
    );
    console.log(
        `  - Performance Fee: ${environmentDeployment.performanceFee.toString()} (${fromSolidityPercentage(
            environmentDeployment.performanceFee,
        )}%)`,
    );
    console.log(`  - Fees Recipient: ${environmentDeployment.feesRecipient}`);
    console.log(`--------------------------------------------------------------------------------\n`);
}
