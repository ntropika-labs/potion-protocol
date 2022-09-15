import { HedgingVaultOrchestrator } from "../../typechain";
import { deploy } from "../utils/deployment";

export async function deployHedgingVaultHelper(): Promise<HedgingVaultOrchestrator> {
    console.log("- Deploying HedgingVaultOrchestrator...");
    const hedgingVaultOrchestrator = (await deploy("HedgingVaultOrchestrator", [])) as HedgingVaultOrchestrator;
    console.log(`    ...deployed to: ${hedgingVaultOrchestrator.address}`);
    return hedgingVaultOrchestrator;
}
