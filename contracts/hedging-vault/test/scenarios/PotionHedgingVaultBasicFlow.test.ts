import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

import { CurveCriteria, HyperbolicCurve } from "contracts-math";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/TestingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";

import {
    InvestmentVault,
    PotionBuyAction,
    IPotionLiquidityPool,
    IUniswapV3Oracle,
    HedgingVaultOperatorHelper__factory,
    HedgingVaultOperatorHelper,
} from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates } from "../utils/LifecycleStates";
import { toPRBMath } from "../utils/PRBMathUtils";
import { getEncodedSwapPath } from "../utils/UniswapV3Utils";
import { fastForwardChain, DAY_IN_SECONDS, getNextTimestamp } from "../utils/BlockchainUtils";
import { expectSolidityDeepCompare } from "../utils/ExpectDeepUtils";
import * as PercentageUtils from "../utils/PercentageUtils";
import { NetworksType } from "../../hardhat.helpers";
import { asMock, ifMocksEnabled } from "../../scripts/test/MocksLibrary";
import { calculatePremium } from "../../scripts/test/PotionPoolsUtils";

/**
    @notice Hedging Vault basic flow unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("HedgingVault", function () {
    let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let action: PotionBuyAction;
    let operatorHelper: HedgingVaultOperatorHelper;
    let tEnv: TestingEnvironmentDeployment;

    beforeEach(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        deploymentConfig = getDeploymentConfig(network.name as NetworksType);

        tEnv = await deployTestingEnv(deploymentConfig);

        // Commented out on purpose
        // printTestingEnv(tEnv);

        vault = tEnv.investmentVault;
        action = tEnv.potionBuyAction;
        operatorHelper = tEnv.hedgingVaultOperatorHelper;
    });

    it("Vault Deployment Values", async function () {
        // Roles
        expect(await vault.getAdmin()).to.equal(tEnv.adminAddress);
        expect(await vault.getOperator()).to.equal(tEnv.hedgingVaultOperatorHelper.address);
        expect(await vault.getStrategist()).to.equal(tEnv.strategistAddress);
        expect(await vault.getVault()).to.equal("0x0000000000000000000000000000000000000000");

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
        expect(await vault.getActionsLength()).to.equal(1);
        expect(await vault.getAction(0)).to.equal(action.address);

        // Principal Percentages
        const principalPercentages = await vault.getPrincipalPercentages();
        expect(principalPercentages.length).to.equal(1);
        expect(principalPercentages[0]).to.equal(tEnv.hedgingPercentage);
        expect(await vault.getPrincipalPercentage(0)).to.equal(tEnv.hedgingPercentage);
    });
    it("Action Deployment Values", async function () {
        // Roles
        expect(await action.getAdmin()).to.equal(tEnv.adminAddress);
        expect(await action.getOperator()).to.equal(tEnv.hedgingVaultOperatorHelper.address);
        expect(await action.getStrategist()).to.equal(tEnv.strategistAddress);
        expect(await action.getVault()).to.equal(vault.address);

        // Emergency Lock
        expect(await action.paused()).to.equal(false);

        // Lifecycle State
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Refunds Helper
        expect(await action.canRefundETH()).to.equal(true);
        expect(await action.canRefund(tEnv.underlyingAsset.address)).to.equal(false);
        expect(await action.canRefund(tEnv.USDC.address)).to.equal(false);

        // Uniswap helper
        expect(await action.getSwapRouter()).to.equal(tEnv.uniswapV3SwapRouter.address);

        // Potion Protocol helper
        expect(await action.getPotionLiquidityManager()).to.equal(tEnv.potionLiquidityPoolManager.address);
        expect(await action.getOpynAddressBook()).to.equal(tEnv.opynAddressBook.address);
        expect(await action.getUSDC()).to.equal(tEnv.USDC.address);

        // Action Values
        expect(await action.maxPremiumPercentage()).to.equal(tEnv.maxPremiumPercentage);
        expect(await action.premiumSlippage()).to.equal(tEnv.premiumSlippage);
        expect(await action.swapSlippage()).to.equal(tEnv.swapSlippage);
        expect(await action.maxSwapDurationSecs()).to.equal(tEnv.maxSwapDurationSecs);
        expect(await action.cycleDurationSecs()).to.equal(tEnv.cycleDurationSecs);
    });

    it("Basic Deposit/Redemption", async function () {
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
    it("Full cycle (deposit, enter, exit, redeem)", async function () {
        // Test Settings
        const underlyingAssetPriceInUSD = 1000.0;
        const USDCPriceInUSD = 1.0;

        const underlyingAssetPriceInUSDbn = ethers.utils.parseUnits(String(underlyingAssetPriceInUSD), 8); // 1000 USDC with 8 decimals
        const USDCPriceInUSDbn = ethers.utils.parseUnits(String(USDCPriceInUSD), 8); // 1 USDC with 8 decimals

        const amountToBeInvested = ethers.utils.parseEther("20");
        const otokensAmount = amountToBeInvested.div(10000000000); // oToken uses 8 decimals

        /*
            COLLATERAL
        */
        const amountProtected = PercentageUtils.applyPercentage(amountToBeInvested, tEnv.hedgingPercentage);
        const amountProtectedInUSDC = amountProtected
            .mul(underlyingAssetPriceInUSDbn)
            .div(USDCPriceInUSDbn)
            .div(BigNumber.from(1000000000000)); // USDC only uses 6 decimals, so divide by 10**(18 - 6)

        const collateralRequiredInUSDC = PercentageUtils.applyPercentage(amountProtectedInUSDC, tEnv.strikePercentage);

        const curve = new HyperbolicCurve(0.1, 0.1, 0.1, 0.1);
        const criteria = new CurveCriteria(tEnv.underlyingAsset.address, tEnv.USDC.address, true, 120, 365); // PUT, max 120% strike & max 1 year duration

        const lpAddress = (await ethers.getSigners())[0].address;
        const pool = await tEnv.potionLiquidityPoolManager.lpPools(lpAddress, 0);
        const expectedPremiumInUSDC = calculatePremium(pool, curve, collateralRequiredInUSDC);

        const maxPremiumWithSlippageInUSDC = PercentageUtils.addPercentage(expectedPremiumInUSDC, tEnv.premiumSlippage);
        const strikePriceInUSDC = PercentageUtils.applyPercentage(underlyingAssetPriceInUSDbn, tEnv.strikePercentage);
        const nextCycleStartTimestamp = await action.nextCycleStartTimestamp();
        const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

        const uniswapEnterPositionInputAmount = PercentageUtils.addPercentage(
            maxPremiumWithSlippageInUSDC
                .mul(BigNumber.from(1000000000000))
                .mul(USDCPriceInUSDbn)
                .div(underlyingAssetPriceInUSDbn),
            tEnv.swapSlippage,
        );

        const potionOtokenAddress = await tEnv.opynFactory.getTargetOtokenAddress(
            tEnv.underlyingAsset.address,
            tEnv.USDC.address,
            tEnv.USDC.address,
            strikePriceInUSDC,
            expirationTimestamp,
            true,
        );

        // Configure mock and fake contracts
        ifMocksEnabled(() => {
            asMock(tEnv.potionLiquidityPoolManager).buyOtokens.returns(async () => {
                // Transfer
                await tEnv.USDC.connect(asMock(tEnv.potionLiquidityPoolManager).wallet).transferFrom(
                    action.address,
                    tEnv.potionLiquidityPoolManager.address,
                    expectedPremiumInUSDC,
                );
                return expectedPremiumInUSDC;
            });
            asMock(tEnv.opynController).isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(false);
            asMock(tEnv.USDC).approve.reset();
            asMock(tEnv.USDC).approve.returns(true);
            asMock(tEnv.underlyingAsset).approve.reset();
            asMock(tEnv.underlyingAsset).approve.returns(true);
        });

        // Mint and approve
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

        // POTION BUY INFO

        // The Potion Protocol sample deployment creates some pools of capitals using the default ethers signers. We
        // use the first pool of capital and copy its curve and criteria here. The lp address is the address of the
        // deployer of the contracts (i.e.: signer[0]). And the pool id is always 0
        const counterparties: IPotionLiquidityPool.CounterpartyDetailsStruct[] = [
            {
                lp: lpAddress,
                poolId: 0,
                curve: curve.asSolidityStruct(),
                criteria: criteria,
                orderSizeInOtokens: otokensAmount,
            },
        ];

        const potionBuyInfo: PotionBuyInfoStruct = {
            targetPotionAddress: potionOtokenAddress,
            underlyingAsset: tEnv.underlyingAsset.address,
            strikePriceInUSDC: strikePriceInUSDC,
            expirationTimestamp: expirationTimestamp,
            sellers: counterparties,
            expectedPremiumInUSDC: expectedPremiumInUSDC,
            totalSizeInPotions: otokensAmount,
        };

        // UNISWAP INFO

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetPriceInUSDbn);
        await tEnv.opynOracle.setStablePrice(tEnv.USDC.address, USDCPriceInUSDbn);

        // Set the Uniswap route info
        const swapInfoEnterPosition: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.underlyingAsset.address,
            outputToken: tEnv.USDC.address,
            expectedPriceRate: toPRBMath(underlyingAssetPriceInUSD / USDCPriceInUSD, 18, 6),
            swapPath: getEncodedSwapPath([tEnv.underlyingAsset.address, tEnv.USDC.address]),
        };

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);

        const cycleStartTimestamp = await getNextTimestamp();

        await operatorHelper.connect(ownerAccount).enterPosition(swapInfoEnterPosition, potionBuyInfo);

        // Check that the helper set the correct info in the action
        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            strikePriceInUSDC,
            expirationTimestamp,
        );

        expectSolidityDeepCompare(potionBuyInfo, currentPotionBuyInfo);

        let currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(swapInfoEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the action
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(action.address)).to.equal(
            amountToBeInvested.sub(uniswapEnterPositionInputAmount),
        );

        /*
            EXIT POSITION
        */

        // Use the strike percent and reduce it by 10% to get the exit price
        const exitPriceDecreasePercentage = ethers.utils.parseUnits("10", 6);
        const underlyingAssetPricePercentage = tEnv.strikePercentage.sub(exitPriceDecreasePercentage);
        const underlyingAssetExitPriceInUSDbn = PercentageUtils.applyPercentage(
            underlyingAssetPriceInUSDbn,
            underlyingAssetPricePercentage,
        );
        const payoutInUSDC = PercentageUtils.applyPercentage(amountProtectedInUSDC, exitPriceDecreasePercentage);

        // TODO: When using the mocked version of the Potion Liquidity manager the premium is not transferred from the
        // TODO: action contract to the Potion Liquidity Manager contract. In the same way, the Opyn Controller mock is
        // TODO: not transferring the payout to the action contract when exiting the position. In the lines below we
        // TODO: account for this to know how much USDC will be in the action after the payout
        let totalUSDCInActionAfterPayout: BigNumber;
        if (network.name === "hardhat") {
            totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC);
        } else {
            totalUSDCInActionAfterPayout = payoutInUSDC.add(maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC));
        }

        const extraUnderlyingAssetInVaultAfterPayout = totalUSDCInActionAfterPayout
            .mul(BigNumber.from(1000000000000))
            .mul(USDCPriceInUSDbn)
            .div(underlyingAssetPriceInUSDbn);

        const uniswapExitPositionOutputAmount = PercentageUtils.substractPercentage(
            extraUnderlyingAssetInVaultAfterPayout,
            tEnv.swapSlippage,
        );

        // Setup the mocks
        ifMocksEnabled(() => {
            asMock(tEnv.opynController).isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(true);
            asMock(tEnv.opynController).getPayout.returns(() => {
                return payoutInUSDC;
            });
            asMock(tEnv.opynController).operate.returns(async (args: any) => {
                if (args[0][0].actionType !== 8) {
                    return;
                }
                // TODO: This is failing and I'm not sure if it is a Smock problem or a logic
                // TODO: problem in the tests
                // await tEnv.USDC.connect(ownerAccount).mint(action.address, payoutInUSDC);
            });
        });

        // Set the Uniswap route info
        const swapInfoExitPosition: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.USDC.address,
            outputToken: tEnv.underlyingAsset.address,
            expectedPriceRate: toPRBMath(USDCPriceInUSD / underlyingAssetPriceInUSD, 6, 18),
            swapPath: getEncodedSwapPath([tEnv.USDC.address, tEnv.underlyingAsset.address]),
        };

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetExitPriceInUSDbn);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, expirationTimestamp, true);

        // Exit the position
        await fastForwardChain(DAY_IN_SECONDS);

        const cycleEndTimestamp = await getNextTimestamp();

        await operatorHelper.connect(ownerAccount).exitPosition(swapInfoExitPosition);

        // Check that the operator helper set the uniswap info correctly
        currentSwapInfo = await action.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(swapInfoExitPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Assets balances
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(
            amountToBeInvested.sub(uniswapEnterPositionInputAmount).add(uniswapExitPositionOutputAmount),
        );
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
                maxPremiumWithSlippageInUSDC,
            );
            expect(asMock(tEnv.USDC).approve.atCall(1)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                totalUSDCInActionAfterPayout,
            );

            // Underlying Asset calls
            expect(asMock(tEnv.underlyingAsset).approve).to.have.callCount(4);
            expect(asMock(tEnv.underlyingAsset).approve.atCall(1)).to.have.been.calledWith(
                action.address,
                amountToBeInvested,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(2)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                uniswapEnterPositionInputAmount,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(3)).to.have.been.calledWith(action.address, 0);

            // Uniswap V3 Router calls
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput.getCall(0).args[0]).to.be.deep.equal([
                swapInfoEnterPosition.swapPath,
                action.address,
                tEnv.maxSwapDurationSecs.add(cycleStartTimestamp),
                BigNumber.from(maxPremiumWithSlippageInUSDC),
                BigNumber.from(uniswapEnterPositionInputAmount),
            ]);
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput.getCall(0).args[0]).to.be.deep.equal([
                swapInfoExitPosition.swapPath,
                action.address,
                tEnv.maxSwapDurationSecs.add(cycleEndTimestamp),
                totalUSDCInActionAfterPayout,
                uniswapExitPositionOutputAmount,
            ]);

            // Potion Liquidity Manager calls
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens).to.have.been.calledOnce;
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens.getCall(0).args[0]).to.be.equal(
                potionOtokenAddress,
            );
            expectSolidityDeepCompare(
                counterparties,
                asMock(tEnv.potionLiquidityPoolManager).buyOtokens.getCall(0).args[1],
            );
            expect(asMock(tEnv.potionLiquidityPoolManager).buyOtokens.getCall(0).args[2]).to.be.equal(
                maxPremiumWithSlippageInUSDC,
            );
            expect(asMock(tEnv.potionLiquidityPoolManager).settleAfterExpiry).to.have.been.calledOnce;
            expect(asMock(tEnv.potionLiquidityPoolManager).settleAfterExpiry.getCall(0).args[0]).to.be.equal(
                potionOtokenAddress,
            );
        });
    });
});
