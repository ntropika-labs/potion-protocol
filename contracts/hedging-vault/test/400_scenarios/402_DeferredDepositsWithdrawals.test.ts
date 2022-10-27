import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/testingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";

import {
    InvestmentVault,
    PotionBuyAction,
    RoundsInputVault,
    RoundsOutputVault,
    HedgingVaultOrchestrator,
    RoundsVaultExchanger,
    SwapToUSDCAction,
} from "../../typechain";
import { fastForwardChain } from "contracts-utils";
import { expectSolidityDeepCompare } from "../utils/chaiHelpers";
import { Roles, LifecycleStates } from "hedging-vault-sdk";

import {
    Deployments,
    showConsoleLogs,
    ProviderTypes,
    DeploymentNetwork,
    DeploymentFlags,
    DAY_IN_SECONDS,
} from "contracts-utils";
import { setupTestConditions, getPotionBuyInfo } from "../../scripts/test/simulationUtils";

/**
    @notice Hedging Vault deferred deposits and withdrawals tests
    
    @author Roberto Cano <robercano>
 */
describe("DeferredDepositsWithdrawals", function () {
    // let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let potionBuy: PotionBuyAction;
    let swapUSDC: SwapToUSDCAction;
    let roundsInputVault: RoundsInputVault;
    let roundsOutputVault: RoundsOutputVault;
    let orchestrator: HedgingVaultOrchestrator;
    let roundsExchanger: RoundsVaultExchanger;
    let tEnv: TestingEnvironmentDeployment;

    before(function () {
        showConsoleLogs(false);
        Deployments.initialize({
            type: {
                provider: network.name === "localhost" ? ProviderTypes.Hardhat : ProviderTypes.Internal,
                network: DeploymentNetwork.Develop,
                config: "test",
            },
            options: DeploymentFlags.None,
        });
    });

    beforeEach(async function () {
        // ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        const deploymentType = Deployments.getType();
        deploymentConfig = getDeploymentConfig(deploymentType);

        tEnv = await deployTestingEnv(deploymentConfig);

        // Commented out on purpose
        // printTestingEnv(tEnv);

        vault = tEnv.investmentVault;
        potionBuy = tEnv.potionBuyAction;
        swapUSDC = tEnv.swapToUSDCAction;
        roundsInputVault = tEnv.roundsInputVault;
        roundsOutputVault = tEnv.roundsOutputVault;
        orchestrator = tEnv.hedgingVaultOrchestrator;
        roundsExchanger = tEnv.roundsVaultExchanger;
    });

    it("DDW0001 - Investment Vault Default Value", async function () {
        // Roles
        expect(await vault.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await vault.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await vault.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await vault.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await vault.getRoleMemberCount(Roles.Strategist)).to.equal(1);
        expect(await vault.getRoleMember(Roles.Strategist, 0)).to.equal(tEnv.strategistAddress);

        expect(await vault.getRoleMemberCount(Roles.Investor)).to.equal(2);
        expect(await vault.getRoleMember(Roles.Investor, 0)).to.equal(tEnv.roundsInputVault.address);
        expect(await vault.getRoleMember(Roles.Investor, 1)).to.equal(tEnv.roundsOutputVault.address);

        expect(await vault.getRoleMemberCount(Roles.Vault)).to.equal(0);

        // Underlying asset and cap
        expect(await vault.asset()).to.equal(tEnv.underlyingAsset.address);
        expect(await vault.getVaultCap()).to.equal(tEnv.underlyingAssetCap);

        // Emergency Lock
        expect(await vault.paused()).to.equal(false);

        // Lifecycle State
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Refunds Helper
        expect(await vault.canRefundETH()).to.equal(true);
        expect(await vault.canRefund(tEnv.underlyingAsset.address)).to.equal(false);

        // Fee Configuration
        expect(await vault.getManagementFee()).to.equal(tEnv.managementFee);
        expect(await vault.getPerformanceFee()).to.equal(tEnv.performanceFee);
        expect(await vault.getFeesRecipient()).to.equal(tEnv.feesRecipient);

        // Actions
        expect(await vault.getActionsLength()).to.equal(2);
        expect(await vault.getAction(0)).to.equal(potionBuy.address);
        expect(await vault.getAction(1)).to.equal(swapUSDC.address);
    });

    it("DDW0002 - Potion Buy Action Default Value", async function () {
        // Roles
        expect(await potionBuy.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await potionBuy.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await potionBuy.getRoleMemberCount(Roles.Strategist)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Strategist, 0)).to.equal(tEnv.strategistAddress);
        expect(await potionBuy.getRoleMemberCount(Roles.Vault)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Vault, 0)).to.equal(tEnv.investmentVault.address);

        expect(await potionBuy.getRoleMemberCount(Roles.Investor)).to.equal(0);

        // Emergency Lock
        expect(await potionBuy.paused()).to.equal(false);

        // Lifecycle State
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Refunds Helper
        expect(await potionBuy.canRefundETH()).to.equal(true);
        expect(await potionBuy.canRefund(tEnv.underlyingAsset.address)).to.equal(false);
        expect(await potionBuy.canRefund(tEnv.USDC.address)).to.equal(false);

        // Uniswap helper
        expect(await potionBuy.getSwapRouter()).to.equal(tEnv.uniswapV3SwapRouter.address);

        // Potion Protocol helper
        expect(await potionBuy.getPotionLiquidityManager()).to.equal(tEnv.potionLiquidityPoolManager.address);
        expect(await potionBuy.getOpynAddressBook()).to.equal(tEnv.opynAddressBook.address);
        expect(await potionBuy.getUSDC()).to.equal(tEnv.USDC.address);

        // Action Values
        expect(await potionBuy.maxPremiumPercentage()).to.equal(tEnv.maxPremiumPercentage);
        expect(await potionBuy.premiumSlippage()).to.equal(tEnv.premiumSlippage);
        expect(await potionBuy.swapSlippage()).to.equal(tEnv.swapSlippage);
        expect(await potionBuy.maxSwapDurationSecs()).to.equal(tEnv.maxSwapDurationSecs);
        expect(await potionBuy.cycleDurationSecs()).to.equal(tEnv.cycleDurationSecs);
        expect(await potionBuy.hedgingRate()).to.equal(tEnv.hedgingRate);
        expect(await potionBuy.hedgingRateSlippage()).to.equal(tEnv.hedgingRateSlippage);
    });

    it("DDW0003 - Rounds Input Vault Default Value", async function () {
        // Roles
        expect(await roundsInputVault.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await roundsInputVault.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await roundsInputVault.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await roundsInputVault.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await roundsInputVault.getRoleMemberCount(Roles.Strategist)).to.equal(0);
        expect(await roundsInputVault.getRoleMemberCount(Roles.Vault)).to.equal(0);
        expect(await potionBuy.getRoleMemberCount(Roles.Investor)).to.equal(0);

        // Emergency Lock
        expect(await roundsInputVault.paused()).to.equal(false);

        // Refunds Helper
        expect(await roundsInputVault.canRefundETH()).to.equal(true);
        expect(await roundsInputVault.canRefund(tEnv.underlyingAsset.address)).to.equal(false);
        expect(await roundsInputVault.canRefund(tEnv.investmentVault.address)).to.equal(false);

        // ERC-1155 URI
        expect(await roundsInputVault.uri(0)).to.equal(tEnv.inputReceiptsURI);

        // Assets
        expect(await roundsInputVault.asset()).to.equal(tEnv.underlyingAsset.address);
        expect(await roundsInputVault.exchangeAsset()).to.equal(tEnv.investmentVault.address);

        // Rounds Vault
        expect(await roundsInputVault.vault()).to.equal(tEnv.investmentVault.address);
        expect(await roundsInputVault.getCurrentRound()).to.equal(0);
        expect(await roundsInputVault.getExchangeRate(0)).to.equal(0);
    });

    it("DDW0004 - Rounds Output Vault Default Value", async function () {
        // Roles
        expect(await roundsOutputVault.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await roundsOutputVault.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await roundsOutputVault.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await roundsOutputVault.getRoleMember(Roles.Operator, 0)).to.equal(
            tEnv.hedgingVaultOrchestrator.address,
        );
        expect(await roundsOutputVault.getRoleMemberCount(Roles.Strategist)).to.equal(0);
        expect(await roundsOutputVault.getRoleMemberCount(Roles.Vault)).to.equal(0);
        expect(await roundsOutputVault.getRoleMemberCount(Roles.Investor)).to.equal(0);

        // Emergency Lock
        expect(await roundsOutputVault.paused()).to.equal(false);

        // Refunds Helper
        expect(await roundsOutputVault.canRefundETH()).to.equal(true);
        expect(await roundsOutputVault.canRefund(tEnv.underlyingAsset.address)).to.equal(false);
        expect(await roundsOutputVault.canRefund(tEnv.investmentVault.address)).to.equal(false);

        // ERC-1155 URI
        expect(await roundsOutputVault.uri(0)).to.equal(tEnv.outputReceiptsURI);

        // Assets
        expect(await roundsOutputVault.asset()).to.equal(tEnv.investmentVault.address);
        expect(await roundsOutputVault.exchangeAsset()).to.equal(tEnv.underlyingAsset.address);

        // Rounds Vault
        expect(await roundsOutputVault.vault()).to.equal(tEnv.investmentVault.address);
        expect(await roundsOutputVault.getCurrentRound()).to.equal(0);
        expect(await roundsOutputVault.getExchangeRate(0)).to.equal(0);
    });

    it("DDW0005 - Orchestrator Default Value", async function () {
        // System Addresses
        expect(await orchestrator.investmentVault()).to.equal(tEnv.investmentVault.address);
        expect(await orchestrator.potionBuyAction()).to.equal(tEnv.potionBuyAction.address);
        expect(await orchestrator.swapToUSDCAction()).to.equal(tEnv.swapToUSDCAction.address);
        expect(await orchestrator.roundsInputVault()).to.equal(tEnv.roundsInputVault.address);
        expect(await orchestrator.roundsOutputVault()).to.equal(tEnv.roundsOutputVault.address);
    });

    it("DDW0006 - Simple Deposit", async function () {
        // Test Settings
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8); // 1000 USDC with 8 decimals
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8); // 1 USDC with 8 decimals
        const amountToBeInvested = ethers.utils.parseEther("20");

        const tCond = await setupTestConditions(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD, amountToBeInvested);

        let currentRound = await tEnv.roundsInputVault.getCurrentRound();

        /*
            MINT
        */
        const prevBalance = await tEnv.underlyingAsset.balanceOf(investorAccount.address);
        await tEnv.underlyingAsset.mint(investorAccount.address, amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(
            prevBalance.add(amountToBeInvested),
        );
        await tEnv.underlyingAsset.connect(investorAccount).approve(roundsInputVault.address, amountToBeInvested);
        expect(
            await tEnv.underlyingAsset
                .connect(investorAccount)
                .allowance(investorAccount.address, roundsInputVault.address),
        ).to.equal(amountToBeInvested);

        /*
            DEPOSIT
        */
        await roundsInputVault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);

        expect(await roundsInputVault.balanceOf(investorAccount.address, currentRound)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        /*
            ENTER POSITION
        */

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);
        const tx = await orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            tCond.potionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        //const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the potionBuy
        const currentPotionBuyInfo = await potionBuy.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        const currentSwapInfo = await potionBuy.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.potionBuySwapEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the potionBuy
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(
            amountToBeInvested.sub(tCond.uniswapEnterPositionInputAmount),
        );

        // Rounds Input Vault
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(0);
        expect(await vault.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);

        currentRound = await tEnv.roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);
    });

    it("DDW0007 - Single Cycle", async function () {
        // Test Settings
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8); // 1000 USDC with 8 decimals
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8); // 1 USDC with 8 decimals
        const amountToBeInvested = ethers.utils.parseEther("20");

        const tCond = await setupTestConditions(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD, amountToBeInvested);

        let currentRound = await tEnv.roundsInputVault.getCurrentRound();

        /*
            MINT
        */
        const prevBalance = await tEnv.underlyingAsset.balanceOf(investorAccount.address);
        await tEnv.underlyingAsset.mint(investorAccount.address, amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(
            prevBalance.add(amountToBeInvested),
        );
        await tEnv.underlyingAsset.connect(investorAccount).approve(roundsInputVault.address, amountToBeInvested);
        expect(
            await tEnv.underlyingAsset
                .connect(investorAccount)
                .allowance(investorAccount.address, roundsInputVault.address),
        ).to.equal(amountToBeInvested);

        /*
            DEPOSIT ASSETS
        */
        let tx = await roundsInputVault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);
        expect(tx)
            .to.emit(roundsInputVault, "DepositWithReceipt")
            .withArgs(investorAccount.address, investorAccount.address, currentRound, amountToBeInvested);

        expect(await roundsInputVault.balanceOf(investorAccount.address, currentRound)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        /*
            ENTER POSITION
        */

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);
        tx = await orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            tCond.potionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        //const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the potionBuy
        const currentPotionBuyInfo = await potionBuy.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        const currentSwapInfo = await potionBuy.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.potionBuySwapEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the potionBuy
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(
            amountToBeInvested.sub(tCond.uniswapEnterPositionInputAmount),
        );

        // Rounds Input Vault
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(0);
        expect(await vault.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);

        currentRound = await tEnv.roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        /*
            REQUEST SHARES
        */
        let previousRound = currentRound.sub(1);
        tx = await roundsInputVault
            .connect(investorAccount)
            .redeemExchangeAsset(previousRound, amountToBeInvested, investorAccount.address, investorAccount.address);
        expect(tx)
            .to.emit(roundsInputVault, "WithdrawExchangeAsset")
            .withArgs(
                investorAccount.address,
                investorAccount.address,
                investorAccount.address,
                amountToBeInvested,
                previousRound,
                amountToBeInvested,
            );
        expect(await vault.balanceOf(roundsInputVault.address)).to.equal(0);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(amountToBeInvested);
        expect(await roundsInputVault.balanceOf(investorAccount.address, previousRound)).to.equal(0);
        expect(await roundsInputVault.balanceOfAll(investorAccount.address)).to.equal(0);

        /*
            DEPOSIT SHARES
        */
        await vault.connect(investorAccount).approve(roundsOutputVault.address, amountToBeInvested);
        tx = await roundsOutputVault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);

        expect(tx)
            .to.emit(roundsOutputVault, "DepositWithReceipt")
            .withArgs(investorAccount.address, investorAccount.address, currentRound, amountToBeInvested);

        expect(await roundsOutputVault.balanceOf(investorAccount.address, currentRound)).to.equal(amountToBeInvested);
        expect(await vault.balanceOf(roundsOutputVault.address)).to.equal(amountToBeInvested);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(0);

        /*
            POTION SETTLEMENT
        */
        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, tCond.underlyingAssetExitPriceInUSD);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, tCond.expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, tCond.expirationTimestamp, true);

        /*
            NEXT ROUND
        */
        await fastForwardChain(DAY_IN_SECONDS);

        const { potionBuyInfo: nextPotionBuyInfo } = await getPotionBuyInfo(
            tEnv,
            BigNumber.from(0),
            underlyingAssetPriceInUSD,
            USDCPriceInUSD,
        );

        tx = await orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            nextPotionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        const amountAfterProfitLoss = amountToBeInvested
            .sub(tCond.uniswapEnterPositionInputAmount)
            .add(tCond.uniswapExitPositionOutputAmount);
        currentRound = await tEnv.roundsOutputVault.getCurrentRound();
        previousRound = currentRound.sub(1);

        expect(await roundsOutputVault.balanceOf(investorAccount.address, previousRound)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(roundsOutputVault.address)).to.equal(amountAfterProfitLoss);
        expect(await vault.balanceOf(roundsOutputVault.address)).to.equal(0);

        /*
            WITHDRAW ASSETS
        */
        tx = await roundsOutputVault
            .connect(investorAccount)
            .redeemExchangeAsset(previousRound, amountToBeInvested, investorAccount.address, investorAccount.address);

        expect(tx)
            .to.emit(roundsOutputVault, "WithdrawExchangeAsset")
            .withArgs(
                investorAccount.address,
                investorAccount.address,
                investorAccount.address,
                amountAfterProfitLoss,
                previousRound,
                amountToBeInvested,
            );

        expect(await tEnv.underlyingAsset.balanceOf(roundsOutputVault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(amountAfterProfitLoss);
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(investorAccount.address, previousRound)).to.equal(0);
        expect(await roundsOutputVault.balanceOfAll(investorAccount.address)).to.equal(0);

        expect(await vault.totalSupply()).to.equal(0);
        expect(await vault.totalAssets()).to.equal(0);
    });

    it("DDW0008 - Single Cycle With Rounds Exchanger", async function () {
        // Test Settings
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8); // 1000 USDC with 8 decimals
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8); // 1 USDC with 8 decimals
        const amountToBeInvested = ethers.utils.parseEther("20");

        const tCond = await setupTestConditions(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD, amountToBeInvested);

        let currentRound = await tEnv.roundsInputVault.getCurrentRound();

        /*
            MINT
        */
        const prevBalance = await tEnv.underlyingAsset.balanceOf(investorAccount.address);
        await tEnv.underlyingAsset.mint(investorAccount.address, amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(
            prevBalance.add(amountToBeInvested),
        );
        await tEnv.underlyingAsset.connect(investorAccount).approve(roundsInputVault.address, amountToBeInvested);
        expect(
            await tEnv.underlyingAsset
                .connect(investorAccount)
                .allowance(investorAccount.address, roundsInputVault.address),
        ).to.equal(amountToBeInvested);

        /*
            DEPOSIT ASSETS
        */
        let tx = await roundsInputVault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);
        expect(tx)
            .to.emit(roundsInputVault, "DepositWithReceipt")
            .withArgs(investorAccount.address, investorAccount.address, currentRound, amountToBeInvested);

        expect(await roundsInputVault.balanceOf(investorAccount.address, currentRound)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        /*
            ENTER POSITION
        */

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);
        tx = await orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            tCond.potionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        // Check that the helper set the correct info in the potionBuy
        const currentPotionBuyInfo = await potionBuy.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        const currentSwapInfo = await potionBuy.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.potionBuySwapEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // Check balances
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(
            amountToBeInvested.sub(tCond.uniswapEnterPositionInputAmount),
        );

        // Rounds Input Vault
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(0);
        expect(await vault.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);

        currentRound = await tEnv.roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        /*
            EXCHANGE INPUT RECEIPT FOR OUTPUT RECEIPT
        */
        let previousRound = currentRound.sub(1);

        await roundsInputVault.connect(investorAccount).setApprovalForAll(roundsExchanger.address, true);

        tx = await roundsExchanger
            .connect(investorAccount)
            .exchangeInputForOutput(
                roundsInputVault.address,
                roundsOutputVault.address,
                previousRound,
                amountToBeInvested,
            );

        expect(tx)
            .to.emit(roundsInputVault, "WithdrawExchangeAsset")
            .withArgs(
                investorAccount.address,
                investorAccount.address,
                investorAccount.address,
                amountToBeInvested,
                previousRound,
                amountToBeInvested,
            );
        expect(tx)
            .to.emit(roundsOutputVault, "DepositWithReceipt")
            .withArgs(investorAccount.address, investorAccount.address, currentRound, amountToBeInvested);

        expect(await vault.balanceOf(roundsInputVault.address)).to.equal(0);
        expect(await vault.balanceOf(roundsOutputVault.address)).to.equal(amountToBeInvested);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(0);

        expect(await roundsInputVault.balanceOf(investorAccount.address, previousRound)).to.equal(0);
        expect(await roundsInputVault.balanceOfAll(investorAccount.address)).to.equal(0);

        expect(await roundsOutputVault.balanceOf(investorAccount.address, currentRound)).to.equal(amountToBeInvested);
        expect(await roundsOutputVault.balanceOfAll(investorAccount.address)).to.equal(amountToBeInvested);

        /*
            POTION SETTLEMENT
        */
        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, tCond.underlyingAssetExitPriceInUSD);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, tCond.expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, tCond.expirationTimestamp, true);

        /*
            NEXT ROUND
        */
        await fastForwardChain(DAY_IN_SECONDS);

        const { potionBuyInfo: nextPotionBuyInfo } = await getPotionBuyInfo(
            tEnv,
            BigNumber.from(0),
            underlyingAssetPriceInUSD,
            USDCPriceInUSD,
        );

        tx = await orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            nextPotionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        const amountAfterProfitLoss = amountToBeInvested
            .sub(tCond.uniswapEnterPositionInputAmount)
            .add(tCond.uniswapExitPositionOutputAmount);
        currentRound = await tEnv.roundsOutputVault.getCurrentRound();
        previousRound = currentRound.sub(1);

        expect(await roundsOutputVault.balanceOf(investorAccount.address, previousRound)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(roundsOutputVault.address)).to.equal(amountAfterProfitLoss);
        expect(await vault.balanceOf(roundsOutputVault.address)).to.equal(0);

        /*
            WITHDRAW ASSETS
        */
        tx = await roundsOutputVault
            .connect(investorAccount)
            .redeemExchangeAsset(previousRound, amountToBeInvested, investorAccount.address, investorAccount.address);

        expect(tx)
            .to.emit(roundsOutputVault, "WithdrawExchangeAsset")
            .withArgs(
                investorAccount.address,
                investorAccount.address,
                investorAccount.address,
                amountAfterProfitLoss,
                previousRound,
                amountToBeInvested,
            );

        expect(await tEnv.underlyingAsset.balanceOf(roundsOutputVault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(amountAfterProfitLoss);
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(investorAccount.address, previousRound)).to.equal(0);
        expect(await roundsOutputVault.balanceOfAll(investorAccount.address)).to.equal(0);

        expect(await vault.totalSupply()).to.equal(0);
        expect(await vault.totalAssets()).to.equal(0);
    });
});
