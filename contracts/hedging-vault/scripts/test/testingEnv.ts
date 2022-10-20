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
} from "../../typechain";
import {
    mockERC20,
    mockPotionLiquidityPoolManager,
    mockUniswapV3SwapRouter,
    mockOpynController,
    mockOpynFactory,
    mockOpynOracle,
    mockOpynAddressBook,
} from "./contractsMocks";
import { asMock, Deployments, ProviderTypes } from "contracts-utils";
import type { DeploymentType } from "contracts-utils";
import { fromSolidityPercentage } from "hedging-vault-sdk";
import {
    deployHedgingVault,
    printHedgingVaultDeployParams,
    HedgingVaultDeploymentResult,
    HedgingVaultDeployParams,
} from "../hedging-vault/deployPotionHedgingVault";
import { PotionHedgingVaultDeploymentConfigs, PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Deployments as PotionDeployments } from "@potion-protocol/core";

export interface TestingEnvironmentDeployment {
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
    hedgingRate: BigNumber;
    hedgingRateSlippage: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;
    inputReceiptsURI: string;
    outputReceiptsURI: string;
}

function getTokensFromUniswapPath(uniswapPath: string) {
    const pathArray = ethers.utils.arrayify(uniswapPath);

    const firstToken = ethers.utils.hexlify(pathArray.subarray(0, 20));
    const secondToken = ethers.utils.hexlify(pathArray.subarray(23, 43));

    return { firstToken, secondToken };
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function setupUniswapV3Mock(tEnv: TestingEnvironmentDeployment) {
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
): Promise<Partial<TestingEnvironmentDeployment>> {
    const testingEnvironmentDeployment: Partial<TestingEnvironmentDeployment> = {};

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
        testingEnvironmentDeployment.opynController = await mockOpynController();
        testingEnvironmentDeployment.opynFactory = await mockOpynFactory();
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
        testingEnvironmentDeployment.uniswapV3SwapRouter = await mockUniswapV3SwapRouter([
            testingEnvironmentDeployment.USDC.address,
            testingEnvironmentDeployment.underlyingAsset.address,
        ]);

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
    testingEnvironmentDeployment.hedgingRate = deploymentConfig.hedgingRate;
    testingEnvironmentDeployment.hedgingRateSlippage = deploymentConfig.hedgingRateSlippage;
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

    return testingEnvironmentDeployment as TestingEnvironmentDeployment;
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

export function getDeploymentConfig(deploymentType: DeploymentType): PotionHedgingVaultConfigParams {
    const deploymentTypeName = Deployments.getDeploymentNameFromType(deploymentType);
    const legacyDeploymentTypeName = Deployments.getLegacyDeploymentNameFromType(deploymentType);
    const hedgingVaultConfig = PotionHedgingVaultDeploymentConfigs[deploymentTypeName];

    let potionProtocolDeployments;
    if (deploymentType.provider !== ProviderTypes.Internal && deploymentType.config !== "test") {
        potionProtocolDeployments = getPotionProtocolDeployments(deploymentTypeName);

        if (potionProtocolDeployments === undefined) {
            potionProtocolDeployments = getPotionProtocolDeployments(legacyDeploymentTypeName);
        }

        if (potionProtocolDeployments !== undefined) {
            usePotionDeployments(hedgingVaultConfig, potionProtocolDeployments);
        }
    }

    if (potionProtocolDeployments !== undefined) {
        console.log("[Using Potion Protocol deployments]\n");
    } else {
        console.log(
            `[Not using potion protocol deployments, couldn't find ${deploymentTypeName} or ${legacyDeploymentTypeName} deployments]\n`,
        );
    }

    return hedgingVaultConfig;
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
        hedgingRate: testEnvDeployment.hedgingRate,
        hedgingRateSlippage: testEnvDeployment.hedgingRateSlippage,

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

    return testEnvDeployment;
}

export async function printDeploymentEnvironment(testEnvDeployment: TestingEnvironmentDeployment) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`                         DEPLOYMENT ENVIRONMENT`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`  - Investment Vault: ${testEnvDeployment.investmentVault.address}`);
    console.log(`  - Potion Buy Action: ${testEnvDeployment.potionBuyAction.address}`);
    console.log(`  - Swap To USDC Action: ${testEnvDeployment.swapToUSDCAction.address}`);
    console.log(`  - Orchestrator: ${testEnvDeployment.hedgingVaultOrchestrator.address}`);
    console.log(`  - Rounds Input Vault: ${testEnvDeployment.roundsInputVault.address}`);
    console.log(`  - Rounds Output Vault: ${testEnvDeployment.roundsOutputVault.address}`);
    console.log(`  - Rounds Vault Exchanger: ${testEnvDeployment.roundsVaultExchanger.address}`);
    console.log(`------------------------------------------------------`);
    console.log(`  - Underlying Asset: ${testEnvDeployment.underlyingAsset.address}`);
    console.log(`  - USDC: ${testEnvDeployment.USDC.address}`);
    console.log(`------------------------------------------------------`);
    console.log(`  - Potion Liquidity Pool Manager: ${testEnvDeployment.potionLiquidityPoolManager.address}`);
    console.log(`  - Opyn Oracle: ${testEnvDeployment.opynOracle.address}`);
    console.log(`  - Opyn Address Book: ${testEnvDeployment.opynAddressBook.address}`);
    console.log(`  - Opyn Controller: ${testEnvDeployment.opynController.address}`);
    console.log(`  - Opyn Factory: ${testEnvDeployment.opynFactory.address}`);
    console.log(`  - Opyn Oracle: ${testEnvDeployment.opynOracle.address}`);
    console.log(`  - Opyn Swap Router: ${testEnvDeployment.uniswapV3SwapRouter.address}`);
    console.log(`------------------------------------------------------`);
    console.log(`  - Admin: ${testEnvDeployment.adminAddress.toString()}`);
    console.log(`  - Strategist: ${testEnvDeployment.strategistAddress.toString()}`);
    console.log(`  - Operator: ${testEnvDeployment.operatorAddress.toString()}`);
    console.log(
        `  - Underlying Asset Cap: ${
            testEnvDeployment.underlyingAssetCap.eq(ethers.constants.MaxUint256)
                ? "Maximum (uint256)"
                : ethers.utils.formatUnits(testEnvDeployment.underlyingAssetCap)
        }`,
    );
    console.log(
        `  - Max Premium Percentage: ${testEnvDeployment.maxPremiumPercentage.toString()} (${fromSolidityPercentage(
            testEnvDeployment.maxPremiumPercentage,
        )}%)`,
    );
    console.log(
        `  - Premium Slippage: ${testEnvDeployment.premiumSlippage.toString()} (${fromSolidityPercentage(
            testEnvDeployment.premiumSlippage,
        )}%)`,
    );
    console.log(
        `  - Swap Slippage: ${testEnvDeployment.swapSlippage.toString()} (${fromSolidityPercentage(
            testEnvDeployment.swapSlippage,
        )}%)`,
    );
    console.log(`  - Max Swap Duration: ${testEnvDeployment.maxSwapDurationSecs.toString()} seconds`);
    console.log(
        `  - Cycle Duration: ${testEnvDeployment.cycleDurationSecs.toString()} seconds (${testEnvDeployment.cycleDurationSecs
            .div(BigNumber.from(3600))
            .toString()} hours, ${testEnvDeployment.cycleDurationSecs.div(BigNumber.from(86400)).toString()} days)`,
    );
    console.log(
        `  - Strike Percentage: ${testEnvDeployment.strikePercentage.toString()} (${fromSolidityPercentage(
            testEnvDeployment.strikePercentage,
        )}%)`,
    );
    console.log(
        `  - Hedging Percentage: ${testEnvDeployment.hedgingRate.toString()} (${fromSolidityPercentage(
            testEnvDeployment.hedgingRate,
        )}%)`,
    );
    console.log(
        `  - Management Fee: ${testEnvDeployment.managementFee.toString()} (${fromSolidityPercentage(
            testEnvDeployment.managementFee,
        )}%)`,
    );
    console.log(
        `  - Performance Fee: ${testEnvDeployment.performanceFee.toString()} (${fromSolidityPercentage(
            testEnvDeployment.performanceFee,
        )}%)`,
    );
    console.log(`  - Fees Recipient: ${testEnvDeployment.feesRecipient}`);
    console.log(`--------------------------------------------------------------------------------\n`);
}
