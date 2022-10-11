import { RoundsInputVault } from "../../typechain";
import { DeploymentFlags, Deployments } from "contracts-utils";

export interface RoundsInputVaultDeployParams {
    adminAddress: string;
    operatorAddress: string;
    investmentVault: string;
    receiptsURI: string;
}

export async function deployRoundsInputVault(parameters: RoundsInputVaultDeployParams): Promise<RoundsInputVault> {
    console.log("- Deploying RoundsInputVault...");
    const roundsInputVault = (await Deployments.deploy(
        "RoundsInputVault",
        [parameters.adminAddress, parameters.operatorAddress, parameters.investmentVault, parameters.receiptsURI],
        {
            options: DeploymentFlags.Export | DeploymentFlags.Upgradeable | DeploymentFlags.Verify,
        },
    )) as RoundsInputVault;
    console.log(`    ...deployed to: ${roundsInputVault.address}`);
    return roundsInputVault;
}
