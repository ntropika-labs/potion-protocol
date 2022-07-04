import { InvestmentVault } from "../../typechain";
import { deployUpgrade } from "../utils/deployment";

export interface InvestmentVaultDeployParams {
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;
    underlyingAsset: string;
    managementFee: number;
    performanceFee: number;
    feesRecipient: string;
    actions: string[];
}

export async function deployInvestmentVault(parameters: InvestmentVaultDeployParams): Promise<InvestmentVault> {
    return (await deployUpgrade("InvestmentVault", [
        parameters.adminAddress,
        parameters.strategistAddress,
        parameters.operatorAddress,
        parameters.underlyingAsset,
        parameters.managementFee,
        parameters.performanceFee,
        parameters.feesRecipient,
        parameters.actions,
    ])) as InvestmentVault;
}
