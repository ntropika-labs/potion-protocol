import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Signer } from "ethers";

import { CurveCriteria, HyperbolicCurve } from "contracts-math";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/TestingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";

import { InvestmentVault, PotionBuyAction, IPotionLiquidityPool, IUniswapV3Oracle } from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates, OTOKEN_DECIMALS, USDC_DECIMALS, toSolidityPercentage } from "hedging-vault-sdk";
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
    @notice Hedging Vault correcting factor tests 
    
    @author Roberto Cano <robercano>
 */
describe("CorrectingFactor", function () {
    let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let action: PotionBuyAction;
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

        // Modify the hedging rate to 80% to test the hedging rate slippage
        deploymentConfig.hedgingRate = toSolidityPercentage(80.0);

        tEnv = await deployTestingEnv(deploymentConfig);

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
    });

    it("CF0001 - Potion Buy Action Hedging Rate Config", async function () {
        expect(await action.hedgingRate()).to.equal(tEnv.hedgingRate);
        expect(await action.hedgingRateSlippage()).to.equal(tEnv.hedgingRateSlippage);
    });

    it("CF0002 - Full cycle with Hedging Rate Slippage", async function () {
        /**
            TEST SETTINGS
        */
        const UnderlyingDecimals = await tEnv.underlyingAsset.decimals();

        const underlyingPriceInUSD = 1000.0;
        const USDCPriceInUSD = 1.0;

        const underlyingPriceInUSDC = HedgingVaultUtils.parsePriceInUSDC(underlyingPriceInUSD);
        const USDCPriceInUSDC = HedgingVaultUtils.parsePriceInUSDC(USDCPriceInUSD);

        const amountToBeInvested = HedgingVaultUtils.parseAmount("20");

        const curve = new HyperbolicCurve(0.1, 0.1, 0.1, 0.1);
        const criteria = new CurveCriteria(tEnv.underlyingAsset.address, tEnv.USDC.address, true, 120, 365); // PUT, max 120% strike & max 1 year duration

        const lpAddress = (await ethers.getSigners())[0].address;
        const pool = await tEnv.potionLiquidityPoolManager.lpPools(lpAddress, 0);

        /*
            COLLATERAL
        */
        const initialAmountToBeProtected = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingRate);
        const initialAmountToBeProtectedInUSDC = HedgingVaultUtils.convertAmountToUSDC(
            initialAmountToBeProtected,
            UnderlyingDecimals,
            underlyingPriceInUSDC,
            USDCPriceInUSDC,
        );

        const initialCollateralInUSDC = HedgingVaultUtils.applyPercentage(
            initialAmountToBeProtectedInUSDC,
            tEnv.strikePercentage,
        );

        const initialPremiumInUSDC = calculatePremium(pool, curve, initialCollateralInUSDC);

        // Get the new order size, based on the initial premium
        const { effectiveVaultSize } = HedgingVaultUtils.calculateOrderSize(
            amountToBeInvested,
            UnderlyingDecimals,
            tEnv.hedgingRate,
            tEnv.strikePercentage,
            underlyingPriceInUSDC,
            initialPremiumInUSDC,
        );

        const amountToBeProtected = HedgingVaultUtils.applyPercentage(effectiveVaultSize, tEnv.hedgingRate);
        const amountToBeProtectedInUSDC = HedgingVaultUtils.convertAmountToUSDC(
            amountToBeProtected,
            UnderlyingDecimals,
            underlyingPriceInUSDC,
            USDCPriceInUSDC,
        );
        const collateralInUSDC = HedgingVaultUtils.applyPercentage(amountToBeProtectedInUSDC, tEnv.strikePercentage);
        const expectedPremiumInUSDC = calculatePremium(pool, curve, collateralInUSDC);

        const maxPremiumWithSlippageInUSDC = HedgingVaultUtils.addPercentage(
            expectedPremiumInUSDC,
            tEnv.premiumSlippage,
        );

        const strikePriceInUSDC = HedgingVaultUtils.applyPercentage(underlyingPriceInUSDC, tEnv.strikePercentage);
        const nextCycleStartTimestamp = await action.nextCycleStartTimestamp();
        const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

        const expectedPremiumInUnderlying = HedgingVaultUtils.convertAmount(
            maxPremiumWithSlippageInUSDC,
            UnderlyingDecimals,
            USDC_DECIMALS,
            USDCPriceInUSDC,
            underlyingPriceInUSDC,
        );
        const uniswapEnterPositionInputAmount = HedgingVaultUtils.addPercentage(
            expectedPremiumInUnderlying,
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
                ).transferFrom(action.address, tEnv.potionLiquidityPoolManager.address, expectedPremiumInUSDC);
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

        const orderSizeInOtokens = HedgingVaultUtils.convertAmount(
            effectiveVaultSize,
            OTOKEN_DECIMALS,
            UnderlyingDecimals,
        );

        // The Potion Protocol sample deployment creates some pools of capitals using the default ethers signers. We
        // use the first pool of capital and copy its curve and criteria here. The lp address is the address of the
        // deployer of the contracts (i.e.: signer[0]). And the pool id is always 0
        const counterparties: IPotionLiquidityPool.CounterpartyDetailsStruct[] = [
            {
                lp: lpAddress,
                poolId: 0,
                curve: curve.asSolidityStruct(),
                criteria: criteria,
                orderSizeInOtokens: orderSizeInOtokens,
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
        const underlyingPriceInOpynFormat = HedgingVaultUtils.convertAmount(underlyingPriceInUSDC, 8, USDC_DECIMALS);
        const USDCPriceInOpynFormat = HedgingVaultUtils.convertAmount(USDCPriceInUSDC, 8, USDC_DECIMALS);

        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingPriceInOpynFormat);
        await tEnv.opynOracle.setStablePrice(tEnv.USDC.address, USDCPriceInOpynFormat);

        // Set the Uniswap route info
        const swapInfoEnterPosition: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.underlyingAsset.address,
            outputToken: tEnv.USDC.address,
            expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(
                underlyingPriceInUSD,
                USDCPriceInUSD,
                UnderlyingDecimals,
                USDC_DECIMALS,
            ),
            swapPath: getEncodedSwapPath([tEnv.underlyingAsset.address, tEnv.USDC.address]),
        };

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);

        // Emulate what the orchestrator is doing to enter a position
        await action.connect(ownerAccount).setPotionBuyInfo(potionBuyInfo);
        await action.connect(ownerAccount).setSwapInfo(swapInfoEnterPosition);
        await vault.connect(ownerAccount).enterPosition();

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the action
        const currentPotionBuyInfo = await action.getPotionBuyInfo(tEnv.underlyingAsset.address, expirationTimestamp);

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
        const underlyingAssetExitPriceInUSD = HedgingVaultUtils.applyPercentage(
            underlyingPriceInUSDC,
            underlyingAssetPricePercentage,
        );
        const payoutInUSDC = HedgingVaultUtils.applyPercentage(amountToBeProtectedInUSDC, exitPriceDecreasePercentage);

        // TODO: When using the mocked version of the Potion Liquidity manager the premium is not transferred from the
        // TODO: action contract to the Potion Liquidity Manager contract. In the same way, the Opyn Controller mock is
        // TODO: not transferring the payout to the action contract when exiting the position. In the lines below we
        // TODO: account for this to know how much USDC will be in the action after the payout
        let totalUSDCInActionAfterPayout: BigNumber;
        if (network.name === "hardhat") {
            totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC);
        } else {
            totalUSDCInActionAfterPayout = payoutInUSDC
                .add(maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC))
                .sub(BigNumber.from("372029887"));
        }

        const extraUnderlyingAssetInVaultAfterPayout = HedgingVaultUtils.convertAmount(
            totalUSDCInActionAfterPayout,
            UnderlyingDecimals,
            USDC_DECIMALS,
            USDCPriceInUSDC,
            underlyingPriceInUSDC,
        );

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
        const _totalUSDCInActionAfterPayout = HedgingVaultUtils.convertAmountToUSDC(
            _extraUnderlyingAssetInVaultAfterPayout,
            UnderlyingDecimals,
            underlyingPriceInUSDC,
            USDCPriceInUSDC,
        );

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
                // await tEnv.USDC.connect(ownerAccount).mint(action.address, payoutInUSDC);
            });
        });

        // Set the Uniswap route info
        const swapInfoExitPosition: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.USDC.address,
            outputToken: tEnv.underlyingAsset.address,
            expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(USDCPriceInUSD, underlyingPriceInUSD, 6, 18),
            swapPath: getEncodedSwapPath([tEnv.USDC.address, tEnv.underlyingAsset.address]),
        };

        // Set the Opyn oracle asset price for the underlying asset
        await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetExitPriceInUSD);

        // Set the dispute period as over, this only works with the mock contract
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.underlyingAsset.address, expirationTimestamp, true);
        await tEnv.opynMockOracle.setIsDisputePeriodOver(tEnv.USDC.address, expirationTimestamp, true);

        // Exit the position
        await fastForwardChain(DAY_IN_SECONDS);

        // Emulate what the orchestrator is doing
        await action.connect(ownerAccount).setSwapInfo(swapInfoExitPosition);
        await vault.connect(ownerAccount).exitPosition();

        const cycleEndTimestamp = await getCurrentTimestamp();

        // Check that the operator helper set the uniswap info correctly
        currentSwapInfo = await action.getSwapInfo(tEnv.USDC.address, tEnv.underlyingAsset.address);

        expectSolidityDeepCompare(swapInfoExitPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Assets balances
        ifMocksEnabled(async () => {
            expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(
                amountToBeInvested.sub(uniswapEnterPositionInputAmount).add(uniswapExitPositionOutputAmount),
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
