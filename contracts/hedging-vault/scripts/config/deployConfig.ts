import { BigNumber } from "ethers";
import { NetworksType } from "../../hardhat.helpers";

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
    premiumSlippage: BigNumber;
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePriceInUSDC: BigNumber; // 8 decimals precision
    hedgingPercentage: BigNumber;

    // Fees configuration
    //
    // - If feesRecipient is not provided, then the admin address is used as the fees recipient
    // - The other values are mandatory
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient?: string;

    // Third-party dependencies
    //
    // If uniswapV3SwapRouter is not provided, then a fake uniswapV3SwapRouter is deployed and used
    // If potionLiquidityPoolManager is not provided, then a fake potionLiquidityPoolManager is deployed and used
    // If opynController is not provided, then a fake opynController is deployed and used
    // If opynFactory is not provided, then a fake opynFactory is deployed and used
    uniswapV3SwapRouter?: string;
    potionLiquidityPoolManager?: string;
    opynController?: string;
    opynFactory?: string;
}

export const PotionHedgingVaultDeploymentConfigs: { [key in NetworksType as string]: PotionHedgingVaultConfigParams } =
    {
        hardhat: {
            networkName: "hardhat",

            // Investment configuration
            maxPremiumPercentage: BigNumber.from(2000000), // 2%
            premiumSlippage: BigNumber.from(2000000), // 2%
            swapSlippage: BigNumber.from(2000000), // 2%
            maxSwapDurationSecs: BigNumber.from(60), // 1 minute
            cycleDurationSecs: BigNumber.from(86400), // 1 day
            strikePriceInUSDC: BigNumber.from(100000000000), // 1000.0 USDC/asset
            hedgingPercentage: BigNumber.from(100000000), // 100%

            // Fees configuration
            managementFee: BigNumber.from(3000000), // 3%
            performanceFee: BigNumber.from(3000000), // 3%
        },
        localhost: {
            networkName: "localhost",

            // Investment configuration
            maxPremiumPercentage: BigNumber.from(2000000), // 2%
            premiumSlippage: BigNumber.from(2000000), // 2%
            swapSlippage: BigNumber.from(2000000), // 2%
            maxSwapDurationSecs: BigNumber.from(60), // 1 minute
            cycleDurationSecs: BigNumber.from(86400), // 1 day
            strikePriceInUSDC: BigNumber.from(100000000000), // 1000.0 USDC/asset
            hedgingPercentage: BigNumber.from(100000000), // 100%

            // Fees configuration
            managementFee: BigNumber.from(3000000), // 3%
            performanceFee: BigNumber.from(3000000), // 3%
        },
    };
