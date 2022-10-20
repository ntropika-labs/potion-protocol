import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Signer } from "ethers";

import { CurveCriteria, HyperbolicCurve } from "contracts-math";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/TestingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";

import {
    InvestmentVault,
    PotionBuyAction,
    IPotionLiquidityPool,
    IUniswapV3Oracle,
    SwapToUSDCAction,
} from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates } from "hedging-vault-sdk";
import { getEncodedSwapPath } from "../utils/UniswapV3Utils";
import { fastForwardChain, DAY_IN_SECONDS, getCurrentTimestamp } from "../utils/BlockchainUtils";
import { expectSolidityDeepCompare } from "../utils/ExpectDeepUtils";
import * as HedgingVaultUtils from "hedging-vault-sdk";
import { Roles } from "hedging-vault-sdk";

import {
    ifMocksEnabled,
    asMock,
    Deployments,
    showConsoleLogs,
    ProviderTypes,
    DeploymentNetwork,
    DeploymentFlags,
} from "contracts-utils";
import { calculatePremium } from "../../scripts/test/PotionPoolsUtils";

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
        ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        const deploymentType = Deployments.getType();
        deploymentConfig = getDeploymentConfig(deploymentType);

        tEnv = await deployTestingEnv(deploymentConfig);

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
    });

    it("HVB0002 - Potion Buy Action Default Value", async function () {
        // Roles
        expect(await potionBuy.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await potionBuy.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await potionBuy.getRoleMemberCount(Roles.Operator)).to.equal(2);
        expect(await potionBuy.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
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
    it("HVB0004 - Full cycle", async function () {
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
        const amountProtected = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingRate);
        const amountProtectedInUSDC = amountProtected
            .mul(underlyingAssetPriceInUSDbn)
            .div(USDCPriceInUSDbn)
            .div(BigNumber.from(1000000000000)); // USDC only uses 6 decimals, so divide by 10**(18 - 6)

        const collateralRequiredInUSDC = HedgingVaultUtils.applyPercentage(
            amountProtectedInUSDC,
            tEnv.strikePercentage,
        );

        const curve = new HyperbolicCurve(0.1, 0.1, 0.1, 0.1);
        const criteria = new CurveCriteria(tEnv.underlyingAsset.address, tEnv.USDC.address, true, 120, 365); // PUT, max 120% strike & max 1 year duration

        const lpAddress = (await ethers.getSigners())[0].address;
        const pool = await tEnv.potionLiquidityPoolManager.lpPools(lpAddress, 0);
        const expectedPremiumInUSDC = calculatePremium(pool, curve, collateralRequiredInUSDC);

        const maxPremiumWithSlippageInUSDC = HedgingVaultUtils.addPercentage(
            expectedPremiumInUSDC,
            tEnv.premiumSlippage,
        );

        const strikePriceInUSDC = HedgingVaultUtils.applyPercentage(underlyingAssetPriceInUSDbn, tEnv.strikePercentage);
        const nextCycleStartTimestamp = await potionBuy.nextCycleStartTimestamp();
        const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

        const uniswapEnterPositionInputAmount = HedgingVaultUtils.addPercentage(
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
                await tEnv.USDC.connect(
                    asMock(tEnv.potionLiquidityPoolManager).wallet as unknown as Signer,
                ).transferFrom(potionBuy.address, tEnv.potionLiquidityPoolManager.address, expectedPremiumInUSDC);
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
        };

        // UNISWAP INFO

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetPriceInUSDbn);
        await tEnv.opynOracle.setStablePrice(tEnv.USDC.address, USDCPriceInUSDbn);

        // Set the Uniswap route info
        const swapInfoEnterPosition: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.underlyingAsset.address,
            outputToken: tEnv.USDC.address,
            expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(underlyingAssetPriceInUSD, USDCPriceInUSD, 18, 6),
            swapPath: getEncodedSwapPath([tEnv.underlyingAsset.address, tEnv.USDC.address]),
        };

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);

        // Emulate what the orchestrator is doing to enter a position
        await potionBuy.connect(ownerAccount).setPotionBuyInfo(potionBuyInfo);
        await potionBuy.connect(ownerAccount).setSwapInfo(swapInfoEnterPosition);
        await vault.connect(ownerAccount).enterPosition();

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the potionBuy
        const currentPotionBuyInfo = await potionBuy.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            expirationTimestamp,
        );

        expectSolidityDeepCompare(potionBuyInfo, currentPotionBuyInfo);

        let currentSwapInfo = await potionBuy.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(swapInfoEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the potionBuy
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(potionBuy.address)).to.equal(
            amountToBeInvested.sub(uniswapEnterPositionInputAmount),
        );

        /*
            EXIT POSITION
        */

        // Use the strike percent and reduce it by 10% to get the exit price
        const exitPriceDecreasePercentage = ethers.utils.parseUnits("10", 6);
        const underlyingAssetPricePercentage = tEnv.strikePercentage.sub(exitPriceDecreasePercentage);
        const underlyingAssetExitPriceInUSDbn = HedgingVaultUtils.applyPercentage(
            underlyingAssetPriceInUSDbn,
            underlyingAssetPricePercentage,
        );
        const payoutInUSDC = HedgingVaultUtils.applyPercentage(amountProtectedInUSDC, exitPriceDecreasePercentage);

        // TODO: When using the mocked version of the Potion Liquidity manager the premium is not transferred from the
        // TODO: potionBuy contract to the Potion Liquidity Manager contract. In the same way, the Opyn Controller mock is
        // TODO: not transferring the payout to the potionBuy contract when exiting the position. In the lines below we
        // TODO: account for this to know how much USDC will be in the potionBuy after the payout
        let totalUSDCInActionAfterPayout: BigNumber;
        if (network.name === "hardhat") {
            totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC);
        } else {
            totalUSDCInActionAfterPayout = payoutInUSDC
                .add(maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC))
                .sub(BigNumber.from("372029887"));
        }

        const extraUnderlyingAssetInVaultAfterPayout = totalUSDCInActionAfterPayout
            .mul(BigNumber.from(1000000000000))
            .mul(USDCPriceInUSDbn)
            .div(underlyingAssetPriceInUSDbn);

        const uniswapExitPositionOutputAmount = HedgingVaultUtils.subtractPercentage(
            extraUnderlyingAssetInVaultAfterPayout,
            tEnv.swapSlippage,
        );

        const difference = BigNumber.from("20298168106620000000").sub(BigNumber.from("19933578819320000000"));
        const _uniswapExitPositionOutputAmount = uniswapExitPositionOutputAmount.sub(difference);

        const _extraUnderlyingAssetInVaultAfterPayout = HedgingVaultUtils.addPercentage(
            _uniswapExitPositionOutputAmount,
            tEnv.swapSlippage,
        );
        const _totalUSDCInActionAfterPayout = _extraUnderlyingAssetInVaultAfterPayout
            .mul(underlyingAssetPriceInUSDbn)
            .div(USDCPriceInUSDbn)
            .div(BigNumber.from(1000000000000));

        // Setup the mocks
        ifMocksEnabled(() => {
            asMock(tEnv.opynController).isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(true);
            asMock(tEnv.opynController).getPayout.returns(() => {
                return payoutInUSDC;
            });

            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            asMock(tEnv.opynController).operate.returns(async (args: any) => {
                if (args[0][0].actionType !== 8) {
                    return;
                }
                // TODO: This is failing and I'm not sure if it is a Smock problem or a logic
                // TODO: problem in the tests. Talking to the smock team it seems likely that it
                // TODO: is a problem with the smock library and calling the EVM from an async callback
                // await tEnv.USDC.connect(ownerAccount).mint(potionBuy.address, payoutInUSDC);
            });
        });

        // Set the Uniswap route info
        const swapInfoExitPosition: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.USDC.address,
            outputToken: tEnv.underlyingAsset.address,
            expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(USDCPriceInUSD, underlyingAssetPriceInUSD, 6, 18),
            swapPath: getEncodedSwapPath([tEnv.USDC.address, tEnv.underlyingAsset.address]),
        };

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetExitPriceInUSDbn);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, expirationTimestamp, true);

        // Exit the position
        await fastForwardChain(DAY_IN_SECONDS);

        // Emulate what the orchestrator is doing
        await potionBuy.connect(ownerAccount).setSwapInfo(swapInfoExitPosition);
        await vault.connect(ownerAccount).exitPosition();

        const cycleEndTimestamp = await getCurrentTimestamp();

        // Check that the operator helper set the uniswap info correctly
        currentSwapInfo = await potionBuy.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(swapInfoExitPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await potionBuy.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Assets balances
        ifMocksEnabled(async () => {
            expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(
                amountToBeInvested.sub(uniswapEnterPositionInputAmount).add(uniswapExitPositionOutputAmount),
            );
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
                maxPremiumWithSlippageInUSDC,
            );
            expect(asMock(tEnv.USDC).approve.atCall(1)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                totalUSDCInActionAfterPayout,
            );

            // Underlying Asset calls
            expect(asMock(tEnv.underlyingAsset).approve).to.have.callCount(4);
            expect(asMock(tEnv.underlyingAsset).approve.atCall(1)).to.have.been.calledWith(
                potionBuy.address,
                amountToBeInvested,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(2)).to.have.been.calledWith(
                tEnv.uniswapV3SwapRouter.address,
                uniswapEnterPositionInputAmount,
            );
            expect(asMock(tEnv.underlyingAsset).approve.atCall(3)).to.have.been.calledWith(potionBuy.address, 0);

            // Uniswap V3 Router calls
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactOutput.getCall(0).args[0]).to.be.deep.equal([
                swapInfoEnterPosition.swapPath,
                potionBuy.address,
                tEnv.maxSwapDurationSecs.add(cycleStartTimestamp),
                BigNumber.from(maxPremiumWithSlippageInUSDC),
                BigNumber.from(uniswapEnterPositionInputAmount),
            ]);
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput).to.have.been.calledOnce;
            expect(asMock(tEnv.uniswapV3SwapRouter).exactInput.getCall(0).args[0]).to.be.deep.equal([
                swapInfoExitPosition.swapPath,
                potionBuy.address,
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
