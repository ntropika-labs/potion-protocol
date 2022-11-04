import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Roles, LifecycleStates, toSolidityPercentage } from "hedging-vault-sdk";
import { PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { HedgingVaultEnvironmentDeployment } from "./deployHedgingVaultEnvironment";
import { expectSolidityDeepCompare } from "../../test/utils/chaiHelpers";

export async function verifyHedgingVaultEnvironment(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
) {
    const deployer = (await ethers.getSigners())[0];

    console.log("--------------------------------------------------------------------------------");
    console.log("                            DEPLOYMENT VERIFICATION");
    console.log("--------------------------------------------------------------------------------");

    await verifyInvestmentVault(config, env, deployer);
    await verifyPotionBuyAction(config, env, deployer);
    await verifySwapToUSDCAction(config, env, deployer);
    await verifyRoundsInputVault(config, env, deployer);
    await verifyRoundsOutputVault(config, env, deployer);
    await verifyHedgingVaultOrchestrator(config, env, deployer);
    await verifyRoundsVaultExchanger(config, env, deployer);

    console.log("VERIFICATION COMPLETE");
    console.log("--------------------------------------------------------------------------------");
}

async function verifyInvestmentVault(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    deployer: SignerWithAddress,
) {
    console.log("Verifying InvestmentVault...");

    // Roles
    expect(await env.investmentVault.getRoleMemberCount(Roles.Admin), "InvestmentVault has too many admins").to.equal(
        1,
    );
    expect(
        await env.investmentVault.getRoleMemberCount(Roles.Strategist),
        "InvestmentVault has too many strategists",
    ).to.equal(1);
    expect(
        await env.investmentVault.getRoleMemberCount(Roles.Operator),
        "InvestmentVault has too many operators",
    ).to.equal(1);
    expect(
        await env.investmentVault.getRoleMemberCount(Roles.Investor),
        "InvestmentVault has too many investors",
    ).to.equal(2);
    expect(
        await env.investmentVault.getRoleMemberCount(Roles.Vault),
        "InvestmentVault should have no Vault role configured",
    ).to.equal(0);

    expect(await env.investmentVault.getRoleMember(Roles.Admin, 0), "InvestmentVault has wrong admin").to.equal(
        deployer.address,
    );
    expect(
        await env.investmentVault.getRoleMember(Roles.Strategist, 0),
        "InvestmentVault has wrong strategist",
    ).to.equal(config.strategistAddress || deployer.address);
    expect(await env.investmentVault.getRoleMember(Roles.Operator, 0), "InvestmentVault has wrong operator").to.equal(
        env.hedgingVaultOrchestrator.address,
    );
    expect(await env.investmentVault.getRoleMember(Roles.Investor, 0), "InvestmentVault has wrong investor").to.equal(
        env.roundsInputVault.address,
    );
    expect(await env.investmentVault.getRoleMember(Roles.Investor, 1), "InvestmentVault has wrong investor").to.equal(
        env.roundsOutputVault.address,
    );

    // Underlying asset and cap
    expect(await env.investmentVault.asset(), "InvestmentVault asset is not the underlying").to.equal(
        env.underlyingAsset.address,
    );
    expect(await env.investmentVault.getVaultCap(), "InvestmentVault cap is not correct").to.equal(
        config.underlyingAssetCap || env.underlyingAssetCap,
    );

    // Emergency Lock
    expect(await env.investmentVault.paused(), "InvestmentVault shouldn't not be in paused state").to.equal(false);

    // Lifecycle State
    expect(await env.investmentVault.getLifecycleState(), "InvestmentVault should be unlocked").to.equal(
        LifecycleStates.Unlocked,
    );

    // Refunds Helper
    expect(await env.investmentVault.canRefundETH(), "InvestmentVault should refund ETH").to.equal(true);
    expect(
        await env.investmentVault.canRefund(config.underlyingAsset || env.underlyingAsset.address),
        "InvestmentVault shoud not refund the underlying asset",
    ).to.equal(false);

    // Fee Configuration
    expect(await env.investmentVault.getManagementFee(), "InvestmentVault management fee is wrong").to.equal(
        config.managementFee,
    );
    expect(await env.investmentVault.getPerformanceFee(), "InvestmentVault performance fee is wrong").to.equal(
        config.performanceFee,
    );
    expect(await env.investmentVault.getFeesRecipient(), "InvestmentVault fees recipient is wrong").to.equal(
        config.feesRecipient || env.feesRecipient,
    );

    // Actions
    expect(await env.investmentVault.getActionsLength(), "InvestmentVault number of actions is wrong").to.equal(2);
    expect(await env.investmentVault.getAction(0), "InvestmentVault first action should be Potion Buy").to.equal(
        env.potionBuyAction.address,
    );
    expect(await env.investmentVault.getAction(1), "InvestmentVault second action should be Swap To USDC").to.equal(
        env.swapToUSDCAction.address,
    );

    // Shares name and symbol
    expect(await env.investmentVault.name(), "InvestmentVault shares name is wrong").to.equal(config.sharesName);
    expect(await env.investmentVault.symbol(), "InvestmentVault shares symbol is wrong").to.equal(config.sharesSymbol);

    console.log("   ...DONE");
}

async function verifyPotionBuyAction(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    deployer: SignerWithAddress,
) {
    console.log("Verifying PotionBuyAction...");

    // Roles
    expect(await env.potionBuyAction.getRoleMemberCount(Roles.Admin), "PotionBuyAction has too many admins").to.equal(
        1,
    );
    expect(
        await env.potionBuyAction.getRoleMemberCount(Roles.Operator),
        "PotionBuyAction has too many operators",
    ).to.equal(1);
    expect(
        await env.potionBuyAction.getRoleMemberCount(Roles.Strategist),
        "PotionBuyAction has too many strategists",
    ).to.equal(1);
    expect(await env.potionBuyAction.getRoleMemberCount(Roles.Vault), "PotionBuyAction has too many vaults").to.equal(
        1,
    );
    expect(
        await env.potionBuyAction.getRoleMemberCount(Roles.Investor),
        "PotionBuyAction should have no investors",
    ).to.equal(0);

    expect(await env.potionBuyAction.getRoleMember(Roles.Admin, 0), "PotionBuyAction has wrong admin").to.equal(
        deployer.address,
    );
    expect(await env.potionBuyAction.getRoleMember(Roles.Operator, 0), "PotionBuyAction has wrong operator").to.equal(
        env.hedgingVaultOrchestrator.address,
    );
    expect(
        await env.potionBuyAction.getRoleMember(Roles.Strategist, 0),
        "PotionBuyAction has wrong strategist",
    ).to.equal(config.strategistAddress || env.strategistAddress);
    expect(await env.potionBuyAction.getRoleMember(Roles.Vault, 0), "PotionBuyAction has wrong vault").to.equal(
        env.investmentVault.address,
    );

    // Emergency Lock
    expect(await env.potionBuyAction.paused(), "PotionBuyAction shouldn't not be in paused state").to.equal(false);

    // Lifecycle State
    expect(await env.potionBuyAction.getLifecycleState(), "PotionBuyAction should be in unlocked state").to.equal(
        LifecycleStates.Unlocked,
    );

    // Refunds Helper
    expect(await env.potionBuyAction.canRefundETH(), "PotionBuyAction should refund ETH").to.equal(true);
    expect(
        await env.potionBuyAction.canRefund(config.underlyingAsset || env.underlyingAsset.address),
        "PotionBuyAction should not refund the underlying asset",
    ).to.equal(false);
    expect(
        await env.potionBuyAction.canRefund(config.USDC || env.USDC.address),
        "PotionBuyAction should not refund USDC",
    ).to.equal(false);

    // Uniswap helper
    expect(await env.potionBuyAction.getSwapRouter(), "PotionBuyAction Uniswap Router address is wrong").to.equal(
        config.uniswapV3SwapRouter || env.uniswapV3SwapRouter.address,
    );

    // Potion Protocol helper
    expect(
        await env.potionBuyAction.getPotionLiquidityManager(),
        "PotionBuyAction Potion Liquidity Manager is wrong",
    ).to.equal(config.potionLiquidityPoolManager || env.potionLiquidityPoolManager.address);
    expect(await env.potionBuyAction.getOpynAddressBook(), "PotionBuyAction Opyn Address Book is wrong").to.equal(
        config.opynAddressBook || env.opynAddressBook.address,
    );
    expect(await env.potionBuyAction.getUSDC(), "PotionBuyAction USDC address is wrong").to.equal(
        config.USDC || env.USDC.address,
    );

    // Action Values
    expect(
        await env.potionBuyAction.maxPremiumPercentage(),
        "PotionBuyAction max premium percentage is wrong",
    ).to.equal(config.maxPremiumPercentage || env.maxPremiumPercentage);
    expect(await env.potionBuyAction.premiumSlippage(), "PotionBuyAction premium slippage is wrong").to.equal(
        config.premiumSlippage || env.premiumSlippage,
    );
    expect(await env.potionBuyAction.swapSlippage(), "PotionBuyAction swap slippage is wrong").to.equal(
        config.swapSlippage || env.swapSlippage,
    );
    expect(await env.potionBuyAction.maxSwapDurationSecs(), "PotionBuyAction max swap duration secs is wrong").to.equal(
        config.maxSwapDurationSecs || env.maxSwapDurationSecs,
    );
    expect(await env.potionBuyAction.cycleDurationSecs(), "PotionBuyAction cycle duration secs is wrong").to.equal(
        config.cycleDurationSecs || env.cycleDurationSecs,
    );
    expect(await env.potionBuyAction.hedgingRate(), "PotionBuyAction hedging rate is wrong").to.equal(
        config.hedgingRate || env.hedgingRate,
    );
    expect(await env.potionBuyAction.hedgingRateSlippage(), "PotionBuyAction hedging rate slippage is wrong").to.equal(
        config.hedgingRateSlippage || env.hedgingRateSlippage,
    );

    console.log("   ...DONE");
}

async function verifySwapToUSDCAction(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    deployer: SignerWithAddress,
) {
    console.log("Verifying SwapToUSDCAction...");

    // Roles
    expect(await env.swapToUSDCAction.getRoleMemberCount(Roles.Admin), "SwapToUSDCAction has too many admins").to.equal(
        1,
    );
    expect(
        await env.swapToUSDCAction.getRoleMemberCount(Roles.Operator),
        "SwapToUSDCAction has too many operators",
    ).to.equal(1);
    expect(
        await env.swapToUSDCAction.getRoleMemberCount(Roles.Strategist),
        "SwapToUSDCAction has too many strategists",
    ).to.equal(1);
    expect(await env.swapToUSDCAction.getRoleMemberCount(Roles.Vault), "SwapToUSDCAction has too many vaults").to.equal(
        1,
    );
    expect(
        await env.swapToUSDCAction.getRoleMemberCount(Roles.Investor),
        "SwapToUSDCAction should have no investors",
    ).to.equal(0);

    expect(await env.swapToUSDCAction.getRoleMember(Roles.Admin, 0), "SwapToUSDCAction has wrong admin").to.equal(
        deployer.address,
    );
    expect(await env.swapToUSDCAction.getRoleMember(Roles.Operator, 0), "SwapToUSDCAction has wrong operator").to.equal(
        env.hedgingVaultOrchestrator.address,
    );
    expect(
        await env.swapToUSDCAction.getRoleMember(Roles.Strategist, 0),
        "SwapToUSDCAction has wrong strategist",
    ).to.equal(config.strategistAddress || env.strategistAddress);
    expect(await env.swapToUSDCAction.getRoleMember(Roles.Vault, 0), "SwapToUSDCAction has wrong vault").to.equal(
        env.investmentVault.address,
    );

    // Emergency Lock
    expect(await env.swapToUSDCAction.paused(), "SwapToUSDCAction shouldn't not be in paused state").to.equal(false);

    // Lifecycle State
    expect(await env.swapToUSDCAction.getLifecycleState(), "SwapToUSDCAction should be in unlocked state").to.equal(
        LifecycleStates.Unlocked,
    );

    // Refunds Helper
    expect(await env.swapToUSDCAction.canRefundETH(), "SwapToUSDCAction should refund ETH").to.equal(true);
    expect(
        await env.swapToUSDCAction.canRefund(config.underlyingAsset || env.underlyingAsset.address),
        "SwapToUSDCAction should not refund the underlying asset",
    ).to.equal(false);
    expect(
        await env.swapToUSDCAction.canRefund(config.USDC || env.USDC.address),
        "SwapToUSDCAction should not refund USDC",
    ).to.equal(false);

    // Uniswap helper
    expect(await env.swapToUSDCAction.getSwapRouter(), "SwapToUSDCAction Uniswap Router address is wrong").to.equal(
        config.uniswapV3SwapRouter || env.uniswapV3SwapRouter.address,
    );

    // Action Values
    expect(await env.swapToUSDCAction.swapSlippage(), "SwapToUSDCAction swap slippage is wrong").to.equal(
        config.swapSlippage || env.swapSlippage,
    );
    expect(
        await env.swapToUSDCAction.maxSwapDurationSecs(),
        "SwapToUSDCAction max swap duration secs is wrong",
    ).to.equal(config.maxSwapDurationSecs || env.maxSwapDurationSecs);

    console.log("   ...DONE");
}

async function verifyRoundsInputVault(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    deployer: SignerWithAddress,
) {
    console.log("Verifying RoundsInputVault...");

    // Roles
    expect(await env.roundsInputVault.getRoleMemberCount(Roles.Admin), "RoundsInputVault has too many admins").to.equal(
        1,
    );
    expect(
        await env.roundsInputVault.getRoleMemberCount(Roles.Operator),
        "RoundsInputVault has too many operators",
    ).to.equal(1);
    expect(
        await env.roundsInputVault.getRoleMemberCount(Roles.Strategist),
        "RoundsInputVault should have no strategists",
    ).to.equal(0);
    expect(
        await env.roundsInputVault.getRoleMemberCount(Roles.Vault),
        "RoundsInputVault should have no vaults",
    ).to.equal(0);
    expect(
        await env.roundsInputVault.getRoleMemberCount(Roles.Investor),
        "RoundsInputVault should have no investors",
    ).to.equal(0);

    expect(await env.roundsInputVault.getRoleMember(Roles.Admin, 0), "RoundsInputVault has wrong admin").to.equal(
        deployer.address,
    );
    expect(await env.roundsInputVault.getRoleMember(Roles.Operator, 0), "RoundsInputVault has wrong operator").to.equal(
        env.hedgingVaultOrchestrator.address,
    );

    // Emergency Lock
    expect(await env.roundsInputVault.paused(), "RoundsInputVault shouldn't not be in paused state").to.equal(false);

    // Refunds Helper
    expect(await env.roundsInputVault.canRefundETH(), "RoundsInputVault should refund ETH").to.equal(true);
    expect(
        await env.roundsInputVault.canRefund(env.underlyingAsset.address),
        "RoundsInputVault should not refund the underlying asset",
    ).to.equal(false);
    expect(
        await env.roundsInputVault.canRefund(env.investmentVault.address),
        "RoundsInputVault should not refund investment vault shares",
    ).to.equal(false);

    // ERC-1155 URI
    expect(await env.roundsInputVault.uri(0), "RoundsInputVault URI is not correct").to.equal(
        config.inputReceiptsURI || env.inputReceiptsURI,
    );

    // Assets
    expect(await env.roundsInputVault.asset(), "RoundsInputVault asset should be the underlying asset").to.equal(
        config.underlyingAsset || env.underlyingAsset.address,
    );
    expect(
        await env.roundsInputVault.exchangeAsset(),
        "RoundsInputVault exchange assset should be the investment vault shares",
    ).to.equal(env.investmentVault.address);

    // Rounds Vault
    expect(await env.roundsInputVault.vault(), "RoundsInputVault vault should be the investment vault").to.equal(
        env.investmentVault.address,
    );
    expect(await env.roundsInputVault.getCurrentRound(), "RoundsInputVault current round should be 0").to.equal(0);
    expect(await env.roundsInputVault.getExchangeRate(0), "RoundsInputVault exchange rate should be 0").to.equal(0);

    console.log("   ...DONE");
}

async function verifyRoundsOutputVault(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    deployer: SignerWithAddress,
) {
    console.log("Verifying RoundsOutputVault...");

    // Roles
    expect(
        await env.roundsOutputVault.getRoleMemberCount(Roles.Admin),
        "RoundsOutputVault has too many admins",
    ).to.equal(1);
    expect(
        await env.roundsOutputVault.getRoleMemberCount(Roles.Operator),
        "RoundsOutputVault has too many operators",
    ).to.equal(1);
    expect(
        await env.roundsOutputVault.getRoleMemberCount(Roles.Strategist),
        "RoundsOutputVault should have no strategists",
    ).to.equal(0);
    expect(
        await env.roundsOutputVault.getRoleMemberCount(Roles.Vault),
        "RoundsOutputVault should have no vaults",
    ).to.equal(0);
    expect(
        await env.roundsOutputVault.getRoleMemberCount(Roles.Investor),
        "RoundsOutputVault should have no investors",
    ).to.equal(0);

    expect(await env.roundsOutputVault.getRoleMember(Roles.Admin, 0), "RoundsOutputVault has wrong admin").to.equal(
        deployer.address,
    );
    expect(
        await env.roundsOutputVault.getRoleMember(Roles.Operator, 0),
        "RoundsOutputVault has wrong operator",
    ).to.equal(env.hedgingVaultOrchestrator.address);

    // Emergency Lock
    expect(await env.roundsOutputVault.paused(), "RoundsOutputVault shouldn't not be in paused state").to.equal(false);

    // Refunds Helper
    expect(await env.roundsOutputVault.canRefundETH(), "RoundsOutputVault should refund ETH").to.equal(true);
    expect(
        await env.roundsOutputVault.canRefund(env.underlyingAsset.address),
        "RoundsOutputVault should not refund the underlying asset",
    ).to.equal(false);
    expect(
        await env.roundsOutputVault.canRefund(env.investmentVault.address),
        "RoundsOutputVault should not refund investment vault shares",
    ).to.equal(false);

    // ERC-1155 URI
    expect(await env.roundsOutputVault.uri(0), "RoundsOutputVault URI is not correct").to.equal(
        config.outputReceiptsURI || env.outputReceiptsURI,
    );

    // Assets
    expect(
        await env.roundsOutputVault.asset(),
        "RoundsOutputVault asset should be the investment vault shares",
    ).to.equal(env.investmentVault.address);
    expect(
        await env.roundsOutputVault.exchangeAsset(),
        "RoundsOutputVault exchange assset should be the underlying asset",
    ).to.equal(config.underlyingAsset || env.underlyingAsset.address);

    // Rounds Vault
    expect(await env.roundsOutputVault.vault(), "RoundsOutputVault vault should be the investment vault").to.equal(
        env.investmentVault.address,
    );
    expect(await env.roundsOutputVault.getCurrentRound(), "RoundsOutputVault current round should be 0").to.equal(0);
    expect(await env.roundsOutputVault.getExchangeRate(0), "RoundsOutputVault exchange rate should be 0").to.equal(0);

    console.log("   ...DONE");
}

async function verifyHedgingVaultOrchestrator(
    config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    _deployer: SignerWithAddress,
) {
    console.log("Verifying HedgingVaultOrchestrator...");

    // Owner
    expect(await env.hedgingVaultOrchestrator.owner(), "HedgingVaultOrchestrator has wrong owner").to.equal(
        config.operatorAddress || env.operatorAddress,
    );

    // System Addresses
    expect(
        await env.hedgingVaultOrchestrator.investmentVault(),
        "HedgingVaultOrchestrator has wrong investment vault address",
    ).to.equal(env.investmentVault.address);
    expect(
        await env.hedgingVaultOrchestrator.potionBuyAction(),
        "HedgingVaultOrchestrator has wrong potion buy action address",
    ).to.equal(env.potionBuyAction.address);
    expect(
        await env.hedgingVaultOrchestrator.swapToUSDCAction(),
        "HedgingVaultOrchestrator has wrong swap to USDC action address",
    ).to.equal(env.swapToUSDCAction.address);
    expect(
        await env.hedgingVaultOrchestrator.roundsInputVault(),
        "HedgingVaultOrchestrator has wrong rounds input vault address",
    ).to.equal(env.roundsInputVault.address);
    expect(
        await env.hedgingVaultOrchestrator.roundsOutputVault(),
        "HedgingVaultOrchestrator has wrong rounds output vault address",
    ).to.equal(env.roundsOutputVault.address);

    // Strategies
    const potionBuyStrategy = await env.hedgingVaultOrchestrator.potionBuyStrategy();
    expectSolidityDeepCompare(
        {
            actionsIndexes: [BigNumber.from(0)],
            principalPercentages: [toSolidityPercentage(100)],
        },
        potionBuyStrategy,
    );

    const swapToUSDCStrategy = await env.hedgingVaultOrchestrator.swapToUSDCStrategy();
    expectSolidityDeepCompare(
        {
            actionsIndexes: [BigNumber.from(1)],
            principalPercentages: [toSolidityPercentage(100)],
        },
        swapToUSDCStrategy,
    );

    console.log("   ...DONE");
}

async function verifyRoundsVaultExchanger(
    _config: PotionHedgingVaultConfigParams,
    env: HedgingVaultEnvironmentDeployment,
    _deployer: SignerWithAddress,
) {
    console.log("Verifying RoundsVaultExchanger...");

    expect(env.roundsVaultExchanger.address, "RoundsVaultExchanger address should be defined").to.not.be.undefined;

    console.log("   ...DONE");
}
