import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import * as PercentageUtils from "hedging-vault-sdk";

/**
 * @title PotionHedgingVaultConfigParams
 *
 * @notice Configuration parameters for the hedging vaults. It defines the configuration for a specific network.
 * These are used to populate the { HedgingVaultDeploymentConfig } object in order to deploy the contracts
 */
export interface PotionHedgingVaultConfigParams {
    // Roles
    //
    // - Admin address is the deployer itself
    // - If the strategist address is not provided, the admin address is used as the strategist
    // - If the operator address is not provided, the admin address is used as the operator
    strategistAddress?: string;
    operatorAddress?: string;

    // Assets addresses
    //
    // - If USDC is not provided, then a fake USDC is deployed and used
    // - If underlyingAsset is not provided, then a fake underlying asset is deployed and used
    USDC?: string;
    underlyingAsset?: string;

    // Investment configuration
    //
    // All fields are mandatory
    underlyingAssetCap?: BigNumber;
    maxPremiumPercentage: BigNumber;
    premiumSlippage: BigNumber; // 6 decimals
    swapSlippage: BigNumber; // 6 decimals
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePercentage: BigNumber; // 6 decimals
    hedgingRate: BigNumber; // 6 decimals
    hedgingRateSlippage: BigNumber; // 6 decimals

    // Shares configuration
    //
    // Shares name and symbol
    sharesName: string;
    sharesSymbol: string;

    // Fees configuration
    //
    // - If feesRecipient is not provided, then the admin address is used as the fees recipient
    // - The other values are mandatory
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient?: string;

    // Rounds Vault Receipts URI
    inputReceiptsURI?: string;
    outputReceiptsURI?: string;

    // Third-party dependencies
    //
    // If uniswapV3SwapRouter is not provided, then a mock uniswapV3SwapRouter is deployed and used
    // If potionLiquidityPoolManager is not provided, then a mock potionLiquidityPoolManager is deployed and used
    // If opynAddressBook is not provided, then a mock opynAddressBook is deployed and used
    // If opynOracle is not provided then it is not used
    uniswapV3SwapRouter?: string;
    potionLiquidityPoolManager?: string;
    opynAddressBook?: string;
    opynMockOracle?: string;

    // Dependencies config
    //
    // Config name of the dependencies to use. If empty, then the same config name as
    // the current deployment is used
    potionProtocolDeployConfigName?: string;

    // Test Deposit
    //
    // If defined and not zero, then a test deposit is performed after the deployment by the deployer address
    testDepositAmount?: BigNumber;
}

const DefaultConfig: PotionHedgingVaultConfigParams = {
    // Investment configuration
    maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
    premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
    swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
    maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
    cycleDurationSecs: BigNumber.from(86400), //                            1 day
    strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
    hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
    hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

    // Shares configuration
    sharesName: "HV-80-100-1D-WETH",
    sharesSymbol: "HVP1",

    // Fees configuration
    managementFee: PercentageUtils.toSolidityPercentage(3), //              3%
    performanceFee: PercentageUtils.toSolidityPercentage(3), //             3%
};

