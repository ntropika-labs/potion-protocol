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
    RoundsInputVault,
    RoundsOutputVault,
    HedgingVaultOrchestrator,
    SwapToUSDCAction,
    MockPotionLiquidityPool,
} from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates } from "hedging-vault-sdk";
import { getEncodedSwapPath } from "../utils/uniswapV3Utils";
import { fastForwardChain, DAY_IN_SECONDS } from "../utils/blockchainUtils";
import { expectSolidityDeepCompare } from "../utils/chaiHelpers";
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
import { TASK_FLATTEN_GET_DEPENDENCY_GRAPH } from "hardhat/builtin-tasks/task-names";

interface TestConditions {
    uniswapEnterPositionInputAmount: BigNumber;
    uniswapExitPositionOutputAmount: BigNumber;
    potionBuyInfo: PotionBuyInfoStruct;
    potionBuySwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    potionBuySwapExitPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCSwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCSwapExitPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCAmountUSDC: BigNumber;
    underlyingAssetExitPriceInUSD: BigNumber;
    expirationTimestamp: BigNumber;
}

async function getPotionBuyInfo(
    tEnv: TestingEnvironmentDeployment,
    amountToBeInvested: BigNumber,
    underlyingAssetPriceInUSD: BigNumber,
    USDCPriceInUSD: BigNumber,
): Promise<{ potionBuyInfo: PotionBuyInfoStruct; expectedPremiumInUSDC: BigNumber }> {
    // The Potion Protocol sample deployment creates some pools of capitals using the default ethers signers. We
    // use the first pool of capital and copy its curve and criteria here. The lp address is the address of the
    // deployer of the contracts (i.e.: signer[0]). And the pool id is always 0
    const amountProtected = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingRate);
    const amountProtectedInUSDC = amountProtected
        .mul(underlyingAssetPriceInUSD)
        .div(USDCPriceInUSD)
        .div(BigNumber.from(1000000000000)); // USDC only uses 6 decimals, so divide by 10**(18 - 6)

    const collateralRequiredInUSDC = HedgingVaultUtils.applyPercentage(amountProtectedInUSDC, tEnv.strikePercentage);

    const curve = new HyperbolicCurve(0.1, 0.1, 0.1, 0.1);
    const criteria = new CurveCriteria(tEnv.underlyingAsset.address, tEnv.USDC.address, true, 120, 365); // PUT, max 120% strike & max 1 year duration

    const lpAddress = (await ethers.getSigners())[0].address;
    const pool = await tEnv.potionLiquidityPoolManager.lpPools(lpAddress, 0);
    const expectedPremiumInUSDC = calculatePremium(pool, curve, collateralRequiredInUSDC);
    const otokensAmount = amountToBeInvested.div(10000000000); // oToken uses 8 decimals
    const strikePriceInUSDC = HedgingVaultUtils.applyPercentage(underlyingAssetPriceInUSD, tEnv.strikePercentage);
    const nextCycleStartTimestamp = await tEnv.potionBuyAction.nextCycleStartTimestamp();
    const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

    const potionOtokenAddress = await tEnv.opynFactory.getTargetOtokenAddress(
        tEnv.underlyingAsset.address,
        tEnv.USDC.address,
        tEnv.USDC.address,
        strikePriceInUSDC,
        expirationTimestamp,
        true,
    );

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

    return { potionBuyInfo, expectedPremiumInUSDC };
}

async function getSwapInfo(
    tEnv: TestingEnvironmentDeployment,
    underlyingAssetPriceInUSD: BigNumber,
    USDCPriceInUSD: BigNumber,
): Promise<{
    potionBuySwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    potionBuySwapExitPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCSwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCSwapExitPosition: IUniswapV3Oracle.SwapInfoStruct;
}> {
    // Uniswap route info for Potion Buy
    const potionBuySwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct = {
        inputToken: tEnv.underlyingAsset.address,
        outputToken: tEnv.USDC.address,
        expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(
            Number(ethers.utils.formatUnits(underlyingAssetPriceInUSD, 8)),
            Number(ethers.utils.formatUnits(USDCPriceInUSD, 8)),
            18,
            6,
        ),
        swapPath: getEncodedSwapPath([tEnv.underlyingAsset.address, tEnv.USDC.address]),
    };

    // Set the Uniswap route info
    const potionBuySwapExitPosition: IUniswapV3Oracle.SwapInfoStruct = {
        inputToken: tEnv.USDC.address,
        outputToken: tEnv.underlyingAsset.address,
        expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(
            Number(ethers.utils.formatUnits(USDCPriceInUSD, 8)),
            Number(ethers.utils.formatUnits(underlyingAssetPriceInUSD, 8)),
            6,
            18,
        ),
        swapPath: getEncodedSwapPath([tEnv.USDC.address, tEnv.underlyingAsset.address]),
    };

    // Uniswap route info for Swap To USDC
    const swapToUSDCSwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct = {
        inputToken: tEnv.underlyingAsset.address,
        outputToken: tEnv.USDC.address,
        expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(
            Number(ethers.utils.formatUnits(underlyingAssetPriceInUSD, 8)),
            Number(ethers.utils.formatUnits(USDCPriceInUSD, 8)),
            18,
            6,
        ),
        swapPath: getEncodedSwapPath([tEnv.underlyingAsset.address, tEnv.USDC.address]),
    };

    // Set the Uniswap route info
    const swapToUSDCSwapExitPosition: IUniswapV3Oracle.SwapInfoStruct = {
        inputToken: tEnv.USDC.address,
        outputToken: tEnv.underlyingAsset.address,
        expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(
            Number(ethers.utils.formatUnits(USDCPriceInUSD, 8)),
            Number(ethers.utils.formatUnits(underlyingAssetPriceInUSD, 8)),
            6,
            18,
        ),
        swapPath: getEncodedSwapPath([tEnv.USDC.address, tEnv.underlyingAsset.address]),
    };

    return {
        potionBuySwapEnterPosition,
        potionBuySwapExitPosition,
        swapToUSDCSwapEnterPosition,
        swapToUSDCSwapExitPosition,
    };
}

