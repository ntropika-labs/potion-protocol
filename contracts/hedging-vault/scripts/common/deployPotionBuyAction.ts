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
    maxPremiumPercentage: BigNumber;
    premiumSlippage: BigNumber;
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePriceInUSDC: BigNumber; // 8 decimals
}

export async function deployPotionBuyAction(parameters: PotionBuyActionDeployParams): Promise<PotionBuyAction> {
    return (await deployUpgrade("PotionBuyAction", [parameters])) as PotionBuyAction;
}