export const PotionHedgingVaultDeploymentConfigs: { [key: string]: PotionHedgingVaultConfigParams } = {
    hardhat: DefaultConfig,
    "localhost.test": DefaultConfig,
    "localhost.hedging": DefaultConfig,
    "internal.develop.hedging": DefaultConfig,
    "hardhat.develop.hedging": DefaultConfig,
    "internal.develop.test": DefaultConfig,
    "hardhat.develop.test": DefaultConfig,
    "hardhat.develop.multivaultA": {
        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HVA-80-100-1D-WETH",
        sharesSymbol: "HVAP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(3), //              3%
        performanceFee: PercentageUtils.toSolidityPercentage(3), //             3%

        // Third-party dependencies
        potionProtocolDeployConfigName: "hardhat.develop.hedging",

        // Test Deposit
        testDepositAmount: parseEther("10"),
    },
    "hardhat.develop.multivaultB": {
        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HVB-80-100-1D-WETH",
        sharesSymbol: "HVBP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(3), //              3%
        performanceFee: PercentageUtils.toSolidityPercentage(3), //             3%

        // Third-party dependencies
        potionProtocolDeployConfigName: "hardhat.develop.hedging",

        // Test Deposit
        testDepositAmount: parseEther("10"),
    },
    "hardhat.develop.multivaultC": {
        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HVC-80-100-1D-WETH",
        sharesSymbol: "HVCP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(3), //              3%
        performanceFee: PercentageUtils.toSolidityPercentage(3), //             3%

        // Third-party dependencies
        potionProtocolDeployConfigName: "hardhat.develop.hedging",

        // Test Deposit
        testDepositAmount: parseEther("10"),
    },
    "localhost.goerli": {
        // Asset address
        USDC: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", //            Custom USDC
        underlyingAsset: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HV-80-100-1D-WETH",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        uniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",
    },
    goerli: {
        // Asset address
        USDC: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", //            Custom USDC
        underlyingAsset: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HV-80-100-1D-WETH",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        uniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",
    },
    "remote.goerli.testcomp-1": {
        // Asset address
        USDC: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", //            Custom USDC
        underlyingAsset: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", // Custom WETH

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HV-80-100-1D-WETH",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",

        // Third-party dependencies
        potionProtocolDeployConfigName: "remote.goerli.testcomp",
    },
    "remote.goerli.testcomp-2": {
        // Asset address
        USDC: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", //            Custom USDC
        underlyingAsset: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", // Custom WBTC

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HV-80-100-1D-WETH",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",

        // Third-party dependencies
        potionProtocolDeployConfigName: "remote.goerli.testcomp",
    },
    "remote.goerli.testcomp-3": {
        // Asset address
        USDC: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", //            Custom USDC
        underlyingAsset: "0x0165878A594ca255338adfa4d48449f69242Eb8F", // Custom LINK

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HV-80-100-1D-WETH",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",

        // Third-party dependencies
        potionProtocolDeployConfigName: "remote.goerli.testcomp",
    },
    "remote.ply-mumbai.testcomp-1": {
        // Asset address
        USDC: "0x4A9c8d8226E017e8e8da824c567cf41a9F8275C3", //            Custom USDC
        underlyingAsset: "0x4Ea6Ee9316f1E5DBf7Fc7e63DF3f65764F2b0ac0", // Custom WETH

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(100), //              100%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), // 2%

        // Shares configuration
        sharesName: "HV-80-100-1D-WETH",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        potionProtocolDeployConfigName: "remote.ply-mumbai.testcomp",
        uniswapV3SwapRouter: "0xBCe5E926081B7dFC312D608FBD12e25aa5D82EC0",
    },
    "remote.ply-mumbai.testcomp-2": {
        // Asset address
        USDC: "0x4A9c8d8226E017e8e8da824c567cf41a9F8275C3", //            Custom USDC
        underlyingAsset: "0xb3086e79c2f6328676899E01C883B51830594A64", // Custom WBTC

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(70), //          70%
        hedgingRate: PercentageUtils.toSolidityPercentage(80), //               80%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(3), //        3%

        // Shares configuration
        sharesName: "HV-70-80-1D-WBTC",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        potionProtocolDeployConfigName: "remote.ply-mumbai.testcomp",
        uniswapV3SwapRouter: "0xBCe5E926081B7dFC312D608FBD12e25aa5D82EC0",
    },
    "remote.ply-mumbai.testcomp-3": {
        // Asset address
        USDC: "0x4A9c8d8226E017e8e8da824c567cf41a9F8275C3", //            Custom USDC
        underlyingAsset: "0xe59914ED345212190778F8e7427B0B6f73332D50", // Custom LINK

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), //      15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //            2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //               2%
        maxSwapDurationSecs: BigNumber.from(60), //                             1 minute
        cycleDurationSecs: BigNumber.from(86400), //                            1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //          80%
        hedgingRate: PercentageUtils.toSolidityPercentage(200), //              200%
        hedgingRateSlippage: PercentageUtils.toSolidityPercentage(2), //        4%

        // Shares configuration
        sharesName: "HV-80-200-1D-LINK",
        sharesSymbol: "HVP1",

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //              0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //             0%

        // Third-party dependencies
        potionProtocolDeployConfigName: "remote.ply-mumbai.testcomp",
        uniswapV3SwapRouter: "0xBCe5E926081B7dFC312D608FBD12e25aa5D82EC0",
    },
};
