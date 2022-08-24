import { HedgingVaultOperatorHelper } from "../../typechain";
import { deploy } from "../utils/deployment";

export interface HedgingVaultOperatorHelperDeployParams {
    vaultAddress: string;
    potionBuyActionAddress: string;
}

export async function deployHedgingVaultHelper(
    parameters: HedgingVaultOperatorHelperDeployParams,
): Promise<HedgingVaultOperatorHelper> {
    console.log("- Deploying HedgingVaultOperatorHelper...");
    const hedgingVaultOperatorHelper = (await deploy("HedgingVaultOperatorHelper", [
        parameters.vaultAddress,
        parameters.potionBuyActionAddress,
    ])) as HedgingVaultOperatorHelper;
    console.log(`    ...deployed to: ${hedgingVaultOperatorHelper.address}`);
    return hedgingVaultOperatorHelper;
}
