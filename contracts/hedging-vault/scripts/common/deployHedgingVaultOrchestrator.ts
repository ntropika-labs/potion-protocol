import { HedgingVaultOrchestrator } from "../../typechain";
import { deploy } from "contracts-utils";

export async function deployHedgingVaultOrchestrator(): Promise<HedgingVaultOrchestrator> {
    console.log("- Deploying HedgingVaultOrchestrator...");
    const hedgingVaultOrchestrator = (await deploy("HedgingVaultOrchestrator", [])) as HedgingVaultOrchestrator;
    console.log(`    ...deployed to: ${hedgingVaultOrchestrator.address}`);
    return hedgingVaultOrchestrator;
}
