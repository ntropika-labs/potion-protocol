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
    RoundsVaultExchanger,
} from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates } from "hedging-vault-sdk";
import { getEncodedSwapPath } from "../utils/UniswapV3Utils";
import { fastForwardChain, DAY_IN_SECONDS } from "../utils/BlockchainUtils";
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

interface TestConditions {
    uniswapEnterPositionInputAmount: BigNumber;
    uniswapExitPositionOutputAmount: BigNumber;
    potionBuyInfo: PotionBuyInfoStruct;
    swapInfoEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapInfoExitPosition: IUniswapV3Oracle.SwapInfoStruct;
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

    const amountProtected = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingPercentage);
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
    swapInfoEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapInfoExitPosition: IUniswapV3Oracle.SwapInfoStruct;
}> {
    // Set the Uniswap route info
    const swapInfoEnterPosition: IUniswapV3Oracle.SwapInfoStruct = {
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
    const swapInfoExitPosition: IUniswapV3Oracle.SwapInfoStruct = {
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

    return { swapInfoEnterPosition, swapInfoExitPosition };
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

    const { swapInfoEnterPosition, swapInfoExitPosition } = await getSwapInfo(
        tEnv,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );

    /*
        COLLATERAL
    */
    const amountProtected = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingPercentage);
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
            // await tEnv.USDC.connect(ownerAccount).mint(action.address, payoutInUSDC);
        });
    });

    return {
        uniswapEnterPositionInputAmount,
        uniswapExitPositionOutputAmount,
        potionBuyInfo,
        swapInfoEnterPosition,
        swapInfoExitPosition,
        underlyingAssetExitPriceInUSD,
        expirationTimestamp,
    };
}

/**
    @notice Hedging Vault basic flow unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("DeferredDepositsWithdrawals", function () {
    // let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let action: PotionBuyAction;
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
        action = tEnv.potionBuyAction;
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
        expect(await vault.getActionsLength()).to.equal(1);
        expect(await vault.getAction(0)).to.equal(action.address);

        // Principal Percentages
        const principalPercentages = await vault.getPrincipalPercentages();
        expect(principalPercentages.length).to.equal(1);
        expect(principalPercentages[0]).to.equal(tEnv.hedgingPercentage);
        expect(await vault.getPrincipalPercentage(0)).to.equal(tEnv.hedgingPercentage);
    });

    it("DDW0002 - Potion Buy Action Default Value", async function () {
        // Roles
        expect(await action.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await action.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await action.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await action.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await action.getRoleMemberCount(Roles.Strategist)).to.equal(1);
        expect(await action.getRoleMember(Roles.Strategist, 0)).to.equal(tEnv.strategistAddress);
        expect(await action.getRoleMemberCount(Roles.Vault)).to.equal(1);
        expect(await action.getRoleMember(Roles.Vault, 0)).to.equal(tEnv.investmentVault.address);

        expect(await action.getRoleMemberCount(Roles.Investor)).to.equal(0);

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

    it("DDW0003 - Rounds Input Vault Default Value", async function () {
        // Roles
        expect(await roundsInputVault.getRoleMemberCount(Roles.Admin)).to.equal(1);
        expect(await roundsInputVault.getRoleMember(Roles.Admin, 0)).to.equal(tEnv.adminAddress);
        expect(await roundsInputVault.getRoleMemberCount(Roles.Operator)).to.equal(1);
        expect(await roundsInputVault.getRoleMember(Roles.Operator, 0)).to.equal(tEnv.hedgingVaultOrchestrator.address);
        expect(await roundsInputVault.getRoleMemberCount(Roles.Strategist)).to.equal(0);
        expect(await roundsInputVault.getRoleMemberCount(Roles.Vault)).to.equal(0);
        expect(await action.getRoleMemberCount(Roles.Investor)).to.equal(0);

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
            tCond.swapInfoExitPosition,
            tCond.potionBuyInfo,
            tCond.swapInfoEnterPosition,
        );
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        //const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the action
        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        const currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.swapInfoEnterPosition, currentSwapInfo);

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
        tx = await orchestrator.nextRound(tCond.swapInfoExitPosition, tCond.potionBuyInfo, tCond.swapInfoEnterPosition);
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        // For some reason 2 blocks are mined with the last transaction, so we need to
        // substract 1 from the current block
        //const cycleStartTimestamp = (await getCurrentTimestamp()) - 1;

        // Check that the helper set the correct info in the action
        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        const currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.swapInfoEnterPosition, currentSwapInfo);

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

        tx = await orchestrator.nextRound(tCond.swapInfoExitPosition, nextPotionBuyInfo, tCond.swapInfoEnterPosition);
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
        tx = await orchestrator.nextRound(tCond.swapInfoExitPosition, tCond.potionBuyInfo, tCond.swapInfoEnterPosition);
        expect(tx).to.emit(orchestrator, "NextRound").withArgs(currentRound.add(1));

        // Check that the helper set the correct info in the action
        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset.address,
            tCond.expirationTimestamp,
        );

        expectSolidityDeepCompare(tCond.potionBuyInfo, currentPotionBuyInfo);

        const currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset.address, tEnv.USDC.address);

        expectSolidityDeepCompare(tCond.swapInfoEnterPosition, currentSwapInfo);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // Check balances
        expect(await tEnv.underlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await tEnv.underlyingAsset.balanceOf(action.address)).to.equal(
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

        tx = await orchestrator.nextRound(tCond.swapInfoExitPosition, nextPotionBuyInfo, tCond.swapInfoEnterPosition);
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
