import { BigNumber } from "ethers";
import { NetworksType } from "../../hardhat.helpers";
import * as PercentageUtils from "hedging-vault-sdk";

/**
 * @title PotionHedgingVaultConfigParams
 *
 * @notice Configuration parameters for the hedging vaults. It defines the configuration for a specific network.
 * These are used to populate the { HedgingVaultDeploymentConfig } object in order to deploy the contracts
 */
export interface PotionHedgingVaultConfigParams {
    networkName: NetworksType | "localhost";

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
    hedgingPercentage: BigNumber; // 6 decimals

    // Fees configuration
    //
    // - If feesRecipient is not provided, then the admin address is used as the fees recipient
    // - The other values are mandatory
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient?: string;

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
}

export const PotionHedgingVaultDeploymentConfigs: { [key: string]: PotionHedgingVaultConfigParams } = {
    hardhat: {
        networkName: "hardhat",

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), // 15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //       2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //          2%
        maxSwapDurationSecs: BigNumber.from(60), //                        1 minute
        cycleDurationSecs: BigNumber.from(86400), //                       1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //     80%
        hedgingPercentage: PercentageUtils.toSolidityPercentage(100), //   100%

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(3), //         3%
        performanceFee: PercentageUtils.toSolidityPercentage(3), //        3%
    },
    "localhost.test": {
        networkName: "localhost",

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), // 15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //       2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //          2%
        maxSwapDurationSecs: BigNumber.from(60), //                        1 minute
        cycleDurationSecs: BigNumber.from(86400), //                       1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //     80%
        hedgingPercentage: PercentageUtils.toSolidityPercentage(100), //   100%

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(3), //         3%
        performanceFee: PercentageUtils.toSolidityPercentage(3), //        3%
    },
    "localhost.hedging": {
        networkName: "localhost",

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), // 15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //       2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //          2%
        maxSwapDurationSecs: BigNumber.from(60), //                        1 minute
        cycleDurationSecs: BigNumber.from(86400), //                       1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //     80%
        hedgingPercentage: PercentageUtils.toSolidityPercentage(100), //   100%

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(3), //         3%
        performanceFee: PercentageUtils.toSolidityPercentage(3), //        3%
    },
    "localhost.goerli": {
        networkName: "localhost",

        // Asset address
        USDC: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", //            Custom USDC
        underlyingAsset: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), // 15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //       2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //          2%
        maxSwapDurationSecs: BigNumber.from(60), //                        1 minute
        cycleDurationSecs: BigNumber.from(86400), //                       1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //     80%
        hedgingPercentage: PercentageUtils.toSolidityPercentage(100), //   100%

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //         0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //        0%

        // Third-party dependencies
        uniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",
    },
    goerli: {
        networkName: "goerli",

        // Asset address
        USDC: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", //            Custom USDC
        underlyingAsset: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH

        // Investment configuration
        maxPremiumPercentage: PercentageUtils.toSolidityPercentage(15), // 15%
        premiumSlippage: PercentageUtils.toSolidityPercentage(2), //       2%
        swapSlippage: PercentageUtils.toSolidityPercentage(2), //          2%
        maxSwapDurationSecs: BigNumber.from(60), //                        1 minute
        cycleDurationSecs: BigNumber.from(86400), //                       1 day
        strikePercentage: PercentageUtils.toSolidityPercentage(80), //     80%
        hedgingPercentage: PercentageUtils.toSolidityPercentage(100), //   100%

        // Fees configuration
        managementFee: PercentageUtils.toSolidityPercentage(0), //         0%
        performanceFee: PercentageUtils.toSolidityPercentage(0), //        0%

        // Third-party dependencies
        uniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        potionLiquidityPoolManager: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
        opynAddressBook: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",
    },
};
