import { InvestmentVaultDeployParams, deployInvestmentVault } from "../common/deployInvestmentVault";
import { PotionBuyActionDeployParams, deployPotionBuyAction } from "../common/deployPotionBuyAction";
import { deployHedgingVaultHelper } from "../common/deployHedgingVaultHelper";
import { HedgingVaultOrchestrator, InvestmentVault, PotionBuyAction } from "../../typechain";
import { BigNumber } from "ethers";
import { Roles } from "hedging-vault-sdk";

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
    hedgingPercentage: BigNumber; // 6 decimals

    // Fees configuration
    managementFee: BigNumber;
    performanceFee: BigNumber;
    feesRecipient: string;

    // Third-party dependencies
    uniswapV3SwapRouter: string;
    potionLiquidityPoolManager: string;
    opynAddressBook: string;
}

function printHedgingVaultDeployParams(deployParams: HedgingVaultDeployParams) {
    console.log(`--------------------------------------`);
    console.log(` HedgingVaultDeployParams Params`);
    console.log(`--------------------------------------`);
    console.log(` adminAddress: ${deployParams.adminAddress}`);
    console.log(` strategistAddress: ${deployParams.strategistAddress}`);
    console.log(` operatorAddress: ${deployParams.operatorAddress}`);
    console.log(` USDC: ${deployParams.USDC}`);
    console.log(` underlyingAsset: ${deployParams.underlyingAsset}`);
    console.log(`--------------------------------------`);
    console.log(` underlyingAssetCap: ${deployParams.underlyingAssetCap}`);
    console.log(` maxPremiumPercentage: ${deployParams.maxPremiumPercentage}`);
    console.log(` premiumSlippage: ${deployParams.premiumSlippage}`);
    console.log(` swapSlippage: ${deployParams.swapSlippage}`);
    console.log(` maxSwapDurationSecs: ${deployParams.maxSwapDurationSecs}`);
    console.log(` cycleDurationSecs: ${deployParams.cycleDurationSecs}`);
    console.log(` strikePercentage: ${deployParams.strikePercentage}`);
    console.log(` hedgingPercentage: ${deployParams.hedgingPercentage}`);
    console.log(`--------------------------------------`);
    console.log(` managementFee: ${deployParams.managementFee}`);
    console.log(` performanceFee: ${deployParams.performanceFee}`);
    console.log(` feesRecipient: ${deployParams.feesRecipient}`);
    console.log(`--------------------------------------`);
    console.log(` uniswapV3SwapRouter: ${deployParams.uniswapV3SwapRouter}`);
    console.log(` potionLiquidityPoolManager: ${deployParams.potionLiquidityPoolManager}`);
    console.log(` opynAddressBook: ${deployParams.opynAddressBook}`);
    console.log(`--------------------------------------\n`);
}

export async function deployHedgingVault(
    parameters: HedgingVaultDeployParams,
): Promise<[InvestmentVault, PotionBuyAction, HedgingVaultOrchestrator]> {
    printHedgingVaultDeployParams(parameters);

    const hedgingVaultOrchestrator = await deployHedgingVaultHelper();

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
    };

    const potionBuyContract: PotionBuyAction = await deployPotionBuyAction(potionBuyParams);

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
        principalPercentages: [parameters.hedgingPercentage],
    };

    const investmentVaultContract: InvestmentVault = await deployInvestmentVault(investmentVaultParams);

    // Set the vault as the managing vault for the action
    console.log(`- Setting ${investmentVaultContract.address} as the managing vault for ${potionBuyContract.address}`);
    let tx = await potionBuyContract.grantRole(Roles.Vault, investmentVaultContract.address);
    await tx.wait();

    // Set the vault and action addresses in the orchestrator
    console.log(
        `- Setting vault=${investmentVaultContract.address} and action=${potionBuyContract.address} in the orchestrator (${hedgingVaultOrchestrator.address})`,
    );
    tx = await hedgingVaultOrchestrator.setSystemAddresses(investmentVaultContract.address, potionBuyContract.address);
    await tx.wait();

    console.log(
        `- Setting ${parameters.operatorAddress} as the operator for the orchestrator (${hedgingVaultOrchestrator.address})`,
    );
    tx = await hedgingVaultOrchestrator.transferOwnership(parameters.operatorAddress);
    await tx.wait();

    return [investmentVaultContract, potionBuyContract, hedgingVaultOrchestrator];
}
