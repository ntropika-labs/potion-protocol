import { InvestmentVaultDeployParams, deployInvestmentVault } from "../common/deployInvestmentVault";
import { PotionBuyActionDeployParams, deployPotionBuyAction } from "../common/deployPotionBuyAction";
import { deployHedgingVaultOrchestrator } from "../common/deployHedgingVaultOrchestrator";
import {
    HedgingVaultOrchestrator,
    InvestmentVault,
    PotionBuyAction,
    RoundsInputVault,
    RoundsOutputVault,
    RoundsVaultExchanger,
} from "../../typechain";
import { BigNumber } from "ethers";
import { PERCENTAGE_100_BN, Roles, fromSolidityPercentage } from "hedging-vault-sdk";
import { deployRoundsInputVault, RoundsInputVaultDeployParams } from "../common/deployRoundsInputVault";
import { deployRoundsOutputVault } from "../common/deployRoundsOutputVault";
import { deployRoundsVaultExchanger } from "../common/deployRoundsVaultExchanger";

export interface HedgingVaultDeployParams {
    // Roles
    adminAddress: string;
    strategistAddress: string;
    operatorAddress: string;

    // Assets addresses
    USDC: string;
    underlyingAsset: string;

    // Investment configuration
    underlyingAssetCap: BigNumber;
    maxPremiumPercentage: BigNumber; // 6 decimals
    premiumSlippage: BigNumber; // 6 decimals
    swapSlippage: BigNumber; // 6 decimals
    maxSwapDurationSecs: BigNumber;
    cycleDurationSecs: BigNumber;
    strikePercentage: BigNumber; // 6 decimals
    hedgingRate: BigNumber; // 6 decimals
    hedgingRateSlippage: BigNumber; // 6 decimals

    // Fees configuration
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;

    // Deposits and withdrawals receipts URI
    inputReceiptsURI: string;
    outputReceiptsURI: string;

    // Third-party dependencies
    uniswapV3SwapRouter: string;
    potionLiquidityPoolManager: string;
    opynAddressBook: string;
}

export interface HedgingVaultDeploymentResult {
    vault: InvestmentVault;
    potionBuyAction: PotionBuyAction;
    orchestrator: HedgingVaultOrchestrator;
    roundsInputVault: RoundsInputVault;
    roundsOutputVault: RoundsOutputVault;
    roundsVaultExchanger: RoundsVaultExchanger;
}

export function printHedgingVaultDeployParams(deployParams: HedgingVaultDeployParams) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`                                DEPLOY CONFIG`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(` adminAddress: ${deployParams.adminAddress}`);
    console.log(` strategistAddress: ${deployParams.strategistAddress}`);
    console.log(` operatorAddress: ${deployParams.operatorAddress}`);
    console.log(` USDC: ${deployParams.USDC}`);
    console.log(` underlyingAsset: ${deployParams.underlyingAsset}`);
    console.log(`--------------------------------------`);
    console.log(` underlyingAssetCap: ${deployParams.underlyingAssetCap}`);
    console.log(
        ` maxPremiumPercentage: ${deployParams.maxPremiumPercentage.toString()} (${fromSolidityPercentage(
            deployParams.maxPremiumPercentage,
        )})`,
    );
    console.log(
        ` premiumSlippage: ${deployParams.premiumSlippage} (${fromSolidityPercentage(deployParams.premiumSlippage)})`,
    );
    console.log(` swapSlippage: ${deployParams.swapSlippage} (${fromSolidityPercentage(deployParams.swapSlippage)})`);
    console.log(` maxSwapDurationSecs: ${deployParams.maxSwapDurationSecs}`);
    console.log(` cycleDurationSecs: ${deployParams.cycleDurationSecs}`);
    console.log(
        ` strikePercentage: ${deployParams.strikePercentage} (${fromSolidityPercentage(
            deployParams.strikePercentage,
        )})`,
    );
    console.log(` hedgingRate: ${deployParams.hedgingRate} (${fromSolidityPercentage(deployParams.hedgingRate)})`);
    console.log(
        ` hedgingRateSlippage: ${deployParams.hedgingRateSlippage} (${fromSolidityPercentage(
            deployParams.hedgingRateSlippage,
        )})`,
    );
    console.log(`--------------------------------------`);
    console.log(` managementFee: ${deployParams.managementFee}`);
    console.log(` performanceFee: ${deployParams.performanceFee}`);
    console.log(` feesRecipient: ${deployParams.feesRecipient}`);
    console.log(`--------------------------------------`);
    console.log(` inputReceiptsURI: ${deployParams.inputReceiptsURI}`);
    console.log(` outputReceiptsURI: ${deployParams.outputReceiptsURI}`);
    console.log(`--------------------------------------`);
    console.log(` uniswapV3SwapRouter: ${deployParams.uniswapV3SwapRouter}`);
    console.log(` potionLiquidityPoolManager: ${deployParams.potionLiquidityPoolManager}`);
    console.log(` opynAddressBook: ${deployParams.opynAddressBook}`);
    console.log(`--------------------------------------------------------------------------------\n`);
}

