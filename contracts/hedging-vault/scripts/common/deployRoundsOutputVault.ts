import { RoundsOutputVault } from "../../typechain";
import { deployUpgrade } from "../utils/deployment";

export interface RoundsOutputVaultDeployParams {
    adminAddress: string;
    operatorAddress: string;
    investmentVault: string;
    receiptsURI: string;
}

export async function deployRoundsOutputVault(parameters: RoundsOutputVaultDeployParams): Promise<RoundsOutputVault> {
    console.log("- Deploying RoundsOutputVault...");
    const roundsOutputVault = (await deployUpgrade("RoundsOutputVault", [
        parameters.adminAddress,
        parameters.operatorAddress,
        parameters.investmentVault,
        parameters.receiptsURI,
    ])) as RoundsOutputVault;
    console.log(`    ...deployed to: ${roundsOutputVault.address}`);
    return roundsOutputVault;
}
