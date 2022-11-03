import { BigNumber } from "ethers";
import { InvestmentVault } from "../../typechain";
import { DeploymentFlags, Deployments } from "contracts-utils";

export interface InvestmentVaultDeployParams {
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    underlyingAsset: string;
    underlyingAssetCap: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;
    actions: string[];
    principalPercentages: BigNumber[];
    sharesName: string;
    sharesSymbol: string;
}

export async function deployInvestmentVault(parameters: InvestmentVaultDeployParams): Promise<InvestmentVault> {
    console.log("- Deploying InvestmentVault...");
    const investmentVault = (await Deployments.deploy("InvestmentVault", [parameters], {
        options: DeploymentFlags.Export | DeploymentFlags.Upgradeable | DeploymentFlags.Verify,
    })) as InvestmentVault;
    console.log(`    ...deployed to: ${investmentVault.address}`);
    return investmentVault;
}
