import { BigNumber } from "ethers";
import { PotionBuyAction } from "../../typechain";
import { DeploymentFlags, Deployments } from "contracts-utils";

export interface PotionBuyActionDeployParams {
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    investmentAsset: string;
    USDC: string;
    uniswapV3SwapRouter: string;
    potionLiquidityPoolManager: string;
    opynAddressBook: string;
    maxPremiumPercentage: BigNumber; // 6 decimals
    premiumSlippage: BigNumber; // 6 decimals
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePercentage: BigNumber; // 6 decimals
    hedgingRate: BigNumber; // 6 decimals
    hedgingRateSlippage: BigNumber; // 6 decimals
}

export async function deployPotionBuyAction(parameters: PotionBuyActionDeployParams): Promise<PotionBuyAction> {
    console.log("- Deploying PotionBuyAction...");
    const potionBuyAction = (await Deployments.deploy("PotionBuyAction", [parameters], {
        options: DeploymentFlags.Export | DeploymentFlags.Upgradeable | DeploymentFlags.Verify,
    })) as PotionBuyAction;
    console.log(`    ...deployed to: ${potionBuyAction.address}`);
    return potionBuyAction;
}
