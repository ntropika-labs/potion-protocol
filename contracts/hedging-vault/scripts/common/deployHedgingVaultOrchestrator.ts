import { HedgingVaultOrchestrator } from "../../typechain";
import { Deployments } from "contracts-utils";

export async function deployHedgingVaultOrchestrator(): Promise<HedgingVaultOrchestrator> {
    console.log("- Deploying HedgingVaultOrchestrator...");
    const hedgingVaultOrchestrator = (await Deployments.Get().deploy(
        "HedgingVaultOrchestrator",
        [],
    )) as HedgingVaultOrchestrator;
    console.log(`    ...deployed to: ${hedgingVaultOrchestrator.address}`);
    return hedgingVaultOrchestrator;
}
