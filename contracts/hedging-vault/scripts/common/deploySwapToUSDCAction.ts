import { BigNumber } from "ethers";
import { SwapToUSDCAction } from "../../typechain";
import { DeploymentFlags, Deployments } from "contracts-utils";

export interface SwapToUSDCActionDeployParams {
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    investmentAsset: string;
    USDC: string;
    uniswapV3SwapRouter: string;
    swapSlippage: BigNumber;
    maxSwapDurationSecs: BigNumber;
    swapPercentage: BigNumber;
}

export async function deploySwapToUSDCAction(parameters: SwapToUSDCActionDeployParams): Promise<SwapToUSDCAction> {
    console.log("- Deploying SwapToUSDCAction...");
    const swapToUSDCAction = (await Deployments.deploy("SwapToUSDCAction", [parameters], {
        options: DeploymentFlags.Export | DeploymentFlags.Upgradeable | DeploymentFlags.Verify,
    })) as SwapToUSDCAction;
    console.log(`    ...deployed to: ${swapToUSDCAction.address}`);
    return swapToUSDCAction;
}
