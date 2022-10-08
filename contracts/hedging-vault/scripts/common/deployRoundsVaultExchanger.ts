import { RoundsVaultExchanger } from "../../typechain";
import { Deployments } from "contracts-utils";

export async function deployRoundsVaultExchanger(): Promise<RoundsVaultExchanger> {
    console.log("- Deploying RoundsVaultExchanger...");
    const roundsVaultExchanger = (await Deployments.Get().deploy("RoundsVaultExchanger", [])) as RoundsVaultExchanger;
    console.log(`    ...deployed to: ${roundsVaultExchanger.address}`);
    return roundsVaultExchanger;
}
