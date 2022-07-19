import { expect } from "chai";
import { ethers, network } from "hardhat";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/TestingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { InvestmentVault, PotionBuyAction, IPotionLiquidityPool, IUniswapV3Oracle } from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates } from "../utils/LifecycleStates";
import { BigNumber } from "ethers";
import { toPRBMath } from "../utils/PRBMathUtils";
import { getEncodedSwapPath } from "../utils/UniswapV3Utils";
import { fastForwardChain, DAY_IN_SECONDS, getNextTimestamp } from "../utils/BlockchainUtils";
import { expectSolidityDeepCompare } from "../utils/ExpectDeepUtils";
import * as PercentageUtils from "../utils/PercentageUtils";
import { NetworksType } from "../../hardhat.helpers";
import { asMock } from "../../scripts/test/MocksLibrary";
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
    let tEnv: TestingEnvironmentDeployment;

    beforeEach(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        deploymentConfig = getDeploymentConfig(network.name as NetworksType);

        tEnv = await deployTestingEnv(deploymentConfig);

        vault = tEnv.investmentVault;
        action = tEnv.potionBuyAction;
    });

    it("Vault Deployment Values", async function () {
        // Roles
        expect(await vault.getAdmin()).to.equal(tEnv.adminAddress);
        expect(await vault.getOperator()).to.equal(tEnv.operatorAddress);
        expect(await vault.getStrategist()).to.equal(tEnv.strategistAddress);

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
        expect(await action.getOperator()).to.equal(tEnv.operatorAddress);
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

        // Burn it
        await tEnv.underlyingAsset.connect(investorAccount).burn(20000);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);
    });
    it("Full cycle (deposit, enter, exit, redeem)", async function () {
        const potionOtokenAddress = (await ethers.getSigners())[5].address;
        const lpAddress = (await ethers.getSigners())[6].address;

        // Configure mock and fake contracts
        asMock(tEnv.potionLiquidityPoolManager)?.buyOtokens.returns((args: any) => {
            // This causes the potion library to not do an extra safeApprove on USDC
            // as all the allowance has been consumed
            return args._maxPremium;
        });
        asMock(tEnv.uniswapV3SwapRouter)?.exactOutput.returns((args: any) => {
            // This causes the uniswap library to not do an extra safeApprove on the
            // underlying asset as all the allowance has been consumed
            return args.params.amountInMaximum;
        });
        asMock(tEnv.uniswapV3SwapRouter)?.exactInput.returns((args: any) => {
            return args.params.amountOutMinimum;
        });
        asMock(tEnv.opynController)?.isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(false);
        asMock(tEnv.opynFactory)?.getOtoken.returns(potionOtokenAddress);
        asMock(tEnv.USDC)?.approve.returns(true);
        asMock(tEnv.underlyingAsset)?.approve.returns(true);

        // Mint and approve
        await tEnv.underlyingAsset.mint(investorAccount.address, 20000);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);
        await tEnv.underlyingAsset.connect(investorAccount).approve(vault.address, 20000);
        expect(
            await tEnv.underlyingAsset.connect(investorAccount).allowance(investorAccount.address, vault.address),
        ).to.equal(20000);

        /*
            DEPOSIT
        */
        await vault.connect(investorAccount).deposit(20000, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(20000);
        expect(await tEnv.underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        // Set the potion buy info
        const nextCycleStartTimestamp = await action.nextCycleStartTimestamp();
        const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

        const counterparties: IPotionLiquidityPool.CounterpartyDetailsStruct[] = [
            {
                lp: lpAddress,
                poolId: 55,
                curve: {
                    a_59x18: 1,
                    b_59x18: 2,
                    c_59x18: 3,
                    d_59x18: 4,
                    max_util_59x18: 5,
                },
                criteria: {
                    underlyingAsset: tEnv.underlyingAsset.address,
                    strikeAsset: tEnv.USDC.address,
                    isPut: true,
                    maxStrikePercent: 99,
                    maxDurationInDays: 59,
                },
                orderSizeInOtokens: 3001,
            },
        ];

        // Srtike price always has 8 decimals
        const strikePriceInUSDC = PercentageUtils.applyPercentage(100000000000, tEnv.strikePercentage);

        const potionBuyInfo: PotionBuyInfoStruct = {
            targetPotionAddress: potionOtokenAddress,
            underlyingAsset: tEnv.underlyingAsset.address,
            strikePriceInUSDC: strikePriceInUSDC,
            expirationTimestamp: expirationTimestamp,
            sellers: counterparties,
            expectedPremiumInUSDC: BigNumber.from("1000"),
            totalSizeInPotions: BigNumber.from("20000"),
        };

        await action.setPotionBuyInfo(potionBuyInfo);

        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            strikePriceInUSDC,
            expirationTimestamp,
        );

        expectSolidityDeepCompare(potionBuyInfo, currentPotionBuyInfo);

        /*
            ENTER POSITION
        */
        // Set the Uniswap route info
        let swapInfo: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.underlyingAsset.address,
            outputToken: tEnv.USDC.address,
            expectedPriceRate: toPRBMath("5.0"),
            swapPath: getEncodedSwapPath([tEnv.underlyingAsset.address, tEnv.USDC.address]),
        };

        await action.setSwapInfo(swapInfo);

        let currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(swapInfo, currentSwapInfo);

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);

        let nextBlockTimestamp = await getNextTimestamp();

        await vault.connect(ownerAccount).enterPosition();

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the action
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(action.address)).to.equal(20000);

        // Check approve calls: the first call was directly done above in the test code, so
        // check the second and the third call.
        if (network.name === "hardhat") {
            expect(asMock(tEnv.underlyingAsset)?.approve).to.have.callCount(3);
            expect(asMock(tEnv.underlyingAsset)?.approve.atCall(1)).to.have.been.calledWith(action.address, 20000);
            expect(asMock(tEnv.underlyingAsset)?.approve.atCall(2)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                208,
            );

            expect(asMock(tEnv.USDC)?.approve).to.have.been.calledOnce;
            expect(asMock(tEnv.USDC)?.approve.atCall(0)).to.have.been.calledWith(
                tEnv.potionLiquidityPoolManager.address,
                1020,
            );
        }

        // Check the Uniswap Calls
        if (network.name === "hardhat") {
            expect(asMock(tEnv.uniswapV3SwapRouter)?.exactOutput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter)?.exactOutput.getCall(0).args[0]).to.be.deep.equal([
                swapInfo.swapPath,
                action.address,
                tEnv.maxSwapDurationSecs.add(nextBlockTimestamp),
                BigNumber.from(1020),
                BigNumber.from(208),
            ]);
        }

        // Check the Potion calls
        if (network.name === "hardhat") {
            expect(asMock(tEnv.potionLiquidityPoolManager)?.buyOtokens).to.have.been.calledOnce;
            expect(asMock(tEnv.potionLiquidityPoolManager)?.buyOtokens.getCall(0).args[0]).to.be.equal(
                potionOtokenAddress,
            );
            expectSolidityDeepCompare(
                counterparties,
                asMock(tEnv.potionLiquidityPoolManager)?.buyOtokens.getCall(0).args[1],
            );
            expect(asMock(tEnv.potionLiquidityPoolManager)?.buyOtokens.getCall(0).args[2]).to.be.equal(1020);
        }

        /*
            EXIT POSITION
        */

        // Setup the mocks
        asMock(tEnv.opynController)?.isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(true);

        // Set the Uniswap route info
        swapInfo = {
            inputToken: tEnv.USDC.address,
            outputToken: tEnv.underlyingAsset.address,
            expectedPriceRate: toPRBMath("0.2"),
            swapPath: getEncodedSwapPath([tEnv.USDC.address, tEnv.underlyingAsset.address]),
        };

        await action.setSwapInfo(swapInfo);

        currentSwapInfo = await action.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(swapInfo, currentSwapInfo);

        // Exit the position
        await fastForwardChain(DAY_IN_SECONDS);

        nextBlockTimestamp = await getNextTimestamp();

        await vault.connect(ownerAccount).exitPosition();

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the action to the vault
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(20000);
        expect(await tEnv.underlyingAsset.balanceOf(action.address)).to.equal(0);

        // Check approve calls: the first call was directly done above in the test code, so
        // check the second and the third call.
        if (network.name === "hardhat") {
            expect(asMock(tEnv.USDC)?.approve).to.have.callCount(2);
            expect(asMock(tEnv.USDC)?.approve.atCall(1)).to.have.been.calledWith(tEnv.uniswapV3SwapRouter.address, 0);

            expect(asMock(tEnv.underlyingAsset)?.approve).to.have.callCount(4);
            expect(asMock(tEnv.underlyingAsset)?.approve.atCall(3)).to.have.been.calledWith(action.address, 0);
        }

        // Check the Uniswap Calls
        if (network.name === "hardhat") {
            expect(asMock(tEnv.uniswapV3SwapRouter)?.exactInput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter)?.exactInput.getCall(0).args[0]).to.be.deep.equal([
                swapInfo.swapPath,
                action.address,
                tEnv.maxSwapDurationSecs.add(nextBlockTimestamp),
                BigNumber.from(0),
                BigNumber.from(0),
            ]);
        }

        // Check the Potion calls
        if (network.name === "hardhat") {
            expect(asMock(tEnv.potionLiquidityPoolManager)?.settleAfterExpiry).to.have.been.calledOnce;
            expect(asMock(tEnv.potionLiquidityPoolManager)?.settleAfterExpiry.getCall(0).args[0]).to.be.equal(
                potionOtokenAddress,
            );
        }
    });
});