async function setupTestConditions(
    tEnv: TestingEnvironmentDeployment,
    underlyingAssetPriceInUSD: BigNumber,
    USDCPriceInUSD: BigNumber,
    amountToBeInvested: BigNumber,
): Promise<TestConditions> {
    const { potionBuyInfo, expectedPremiumInUSDC } = await getPotionBuyInfo(
        tEnv,
        amountToBeInvested,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );

    const {
        potionBuySwapEnterPosition,
        potionBuySwapExitPosition,
        swapToUSDCSwapEnterPosition,
        swapToUSDCSwapExitPosition,
    } = await getSwapInfo(tEnv, underlyingAssetPriceInUSD, USDCPriceInUSD);

    /*
        COLLATERAL
    */
    const amountProtected = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingRate);
    const amountProtectedInUSDC = amountProtected
        .mul(underlyingAssetPriceInUSD)
        .div(USDCPriceInUSD)
        .div(BigNumber.from(1000000000000)); // USDC only uses 6 decimals, so divide by 10**(18 - 6)

    const maxPremiumWithSlippageInUSDC = HedgingVaultUtils.addPercentage(expectedPremiumInUSDC, tEnv.premiumSlippage);
    const nextCycleStartTimestamp = await tEnv.potionBuyAction.nextCycleStartTimestamp();
    const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

    const uniswapEnterPositionInputAmount = HedgingVaultUtils.addPercentage(
        maxPremiumWithSlippageInUSDC
            .mul(BigNumber.from(1000000000000))
            .mul(USDCPriceInUSD)
            .div(underlyingAssetPriceInUSD),
        tEnv.swapSlippage,
    );

    const exitPriceDecreasePercentage = ethers.utils.parseUnits("10", 6);
    const underlyingAssetPricePercentage = tEnv.strikePercentage.sub(exitPriceDecreasePercentage);
    const underlyingAssetExitPriceInUSD = HedgingVaultUtils.applyPercentage(
        underlyingAssetPriceInUSD,
        underlyingAssetPricePercentage,
    );
    const payoutInUSDC = HedgingVaultUtils.applyPercentage(amountProtectedInUSDC, exitPriceDecreasePercentage);

    // TODO: when using the mocked version of the vault, the premium is never sent to the Potion Protocol,
    // TODO: so the maximum premium remains in the vault
    let totalUSDCInActionAfterPayout: BigNumber;
    if (network.name === "hardhat") {
        totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC);
    } else {
        totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC;
    }

    const extraUnderlyingAssetInVaultAfterPayout = totalUSDCInActionAfterPayout
        .mul(BigNumber.from(1000000000000))
        .mul(USDCPriceInUSD)
        .div(underlyingAssetPriceInUSD);

    const uniswapExitPositionOutputAmount = HedgingVaultUtils.subtractPercentage(
        extraUnderlyingAssetInVaultAfterPayout,
        tEnv.swapSlippage,
    );

    // Set the Opyn oracle asset price for the underlying asset
    await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetPriceInUSD);
    await tEnv.opynOracle.setStablePrice(tEnv.USDC.address, USDCPriceInUSD);

    // Setup the mocks
    ifMocksEnabled(() => {
        asMock(tEnv.potionLiquidityPoolManager).buyOtokens.returns(async () => {
            // Transfer
            await tEnv.USDC.connect(asMock(tEnv.potionLiquidityPoolManager).wallet as unknown as Signer).transferFrom(
                tEnv.potionBuyAction.address,
                tEnv.potionLiquidityPoolManager.address,
                expectedPremiumInUSDC,
            );
            return expectedPremiumInUSDC;
        });
        asMock(tEnv.opynController)
            .isSettlementAllowed.whenCalledWith(potionBuyInfo.targetPotionAddress)
            .returns(false);

        asMock(tEnv.USDC).approve.reset();
        asMock(tEnv.USDC).approve.returns(true);

        asMock(tEnv.underlyingAsset).approve.reset();
        asMock(tEnv.underlyingAsset).approve.returns(true);

        asMock(tEnv.opynController).isSettlementAllowed.whenCalledWith(potionBuyInfo.targetPotionAddress).returns(true);
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

    // Swap To USDC swapped amount
    const underlyingDecimals = await tEnv.underlyingAsset.decimals();
    const amountToBeInvestedAfterSlippage = HedgingVaultUtils.subtractPercentage(amountToBeInvested, tEnv.swapSlippage);
    const swapToUSDCAmountUSDC = HedgingVaultUtils.convertAmountToUSDC(
        amountToBeInvestedAfterSlippage,
        underlyingDecimals,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );

    return {
        uniswapEnterPositionInputAmount,
        uniswapExitPositionOutputAmount,
        potionBuyInfo,
        potionBuySwapEnterPosition,
        potionBuySwapExitPosition,
        swapToUSDCSwapEnterPosition,
        swapToUSDCSwapExitPosition,
        swapToUSDCAmountUSDC,
        underlyingAssetExitPriceInUSD,
        expirationTimestamp,
    };
}

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
        expect(await tEnv.underlyingAsset.balanceOf(swapUSDC.address)).to.equal(0);
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
