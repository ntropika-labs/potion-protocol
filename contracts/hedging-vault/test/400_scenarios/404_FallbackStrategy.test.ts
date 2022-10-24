import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

import * as HedgingVaultUtils from "hedging-vault-sdk";
import { Roles, LifecycleStates } from "hedging-vault-sdk";

import {
    Deployments,
    showConsoleLogs,
    ProviderTypes,
    DeploymentNetwork,
    DeploymentFlags,
    DAY_IN_SECONDS,
} from "contracts-utils";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/testingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";

import {
    InvestmentVault,
    PotionBuyAction,
    RoundsInputVault,
    RoundsOutputVault,
    HedgingVaultOrchestrator,
    SwapToUSDCAction,
    MockPotionLiquidityPool,
} from "../../typechain";

import { fastForwardChain } from "contracts-utils";
import { expectSolidityDeepCompare } from "../utils/chaiHelpers";

/**
    @notice Hedging Vault fallback strategies tests
    
    @author Roberto Cano <robercano>
 */
describe("FallbackStrategy", function () {
    // let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let potionBuy: PotionBuyAction;
    let swapUSDC: SwapToUSDCAction;
    let roundsInputVault: RoundsInputVault;
    let roundsOutputVault: RoundsOutputVault;
    let orchestrator: HedgingVaultOrchestrator;
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
    });

    it("FS0001 - Swap To USDC Action Default Value", async function () {
        // Roles
        expect(await swapUSDC.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await swapUSDC.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await swapUSDC.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await swapUSDC.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await swapUSDC.getRoleMemberCount(Roles.Strategist)).to.equal(1);
        expect(await swapUSDC.getRoleMember(Roles.Strategist, 0)).to.equal(tEnv.strategistAddress);
        expect(await swapUSDC.getRoleMemberCount(Roles.Vault)).to.equal(1);
        expect(await swapUSDC.getRoleMember(Roles.Vault, 0)).to.equal(tEnv.investmentVault.address);

        expect(await swapUSDC.getRoleMemberCount(Roles.Investor)).to.equal(0);

        // Emergency Lock
        expect(await swapUSDC.paused()).to.equal(false);

        // Lifecycle State
        expect(await swapUSDC.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Refunds Helper
        expect(await swapUSDC.canRefundETH()).to.equal(true);
        expect(await swapUSDC.canRefund(tEnv.underlyingAsset.address)).to.equal(false);
        expect(await swapUSDC.canRefund(tEnv.USDC.address)).to.equal(false);

        // Uniswap helper
        expect(await swapUSDC.getSwapRouter()).to.equal(tEnv.uniswapV3SwapRouter.address);

        // Potion Protocol helper
        expect(await swapUSDC.USDC()).to.equal(tEnv.USDC.address);

        // Action Values
        expect(await swapUSDC.swapSlippage()).to.equal(tEnv.swapSlippage);
        expect(await swapUSDC.maxSwapDurationSecs()).to.equal(tEnv.maxSwapDurationSecs);
    });

    it("FS0002 - Full Fallback Cycle", async function () {
        // Test Settings
        const underlyingDecimals = await tEnv.underlyingAsset.decimals();
        const USDCDecimals = await tEnv.USDC.decimals();
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8); // 1000 USDC with 8 decimals
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8); // 1 USDC with 8 decimals
        const amountToBeInvested = ethers.utils.parseEther("20");

        const tCond = await HedgingVaultUtils.setupTestConditions(
            tEnv,
            underlyingAssetPriceInUSD,
            USDCPriceInUSD,
            amountToBeInvested,
        );

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
        let tx = roundsInputVault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);
        await expect(tx)
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

        // Force the Potion protocol to fail
        await (tEnv.potionLiquidityPoolManager as MockPotionLiquidityPool).setRevertBuyOtokens(true);

        tx = orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            tCond.potionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );
        await expect(tx).to.emit(roundsInputVault, "NextRound").withArgs(currentRound.add(1));
        await expect(tx)
            .to.emit(vault, "VaultPositionEntered")
            .withArgs(amountToBeInvested, amountToBeInvested, {
                actionsIndexes: [BigNumber.from(1)],
                principalPercentages: [HedgingVaultUtils.toSolidityPercentage(100)],
            });

        const currentSwapInfo = await swapUSDC.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.swapToUSDCSwapEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await swapUSDC.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the potionBuy
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(swapUSDC.address)).to.equal(
            amountToBeInvested.sub(tCond.amountProtectedInUnderlying),
        );
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(0);

        expect(await tEnv.USDC.balanceOf(potionBuy.address)).to.equal(0);
        expect(await tEnv.USDC.balanceOf(swapUSDC.address)).to.equal(tCond.swapToUSDCAmountUSDC);

        // Rounds Input Vault
        expect(await tEnv.underlyingAsset.balanceOf(roundsInputVault.address)).to.equal(0);
        expect(await vault.balanceOf(roundsInputVault.address)).to.equal(amountToBeInvested);

        currentRound = await tEnv.roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        /*
            REQUEST SHARES
        */
        let previousRound = currentRound.sub(1);
        tx = roundsInputVault
            .connect(investorAccount)
            .redeemExchangeAsset(previousRound, amountToBeInvested, investorAccount.address, investorAccount.address);
        await expect(tx)
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
        tx = roundsOutputVault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);

        await expect(tx)
            .to.emit(roundsOutputVault, "DepositWithReceipt")
            .withArgs(investorAccount.address, investorAccount.address, currentRound, amountToBeInvested);

        expect(await roundsOutputVault.balanceOf(investorAccount.address, currentRound)).to.equal(amountToBeInvested);
        expect(await vault.balanceOf(roundsOutputVault.address)).to.equal(amountToBeInvested);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(0);

        /*
            NEXT ROUND
        */
        await fastForwardChain(DAY_IN_SECONDS);

        // Reuse the Potion Buy Info as the fallback strategy will be triggered again
        tx = orchestrator.nextRound(
            tCond.potionBuySwapExitPosition,
            tCond.potionBuyInfo,
            tCond.potionBuySwapEnterPosition,
            tCond.swapToUSDCSwapExitPosition,
            tCond.swapToUSDCSwapEnterPosition,
        );

        const swapToUSDCAmountUSDCAfterSlippage = HedgingVaultUtils.subtractPercentage(
            tCond.swapToUSDCAmountUSDC,
            tEnv.swapSlippage,
        );
        const amountUnderlyingReturned = HedgingVaultUtils.convertAmount(
            swapToUSDCAmountUSDCAfterSlippage,
            underlyingDecimals,
            USDCDecimals,
            USDCPriceInUSD,
            underlyingAssetPriceInUSD,
        );

        await expect(tx).to.emit(roundsInputVault, "NextRound").withArgs(currentRound.add(1));
        await expect(tx)
            .to.emit(vault, "VaultPositionExited")
            .withArgs(amountUnderlyingReturned, {
                actionsIndexes: [BigNumber.from(1)],
                principalPercentages: [HedgingVaultUtils.toSolidityPercentage(100)],
            });
        await expect(tx)
            .to.emit(vault, "VaultPositionEntered")
            .withArgs(BigNumber.from(0), BigNumber.from(0), {
                actionsIndexes: [BigNumber.from(1)],
                principalPercentages: [HedgingVaultUtils.toSolidityPercentage(100)],
            });

        currentRound = await tEnv.roundsOutputVault.getCurrentRound();
        previousRound = currentRound.sub(1);

        expect(await roundsOutputVault.balanceOf(investorAccount.address, previousRound)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(roundsOutputVault.address)).to.equal(amountUnderlyingReturned);
        expect(await vault.balanceOf(roundsOutputVault.address)).to.equal(0);

        /*
            WITHDRAW ASSETS
        */
        tx = roundsOutputVault
            .connect(investorAccount)
            .redeemExchangeAsset(previousRound, amountToBeInvested, investorAccount.address, investorAccount.address);

        await expect(tx)
            .to.emit(roundsOutputVault, "WithdrawExchangeAsset")
            .withArgs(
                investorAccount.address,
                investorAccount.address,
                investorAccount.address,
                amountUnderlyingReturned,
                previousRound,
                amountToBeInvested,
            );

        expect(await tEnv.underlyingAsset.balanceOf(roundsOutputVault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(amountUnderlyingReturned);
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(investorAccount.address, previousRound)).to.equal(0);
        expect(await roundsOutputVault.balanceOfAll(investorAccount.address)).to.equal(0);

        expect(await vault.totalSupply()).to.equal(0);
        expect(await vault.totalAssets()).to.equal(0);
    });
});
