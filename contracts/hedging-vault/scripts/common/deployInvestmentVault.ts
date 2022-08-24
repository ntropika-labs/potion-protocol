import { BigNumber } from "ethers";
import { InvestmentVault } from "../../typechain";
import { deployUpgrade } from "../utils/deployment";

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
}

export async function deployInvestmentVault(parameters: InvestmentVaultDeployParams): Promise<InvestmentVault> {
    console.log("- Deploying InvestmentVault...");
    const investmentVault = (await deployUpgrade("InvestmentVault", [
        parameters.adminAddress,
        parameters.strategistAddress,
        parameters.operatorAddress,
        parameters.underlyingAsset,
        parameters.underlyingAssetCap,
        parameters.managementFee,
        parameters.performanceFee,
        parameters.feesRecipient,
        parameters.actions,
        parameters.principalPercentages,
    ])) as InvestmentVault;
    console.log(`    ...deployed to: ${investmentVault.address}`);
    return investmentVault;
}
