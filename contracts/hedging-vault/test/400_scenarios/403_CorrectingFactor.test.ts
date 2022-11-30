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

import { InvestmentVault, PotionBuyAction, IPotionLiquidityPool } from "../../typechain";
import { LifecycleStates, toSolidityPercentage } from "hedging-vault-sdk";
import { fastForwardChain, getCurrentTimestamp } from "contracts-utils";
import { expectSolidityDeepCompare } from "../utils/chaiHelpers";
import { Roles } from "hedging-vault-sdk";

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
import { setupTestConditions } from "../../scripts/test/simulationUtils";

/**
    @notice Hedging Vault correcting factor tests 
    
    @author Roberto Cano <robercano>
 */
describe("CorrectingFactor", function () {
    let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let action: PotionBuyAction;
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

        // Modify the hedging rate to 80% to test the hedging rate slippage
        deploymentConfig.hedgingRate = toSolidityPercentage(80.0);

        tEnv = await deployHedgingVaultEnvironment(deploymentConfig);

        // Commented out on purpose
        // printTestingEnv(tEnv);

        vault = tEnv.investmentVault;
        action = tEnv.potionBuyAction;

        // To be able to test the hedging vault without the rounds vaults we need to add
        // the investor account as a whitelisted address for the investment vault
        await vault.grantRole(Roles.Investor, investorAccount.address);

        // Also we need to add the owner account as Operator of both the vault and the action,
        // as we won't be using the orchestrator
        await vault.grantRole(Roles.Operator, ownerAccount.address);
        await action.grantRole(Roles.Operator, ownerAccount.address);

        // Mint some otokens for the Potion Buy action so it thinks that it bought some otokens
        tEnv.opynMockOtoken.mint(action.address, ethers.utils.parseEther("1000"));
    });

    it("CF0001 - Potion Buy Action Hedging Rate Config", async function () {
        expect(await action.hedgingRate()).to.equal(tEnv.hedgingRate);
        expect(await action.hedgingRateSlippage()).to.equal(tEnv.hedgingRateSlippage);
    });

    it("CF0002 - Full cycle with Hedging Rate Slippage", async function () {
        /**
            TEST SETTINGS
        */
        // Test Settings
        const underlyingAssetPriceInUSD = ethers.utils.parseUnits("1000.0", 8); // 1000 USDC with 8 decimals
        const USDCPriceInUSD = ethers.utils.parseUnits("1.0", 8); // 1 USDC with 8 decimals
        const amountToBeInvested = ethers.utils.parseEther("20");

        const tCond = await setupTestConditions(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD, amountToBeInvested);

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
        await action.connect(ownerAccount).setPotionBuyInfo(tCond.potionBuyInfo);
        await action.connect(ownerAccount).setSwapInfo(tCond.potionBuySwapEnterPosition);
        await vault.connect(ownerAccount).enterPosition();

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the action
        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        let currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.potionBuySwapEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the action
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(action.address)).to.equal(
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

        // Emulate what the orchestrator is doing
        await action.connect(ownerAccount).setSwapInfo(tCond.potionBuySwapExitPosition);
        await vault.connect(ownerAccount).exitPosition();

        const cycleEndTimestamp = await getCurrentTimestamp();

        // Check that the operator helper set the uniswap info correctly
        currentSwapInfo = await action.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(tCond.potionBuySwapExitPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Assets balances
        ifMocksEnabled(async () => {
            expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(
                amountToBeInvested
                    .sub(tCond.uniswapEnterPositionInputAmount)
                    .add(tCond.uniswapExitPositionOutputAmount),
            );
        });
        expect(await tEnv.underlyingAsset.balanceOf(action.address)).to.equal(0);
        expect(await tEnv.USDC.balanceOf(action.address)).to.equal(0);

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
                action.address,
                amountToBeInvested,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(2)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                tCond.uniswapEnterPositionInputAmountWithSlippage,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(3)).to.have.been.calledWith(action.address, 0);

            // Uniswap V3 Router calls
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput).to.have.been.calledOnce;
            try {
                expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput.getCall(0).args[0]).to.be.deep.equal([
                    tCond.potionBuySwapEnterPosition.swapPath,
                    action.address,
                    tEnv.maxSwapDurationSecs.add(cycleStartTimestamp),
                    BigNumber.from(tCond.maxPremiumWithSlippageInUSDC),
                    BigNumber.from(tCond.uniswapEnterPositionInputAmountWithSlippage),
                ]);
            } catch (e) {
                // Retry with one more second in the timestamp
                expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput.getCall(0).args[0]).to.be.deep.equal([
                    tCond.potionBuySwapEnterPosition.swapPath,
                    action.address,
                    tEnv.maxSwapDurationSecs.add(cycleStartTimestamp).add(1),
                    BigNumber.from(tCond.maxPremiumWithSlippageInUSDC),
                    BigNumber.from(tCond.uniswapEnterPositionInputAmountWithSlippage),
                ]);
            }
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput.getCall(0).args[0]).to.be.deep.equal([
                tCond.potionBuySwapExitPosition.swapPath,
                action.address,
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
