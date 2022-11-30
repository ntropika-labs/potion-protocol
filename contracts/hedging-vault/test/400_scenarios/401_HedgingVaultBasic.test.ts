import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

import {
    getDeploymentConfig,
    deployHedgingVaultEnvironment,
    HedgingVaultEnvironmentDeployment,
} from "../../scripts/hedging-vault/deployHedgingVaultEnvironment";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";

import { InvestmentVault, IPotionLiquidityPool, PotionBuyAction, SwapToUSDCAction } from "../../typechain";
import { LifecycleStates, toSolidityPercentage } from "hedging-vault-sdk";
import { fastForwardChain, getCurrentTimestamp } from "contracts-utils";
import { expectSolidityDeepCompare } from "../utils/chaiHelpers";
import { Roles } from "hedging-vault-sdk";
import { setupTestConditions } from "../../scripts/test/simulationUtils";

import {
    ifMocksEnabled,
    asMock,
    Deployments,
    showConsoleLogs,
    ProviderTypes,
    DeploymentNetwork,
    DeploymentFlags,
    DAY_IN_SECONDS,
} from "contracts-utils";

/**
    @notice Hedging Vault basic flow unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("HedgingVaultBasic", function () {
    let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let potionBuy: PotionBuyAction;
    let swapToUSDC: SwapToUSDCAction;
    let tEnv: HedgingVaultEnvironmentDeployment;

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
        ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        const deploymentType = Deployments.getType();
        deploymentConfig = getDeploymentConfig(deploymentType);

        tEnv = await deployHedgingVaultEnvironment(deploymentConfig);

        // Commented out on purpose
        // printTestingEnv(tEnv);

        vault = tEnv.investmentVault;
        potionBuy = tEnv.potionBuyAction;
        swapToUSDC = tEnv.swapToUSDCAction;

        // To be able to test the hedging vault without the rounds vaults we need to add
        // the investor account as a whitelisted address for the investment vault
        await vault.grantRole(Roles.Investor, investorAccount.address);

        // Also we need to add the owner account as Operator of both the vault and the potionBuy,
        // as we won't be using the orchestrator
        await vault.grantRole(Roles.Operator, ownerAccount.address);
        await potionBuy.grantRole(Roles.Operator, ownerAccount.address);
    });

    it("HVB0001 - Investment Vault Default Value", async function () {
        // Roles
        expect(await vault.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await vault.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await vault.getRoleMemberCount(Roles.Operator)).to.equal(2);
        expect(await vault.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await vault.getRoleMemberCount(Roles.Strategist)).to.equal(1);
        expect(await vault.getRoleMember(Roles.Strategist, 0)).to.equal(tEnv.strategistAddress);
        expect(await vault.getRoleMemberCount(Roles.Vault)).to.equal(0);
        expect(await vault.getRoleMemberCount(Roles.Investor)).to.equal(3);

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
        expect(await vault.getAction(1)).to.equal(swapToUSDC.address);

        // Shares name and symbol
        expect(await vault.name()).to.equal(tEnv.sharesName);
        expect(await vault.symbol()).to.equal(tEnv.sharesSymbol);
    });

    it("HVB0002 - Potion Buy Action Default Value", async function () {
        // Roles
        expect(await potionBuy.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await potionBuy.getRoleMemberCount(Roles.Operator)).to.equal(2);
        expect(await potionBuy.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await potionBuy.getRoleMember(Roles.Operator, 1)).to.equal(ownerAccount.address);
        expect(await potionBuy.getRoleMemberCount(Roles.Strategist)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Strategist, 0)).to.equal(tEnv.strategistAddress);
        expect(await potionBuy.getRoleMemberCount(Roles.Vault)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Vault, 0)).to.equal(vault.address);
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

    it("HVB0003 - Basic Deposit/Redemption", async function () {
        // Mint and approve
        await tEnv.underlyingAsset.mint(investorAccount.address, 20000);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);

        await tEnv.underlyingAsset.connect(investorAccount).approve(vault.address, 20000);
        expect(
            await tEnv.underlyingAsset.connect(investorAccount).allowance(investorAccount.address, vault.address),
        ).to.equal(20000);

        // Deposit and check received shares
        await vault.connect(investorAccount).deposit(20000, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(20000);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        // Withdraw and check received assets
        await vault.connect(investorAccount).redeem(20000, investorAccount.address, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);
    });
    it("HVB0004 - Empty Vault Next Round", async function () {
        // Test Settings
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8);
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8);
        const amountToBeInvested = ethers.utils.parseEther("0");

        const tCond = await setupTestConditions(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD, amountToBeInvested);

        /*
            ENTER POSITION
        */

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);

        // Emulate what the orchestrator is doing to enter a position
        await potionBuy.connect(ownerAccount).setPotionBuyInfo(tCond.potionBuyInfo);
        await potionBuy.connect(ownerAccount).setSwapInfo(tCond.potionBuySwapEnterPosition);

        await expect(vault.connect(ownerAccount).enterPosition())
            .to.emit(vault, "VaultPositionEntered")
            .withArgs(amountToBeInvested, amountToBeInvested, {
                actionsIndexes: [BigNumber.from(0)],
                principalPercentages: [toSolidityPercentage(100)],
            });

        // Check that the helper set the correct info in the potionBuy
        const currentPotionBuyInfo = await potionBuy.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        let currentSwapInfo = await potionBuy.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.potionBuySwapEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the potionBuy
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(0);

        /*
            EXIT POSITION
        */

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, tCond.underlyingAssetExitPriceInUSD);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, tCond.expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, tCond.expirationTimestamp, true);

        // Exit the position
        await fastForwardChain(DAY_IN_SECONDS);
        // Emulate what the orchestrator is doing
        await potionBuy.connect(ownerAccount).setSwapInfo(tCond.potionBuySwapExitPosition);

        await expect(vault.connect(ownerAccount).exitPosition())
            .to.emit(vault, "VaultPositionExited")
            .withArgs(0, {
                actionsIndexes: [BigNumber.from(0)],
                principalPercentages: [toSolidityPercentage(100)],
            });

        // Check that the operator helper set the uniswap info correctly
        currentSwapInfo = await potionBuy.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(tCond.potionBuySwapExitPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Assets balances
        ifMocksEnabled(async () => {
            expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        });
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(0);
        expect(await tEnv.USDC.balanceOf(potionBuy.address)).to.equal(0);

        /**
         * MOCKS CHECKS
         */
        ifMocksEnabled(() => {
            // USDC calls
            expect(asMock(tEnv.USDC).approve).to.have.callCount(0);

            // Underlying Asset calls
            expect(asMock(tEnv.underlyingAsset).approve).to.have.callCount(2);
            expect(asMock(tEnv.underlyingAsset).approve.atCall(1)).to.have.been.calledWith(
                potionBuy.address,
                amountToBeInvested,
            );

            // Uniswap V3 Router calls
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput).to.have.not.been.called;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput).to.have.not.been.called;

            // Potion Liquidity Manager calls
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens).to.have.not.been.called;
            expect(asMock(tEnv.potionLiquidityPoolManager).settleAndRedistributeSettlement).to.have.not.been.called;
        });
    });
    it("HVB0005 - Full cycle", async function () {
        // Test Settings
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8);
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8);
        const amountToBeInvested = ethers.utils.parseEther("20");

        const tCond = await setupTestConditions(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD, amountToBeInvested);

        // Mint some otokens for the Potion Buy action so it thinks that it bought some otokens
        await tEnv.opynMockOtoken.mint(potionBuy.address, ethers.utils.parseEther("1000"));

        /*
            MINT
        */
        let prevBalance = await tEnv.underlyingAsset.balanceOf(investorAccount.address);
        await tEnv.underlyingAsset.mint(investorAccount.address, amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(
            prevBalance.add(amountToBeInvested),
        );
        await tEnv.underlyingAsset.connect(investorAccount).approve(vault.address, amountToBeInvested);
        expect(
            await tEnv.underlyingAsset.connect(investorAccount).allowance(investorAccount.address, vault.address),
        ).to.equal(amountToBeInvested);

        /*
            DEPOSIT
        */
        prevBalance = await tEnv.underlyingAsset.balanceOf(investorAccount.address);

        await vault.connect(investorAccount).deposit(amountToBeInvested, investorAccount.address);

        expect(await vault.balanceOf(investorAccount.address)).to.equal(amountToBeInvested);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(
            prevBalance.sub(amountToBeInvested),
        );

        /*
            ENTER POSITION
        */

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);

        // Emulate what the orchestrator is doing to enter a position
        await potionBuy.connect(ownerAccount).setPotionBuyInfo(tCond.potionBuyInfo);
        await potionBuy.connect(ownerAccount).setSwapInfo(tCond.potionBuySwapEnterPosition);

        await expect(vault.connect(ownerAccount).enterPosition())
            .to.emit(vault, "VaultPositionEntered")
            .withArgs(amountToBeInvested, amountToBeInvested, {
                actionsIndexes: [BigNumber.from(0)],
                principalPercentages: [toSolidityPercentage(100)],
            });

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the potionBuy
        const currentPotionBuyInfo = await potionBuy.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        let currentSwapInfo = await potionBuy.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

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

        /*
            EXIT POSITION
        */

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, tCond.underlyingAssetExitPriceInUSD);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, tCond.expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, tCond.expirationTimestamp, true);

        // Exit the position
        await fastForwardChain(DAY_IN_SECONDS);

        const newPrincipalAmount = amountToBeInvested
            .sub(tCond.uniswapEnterPositionInputAmount)
            .add(tCond.uniswapExitPositionOutputAmount);

        // Emulate what the orchestrator is doing
        await potionBuy.connect(ownerAccount).setSwapInfo(tCond.potionBuySwapExitPosition);

        await expect(vault.connect(ownerAccount).exitPosition())
            .to.emit(vault, "VaultPositionExited")
            .withArgs(newPrincipalAmount, {
                actionsIndexes: [BigNumber.from(0)],
                principalPercentages: [toSolidityPercentage(100)],
            });

        const cycleEndTimestamp = await getCurrentTimestamp();

        // Check that the operator helper set the uniswap info correctly
        currentSwapInfo = await potionBuy.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(tCond.potionBuySwapExitPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Assets balances
        ifMocksEnabled(async () => {
            expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(newPrincipalAmount);
        });
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(0);
        expect(await tEnv.USDC.balanceOf(potionBuy.address)).to.equal(0);

        /**
         * MOCKS CHECKS
         */
        ifMocksEnabled(() => {
            // USDC calls
            expect(asMock(tEnv.USDC).approve).to.have.callCount(2);
            expect(asMock(tEnv.USDC).approve.atCall(0)).to.have.been.calledWith(
                tEnv.potionLiquidityPoolManager.address,
                tCond.maxPremiumWithSlippageInUSDC,
            );
            expect(asMock(tEnv.USDC).approve.atCall(1)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                tCond.totalUSDCInActionAfterPayout,
            );

            // Underlying Asset calls
            expect(asMock(tEnv.underlyingAsset).approve).to.have.callCount(4);
            expect(asMock(tEnv.underlyingAsset).approve.atCall(1)).to.have.been.calledWith(
                potionBuy.address,
                amountToBeInvested,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(2)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                tCond.uniswapEnterPositionInputAmountWithSlippage,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(3)).to.have.been.calledWith(potionBuy.address, 0);

            // Uniswap V3 Router calls
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput.getCall(0).args[0]).to.be.deep.equal([
                tCond.potionBuySwapEnterPosition.swapPath,
                potionBuy.address,
                tEnv.maxSwapDurationSecs.add(cycleStartTimestamp),
                BigNumber.from(tCond.maxPremiumWithSlippageInUSDC),
                BigNumber.from(tCond.uniswapEnterPositionInputAmountWithSlippage),
            ]);
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput.getCall(0).args[0]).to.be.deep.equal([
                tCond.potionBuySwapExitPosition.swapPath,
                potionBuy.address,
                tEnv.maxSwapDurationSecs.add(cycleEndTimestamp),
                tCond.totalUSDCInActionAfterPayout,
                tCond.uniswapExitPositionOutputAmountWithSlippage,
            ]);

            // Potion Liquidity Manager calls
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens).to.have.been.calledOnce;
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens.getCall(0).args[0]).to.be.equal(
                tCond.potionBuyInfo.targetPotionAddress,
            );
            expectSolidityDeepCompare(
                tCond.potionBuyInfo.sellers,
                asMock(tEnv.potionLiquidityPoolManager).buyOtokens.getCall(0).args[1],
            );
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens.getCall(0).args[2]).to.be.equal(
                tCond.maxPremiumWithSlippageInUSDC,
            );
            expect(asMock(tEnv.potionLiquidityPoolManager).settleAndRedistributeSettlement).to.have.been.calledOnce;
            expect(
                asMock(tEnv.potionLiquidityPoolManager).settleAndRedistributeSettlement.getCall(0).args[0],
            ).to.be.equal(tCond.potionBuyInfo.targetPotionAddress);

            const pools: IPotionLiquidityPool.PoolIdentifierStruct[] = [];
            for (let i = 0; i < tCond.potionBuyInfo.sellers.length; i++) {
                pools.push({
                    lp: tCond.potionBuyInfo.sellers[i].lp,
                    poolId: tCond.potionBuyInfo.sellers[i].poolId,
                });
            }

            expectSolidityDeepCompare(
                pools,
                asMock(tEnv.potionLiquidityPoolManager).settleAndRedistributeSettlement.getCall(0).args[1],
            );
        });
    });
});
