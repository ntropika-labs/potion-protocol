import { RoundsVaultExchanger } from "../../typechain";
import { deploy } from "../utils/deployment";

export async function deployRoundsVaultExchanger(): Promise<RoundsVaultExchanger> {
    console.log("- Deploying RoundsVaultExchanger...");
    const roundsVaultExchanger = (await deploy("RoundsVaultExchanger", [])) as RoundsVaultExchanger;
    console.log(`    ...deployed to: ${roundsVaultExchanger.address}`);
    return roundsVaultExchanger;
}
