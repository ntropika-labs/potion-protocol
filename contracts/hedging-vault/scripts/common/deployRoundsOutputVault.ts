import { RoundsOutputVault } from "../../typechain";
import { DeploymentFlags, Deployments } from "contracts-utils";

export interface RoundsOutputVaultDeployParams {
    adminAddress: string;
    operatorAddress: string;
    investmentVault: string;
    receiptsURI: string;
}

export async function deployRoundsOutputVault(parameters: RoundsOutputVaultDeployParams): Promise<RoundsOutputVault> {
    console.log("- Deploying RoundsOutputVault...");
    const roundsOutputVault = (await Deployments.deploy(
        "RoundsOutputVault",
        [parameters.adminAddress, parameters.operatorAddress, parameters.investmentVault, parameters.receiptsURI],
        {
            options: DeploymentFlags.Export | DeploymentFlags.Upgradeable,
        },
    )) as RoundsOutputVault;
    console.log(`    ...deployed to: ${roundsOutputVault.address}`);
    return roundsOutputVault;
}
