import { InvestmentVaultDeployParams, deployInvestmentVault } from "../common/deployInvestmentVault";
import { PotionBuyActionDeployParams, deployPotionBuyAction } from "../common/deployPotionBuyAction";
import { InvestmentVault, PotionBuyAction } from "../../typechain";
import { BigNumber } from "ethers";

export interface HedgingVaultDeployParams {
    // Roles
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;

    // Assets addresses
    USDC: string;
    underlyingAsset: string;

    // Investment configuration
    underlyingAssetCap: BigNumber;
    maxPremiumPercentage: BigNumber; // 6 decimals
    premiumSlippage: BigNumber; // 6 decimals
    swapSlippage: BigNumber; // 6 decimals
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePercentage: BigNumber; // 6 decimals
    hedgingPercentage: BigNumber; // 6 decimals

    // Fees configuration
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;

    // Third-party dependencies
    uniswapV3SwapRouter: string;
    potionLiquidityPoolManager: string;
    opynController: string;
    opynFactory: string;
}

export async function deployHedgingVault(
    parameters: HedgingVaultDeployParams,
): Promise<[InvestmentVault, PotionBuyAction]> {
    const potionBuyParams: PotionBuyActionDeployParams = {
        adminAddress: parameters.adminAddress,
        strategistAddress: parameters.strategistAddress,
        operatorAddress: parameters.operatorAddress,
        investmentAsset: parameters.underlyingAsset,
        USDC: parameters.USDC,
        uniswapV3SwapRouter: parameters.uniswapV3SwapRouter,
        opynController: parameters.opynController,
        opynFactory: parameters.opynFactory,
        potionLiquidityPoolManager: parameters.potionLiquidityPoolManager,
        maxPremiumPercentage: parameters.maxPremiumPercentage,
        premiumSlippage: parameters.premiumSlippage,
        swapSlippage: parameters.swapSlippage,
        maxSwapDurationSecs: parameters.maxSwapDurationSecs,
        cycleDurationSecs: parameters.cycleDurationSecs,
        strikePercentage: parameters.strikePercentage,
    };

    const potionBuyContract: PotionBuyAction = await deployPotionBuyAction(potionBuyParams);

    const investmentVaultParams: InvestmentVaultDeployParams = {
        adminAddress: parameters.adminAddress,
        strategistAddress: parameters.strategistAddress,
        operatorAddress: parameters.operatorAddress,
        underlyingAsset: parameters.underlyingAsset,
        underlyingAssetCap: parameters.underlyingAssetCap,
        managementFee: parameters.managementFee,
        performanceFee: parameters.performanceFee,
        feesRecipient: parameters.feesRecipient,
        actions: [potionBuyContract.address],
        principalPercentages: [parameters.hedgingPercentage],
    };

    const investmentVaultContract: InvestmentVault = await deployInvestmentVault(investmentVaultParams);

    // Set the vault as the operator for the action
    await potionBuyContract.changeVault(investmentVaultContract.address);

    return [investmentVaultContract, potionBuyContract];
}
