import { HedgingVaultOrchestrator } from "../../typechain";
import { deploy } from "../utils/deployment";

export interface HedgingVaultOrchestratorDeployParams {
    vaultAddress: string;
    potionBuyActionAddress: string;
}

export async function deployHedgingVaultHelper(
    parameters: HedgingVaultOrchestratorDeployParams,
): Promise<HedgingVaultOrchestrator> {
    console.log("- Deploying HedgingVaultOrchestrator...");
    const hedgingVaultOrchestrator = (await deploy("HedgingVaultOrchestrator", [
        parameters.vaultAddress,
        parameters.potionBuyActionAddress,
    ])) as HedgingVaultOrchestrator;
    console.log(`    ...deployed to: ${hedgingVaultOrchestrator.address}`);
    return hedgingVaultOrchestrator;
}
