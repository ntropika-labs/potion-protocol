import { NetworksType } from "../../hardhat.helpers";

/**
 * @title HedgingVaultConfigParams
 *
 * @notice Configuration parameters for the hedging vaults. It defines the configuration for a specific network.
 * These are used to populate the { HedgingVaultDeploymentConfig } object in order to deploy the contracts
 */
export interface HedgingVaultConfigParams {
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
    maxPremiumPercentage: number;
    premiumSlippage: number;
    swapSlippage: number;
    maxSwapDurationSecs: number;
    cycleDurationSecs: number;

    // Fees configuration
    //
    // - If feesRecipient is not provided, then the admin address is used as the fees recipient
    // - The other values are mandatory
    managementFee: number;
    performanceFee: number;
    feesRecipient?: string;

    // Third-party dependencies
    //
    // If uniswapV3SwapRouter is not provided, then a fake uniswapV3SwapRouter is deployed and used
    // If potionLiquidityPoolManager is not provided, then a fake potionLiquidityPoolManager is deployed and used
    uniswapV3SwapRouter?: string;
    potionLiquidityPoolManager?: string;
}

export const HedgingVaultDeploymentConfigs: { [key in NetworksType as string]: HedgingVaultConfigParams } = {
    hardhat: {
        // Investment configuration
        maxPremiumPercentage: 2000000, // 2%
        premiumSlippage: 2000000, // 2%
        swapSlippage: 2000000, // 2%
        maxSwapDurationSecs: 60, // 1 minute
        cycleDurationSecs: 86400, // 1 day

        // Fees configuration
        managementFee: 3000000, // 3%
        performanceFee: 3000000, // 3%
    },
};
