import { RoundsInputVault } from "../../typechain";
import { deployUpgrade } from "contracts-utils";

export interface RoundsInputVaultDeployParams {
    adminAddress: string;
    operatorAddress: string;
    investmentVault: string;
    receiptsURI: string;
}

export async function deployRoundsInputVault(parameters: RoundsInputVaultDeployParams): Promise<RoundsInputVault> {
    console.log("- Deploying RoundsInputVault...");
    const roundsInputVault = (await deployUpgrade("RoundsInputVault", [
        parameters.adminAddress,
        parameters.operatorAddress,
        parameters.investmentVault,
        parameters.receiptsURI,
    ])) as RoundsInputVault;
    console.log(`    ...deployed to: ${roundsInputVault.address}`);
    return roundsInputVault;
}
