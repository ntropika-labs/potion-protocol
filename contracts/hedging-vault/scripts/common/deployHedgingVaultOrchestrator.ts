import { HedgingVaultOrchestrator } from "../../typechain";
import { Deployments } from "contracts-utils";
import { IVaultV0 } from "../../typechain";

export interface HedgingVaultOrchestratorDeployParams {
    potionBuyStrategy: IVaultV0.StrategyStruct;
    swapToUSDCStrategy: IVaultV0.StrategyStruct;
}

export async function deployHedgingVaultOrchestrator(
    params: HedgingVaultOrchestratorDeployParams,
): Promise<HedgingVaultOrchestrator> {
    console.log("- Deploying HedgingVaultOrchestrator...");
    const hedgingVaultOrchestrator = (await Deployments.deploy("HedgingVaultOrchestrator", [
        params.potionBuyStrategy,
        params.swapToUSDCStrategy,
    ])) as HedgingVaultOrchestrator;
    console.log(`    ...deployed to: ${hedgingVaultOrchestrator.address}`);
    return hedgingVaultOrchestrator;
}
