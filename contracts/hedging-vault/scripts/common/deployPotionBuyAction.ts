import { BigNumber } from "ethers";
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
    opynController: string;
    opynFactory: string;
    maxPremiumPercentage: BigNumber; // 6 decimals
    premiumSlippage: BigNumber; // 6 decimals
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePercentage: BigNumber; // 6 decimals
}

export async function deployPotionBuyAction(parameters: PotionBuyActionDeployParams): Promise<PotionBuyAction> {
    return (await deployUpgrade("PotionBuyAction", [parameters])) as PotionBuyAction;
}