async function deployContracts(parameters: HedgingVaultDeployParams): Promise<HedgingVaultDeploymentResult> {
    /* Orchestrator */
    const hedgingVaultOrchestrator = await deployHedgingVaultOrchestrator();

    /* Potion Buy Action */
    const potionBuyParams: PotionBuyActionDeployParams = {
        adminAddress: parameters.adminAddress,
        strategistAddress: parameters.strategistAddress,
        operatorAddress: hedgingVaultOrchestrator.address,
        investmentAsset: parameters.underlyingAsset,
        USDC: parameters.USDC,
        uniswapV3SwapRouter: parameters.uniswapV3SwapRouter,
        opynAddressBook: parameters.opynAddressBook,
        potionLiquidityPoolManager: parameters.potionLiquidityPoolManager,
        maxPremiumPercentage: parameters.maxPremiumPercentage,
        premiumSlippage: parameters.premiumSlippage,
        swapSlippage: parameters.swapSlippage,
        maxSwapDurationSecs: parameters.maxSwapDurationSecs,
        cycleDurationSecs: parameters.cycleDurationSecs,
        strikePercentage: parameters.strikePercentage,
        hedgingRate: parameters.hedgingRate,
        hedgingRateSlippage: parameters.hedgingRateSlippage,
    };

    const potionBuyContract: PotionBuyAction = await deployPotionBuyAction(potionBuyParams);

    /* Investment Vault */
    const investmentVaultParams: InvestmentVaultDeployParams = {
        adminAddress: parameters.adminAddress,
        strategistAddress: parameters.strategistAddress,
        operatorAddress: hedgingVaultOrchestrator.address,
        underlyingAsset: parameters.underlyingAsset,
        underlyingAssetCap: parameters.underlyingAssetCap,
        managementFee: parameters.managementFee,
        performanceFee: parameters.performanceFee,
        feesRecipient: parameters.feesRecipient,
        actions: [potionBuyContract.address],
        principalPercentages: [PERCENTAGE_100_BN],
    };

    const investmentVaultContract: InvestmentVault = await deployInvestmentVault(investmentVaultParams);

    /* Rounds Input Vault */
    const roundsInputVaultParams: RoundsInputVaultDeployParams = {
        adminAddress: parameters.adminAddress,
        operatorAddress: hedgingVaultOrchestrator.address,
        investmentVault: investmentVaultContract.address,
        receiptsURI: parameters.inputReceiptsURI,
    };

    const roundsInputVaultContract: RoundsInputVault = await deployRoundsInputVault(roundsInputVaultParams);

    /* Rounds Output Vault */
    const roundsOutputVaultParams: RoundsInputVaultDeployParams = {
        adminAddress: parameters.adminAddress,
        operatorAddress: hedgingVaultOrchestrator.address,
        investmentVault: investmentVaultContract.address,
        receiptsURI: parameters.outputReceiptsURI,
    };

    const roundsOutputVaultContract: RoundsOutputVault = await deployRoundsOutputVault(roundsOutputVaultParams);

    /* Rounds Vault Exchanger */
    const roundsVaultExchanger: RoundsVaultExchanger = await deployRoundsVaultExchanger();

    return {
        vault: investmentVaultContract,
        potionBuyAction: potionBuyContract,
        orchestrator: hedgingVaultOrchestrator,
        roundsInputVault: roundsInputVaultContract,
        roundsOutputVault: roundsOutputVaultContract,
        roundsVaultExchanger: roundsVaultExchanger,
    };
}

async function configureContracts(parameters: HedgingVaultDeployParams, deployment: HedgingVaultDeploymentResult) {
    /* InvestmentVault has the Vault Role for the Potion Buy Action */

    console.log(
        `- Setting ${deployment.vault.address} as the managing vault for ${deployment.potionBuyAction.address}`,
    );
    let tx = await deployment.potionBuyAction.grantRole(Roles.Vault, deployment.vault.address);
    await tx.wait();

    /* Configure the Investment Vault and the Potion Buy Action in the Orchestrator */
    console.log(
        `- Setting vault=${deployment.vault.address} and action=${deployment.potionBuyAction.address} in the orchestrator (${deployment.orchestrator.address})`,
    );
    tx = await deployment.orchestrator.setSystemAddresses(
        deployment.vault.address,
        deployment.potionBuyAction.address,
        deployment.roundsInputVault.address,
        deployment.roundsOutputVault.address,
    );
    await tx.wait();

    /* Set the Rounds Input Vault as Investor of the Investment Vault */
    console.log(`- Setting ${deployment.roundsInputVault.address} as the investor of ${deployment.vault.address}`);
    tx = await deployment.vault.grantRole(Roles.Investor, deployment.roundsInputVault.address);
    await tx.wait();

    /* Set the Rounds Output Vault as Investor of the Investment Vault */
    console.log(`- Setting ${deployment.roundsOutputVault.address} as the investor of ${deployment.vault.address}`);
    tx = await deployment.vault.grantRole(Roles.Investor, deployment.roundsOutputVault.address);
    await tx.wait();

    /* Configure the Operator as the Owner of the Orchestrator */
    console.log(
        `- Setting ${parameters.operatorAddress} as the operator for the orchestrator (${deployment.orchestrator.address})`,
    );
    tx = await deployment.orchestrator.transferOwnership(parameters.operatorAddress);
    await tx.wait();
}

export async function deployHedgingVault(parameters: HedgingVaultDeployParams): Promise<HedgingVaultDeploymentResult> {
    const deploymentResult: HedgingVaultDeploymentResult = await deployContracts(parameters);

    await configureContracts(parameters, deploymentResult);

    // TODO: verify deployment

    return deploymentResult;
}
