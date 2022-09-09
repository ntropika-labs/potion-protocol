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
    HedgingVaultOperatorHelper,
    MockOpynOracle,
} from "../../typechain";
import {
    mockERC20,
    mockPotionLiquidityPoolManager,
    mockUniswapV3SwapRouter,
    mockOpynController,
    mockOpynFactory,
    mockOpynOracle,
    mockOpynAddressBook,
    asMock,
} from "./MocksLibrary";
import { attachContract } from "../utils/deployment";
import { deployHedgingVault, HedgingVaultDeployParams } from "../hedging-vault/deployPotionHedgingVault";
import { PotionHedgingVaultDeploymentConfigs, PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Deployments } from "@potion-protocol/core";
export interface TestingEnvironmentDeployment {
    // Contracts
    investmentVault: InvestmentVault;
    potionBuyAction: PotionBuyAction;
    hedgingVaultOperatorHelper: HedgingVaultOperatorHelper;
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
    hedgingPercentage: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;
}

function getTokensFromUniswapPath(uniswapPath: string) {
    const pathArray = ethers.utils.arrayify(uniswapPath);

    const firstToken = ethers.utils.hexlify(pathArray.subarray(0, 20));
    const secondToken = ethers.utils.hexlify(pathArray.subarray(23, 43));

    return { firstToken, secondToken };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setupUniswapV3Mock(tEnv: TestingEnvironmentDeployment) {
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
        const mockingResult = await mockERC20(deploymentConfig, "USDC");
        testingEnvironmentDeployment.USDC = mockingResult.softMock ? mockingResult.softMock : mockingResult.hardMock;
    } else {
        testingEnvironmentDeployment.USDC = await attachContract<ERC20PresetMinterPauser>(
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
        testingEnvironmentDeployment.underlyingAsset = await attachContract<ERC20PresetMinterPauser>(
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
        testingEnvironmentDeployment.potionLiquidityPoolManager = await attachContract<IPotionLiquidityPool>(
            "IPotionLiquidityPool",
            deploymentConfig.potionLiquidityPoolManager,
            {
                alias: "PotionLiquidityPool",
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
        testingEnvironmentDeployment.opynMockOracle = opynOracle.softMock ? opynOracle.softMock : opynOracle.hardMock;

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
        testingEnvironmentDeployment.opynAddressBook = await attachContract<IOpynAddressBook>(
            "IOpynAddressBook",
            deploymentConfig.opynAddressBook,
            {
                alias: "OpynAddressBook",
            },
        );

        testingEnvironmentDeployment.opynController = await attachContract<IOpynController>(
            "IOpynController",
            await testingEnvironmentDeployment.opynAddressBook.getController(),
            {
                alias: "OpynController",
            },
        );

        testingEnvironmentDeployment.opynFactory = await attachContract<IOpynFactory>(
            "IOpynFactory",
            await testingEnvironmentDeployment.opynAddressBook.getOtokenFactory(),
            {
                alias: "OpynFactory",
            },
        );

        testingEnvironmentDeployment.opynOracle = await attachContract<IOpynOracle>(
            "IOpynOracle",
            await testingEnvironmentDeployment.opynAddressBook.getOracle(),
            {
                alias: "OpynOracle",
            },
        );

        // TODO: Is this still needed?
        if (deploymentConfig.opynMockOracle) {
            testingEnvironmentDeployment.opynMockOracle = await attachContract<MockOpynOracle>(
                "MockOpynOracle",
                deploymentConfig.opynMockOracle,
                {
                    alias: "MockOpynOracle",
                },
            );
        }
    }

    // Check if need to mock UniswapV3SwapRouter
    if (!deploymentConfig.uniswapV3SwapRouter) {
        const mockingResult = await mockUniswapV3SwapRouter(deploymentConfig, [
            testingEnvironmentDeployment.USDC.address,
            testingEnvironmentDeployment.underlyingAsset.address,
        ]);

        testingEnvironmentDeployment.uniswapV3SwapRouter = mockingResult.softMock
            ? mockingResult.softMock
            : mockingResult.hardMock;

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
        testingEnvironmentDeployment.uniswapV3SwapRouter = await attachContract<ISwapRouter>(
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

function getPotionProtocolDeployments(networkName: string): any {
    //@ts-expect-error iterator is not defined
    return Deployments[networkName].contracts;
}

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

export function getDeploymentConfig(networkName: string): PotionHedgingVaultConfigParams {
    const hedgingVaultConfig = PotionHedgingVaultDeploymentConfigs[networkName];

    if (networkName !== "hardhat" && networkName !== "localhost.test") {
        const potionProtocolDeployments = getPotionProtocolDeployments(networkName);
        if (potionProtocolDeployments !== undefined) {
            usePotionDeployments(hedgingVaultConfig, potionProtocolDeployments);
        }
    }

    return hedgingVaultConfig;
}

export async function deployTestingEnv(
    deploymentConfig: PotionHedgingVaultConfigParams,
    showLogs: boolean = false,
): Promise<TestingEnvironmentDeployment> {
    if (!showLogs) {
        console.log = function () {
            /* empty on purpose */
        };
    }

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

    const [investmentVault, potionBuyAction, hedgingVaultOperatorHelper] = await deployHedgingVault(deploymentParams);

    testEnvDeployment.investmentVault = investmentVault;
    testEnvDeployment.potionBuyAction = potionBuyAction;
    testEnvDeployment.hedgingVaultOperatorHelper = hedgingVaultOperatorHelper;

    printDeploymentEnvironment(testEnvDeployment);

    return testEnvDeployment;
}

export async function printDeploymentEnvironment(testEnvDeployment: TestingEnvironmentDeployment) {
    console.log(`------------------------------------------------------`);
    console.log(`                 DEPLOYMENT ENVIRONMENT`);
    console.log(`------------------------------------------------------`);
    console.log(`  - Investment Vault: ${testEnvDeployment.investmentVault.address}`);
    console.log(`  - Potion Buy Action: ${testEnvDeployment.potionBuyAction.address}`);
    console.log(`  - Operator Helper: ${testEnvDeployment.hedgingVaultOperatorHelper.address}`);
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
    console.log(`  - Admin address: ${testEnvDeployment.adminAddress.toString()}`);
    console.log(`  - Strategist address: ${testEnvDeployment.strategistAddress.toString()}`);
    console.log(`  - Operator address: ${testEnvDeployment.operatorAddress.toString()}`);
    console.log(`  - Underlying Asset cap: ${testEnvDeployment.underlyingAssetCap.toString()}`);
    console.log(`  - Max Premium Percentage: ${testEnvDeployment.maxPremiumPercentage.toString()}`);
    console.log(`  - Premium Slippage: ${testEnvDeployment.premiumSlippage.toString()}`);
    console.log(`  - Swap Slippage: ${testEnvDeployment.swapSlippage.toString()}`);
    console.log(`  - Max Swap Duration (secs): ${testEnvDeployment.maxSwapDurationSecs.toString()}`);
    console.log(`  - Cycle Duration (secs): ${testEnvDeployment.cycleDurationSecs.toString()}`);
    console.log(`  - Strike Percentage: ${testEnvDeployment.strikePercentage.toString()}`);
    console.log(`  - Hedging Percentage: ${testEnvDeployment.hedgingPercentage.toString()}`);
    console.log(`  - Management Fee: ${testEnvDeployment.managementFee.toString()}`);
    console.log(`  - Performance Fee: ${testEnvDeployment.performanceFee.toString()}`);
    console.log(`  - Fees Recipient: ${testEnvDeployment.feesRecipient}`);
    console.log(`------------------------------------------------------`);
}
