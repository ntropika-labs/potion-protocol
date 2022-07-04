import { PotionBuyAction } from "../../typechain";
import { deployUpgrade } from "../utils/deployment";

export interface PotionBuyActionDeployParams {
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    investmentAsset: string;
    USDC: string;
    uniswapV3SwapRouter: string;
    potionLiquidityPoolManager: string;
    maxPremiumPercentage: number;
    premiumSlippage: number;
    swapSlippage: number;
    maxSwapDurationSecs: number;
    cycleDurationSecs: number;
}

export async function deployPotionBuyAction(parameters: PotionBuyActionDeployParams): Promise<PotionBuyAction> {
    return (await deployUpgrade("PotionBuyAction", [
        parameters.adminAddress,
        parameters.strategistAddress,
        parameters.operatorAddress,
        parameters.investmentAsset,
        parameters.USDC,
        parameters.uniswapV3SwapRouter,
        parameters.potionLiquidityPoolManager,
        parameters.maxPremiumPercentage,
        parameters.premiumSlippage,
        parameters.swapSlippage,
        parameters.maxSwapDurationSecs,
        parameters.cycleDurationSecs,
    ])) as PotionBuyAction;
}
