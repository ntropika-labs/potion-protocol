import { HedgingVaultOperatorHelper } from "../../typechain";
import { deploy } from "../utils/deployment";

export interface HedgingVaultOperatorHelperDeployParams {
    vaultAddress: string;
    potionBuyActionAddress: string;
}

export async function deployHedgingVaultHelper(
    parameters: HedgingVaultOperatorHelperDeployParams,
): Promise<HedgingVaultOperatorHelper> {
    return (await deploy("HedgingVaultOperatorHelper", [
        parameters.vaultAddress,
        parameters.potionBuyActionAddress,
    ])) as HedgingVaultOperatorHelper;
}
