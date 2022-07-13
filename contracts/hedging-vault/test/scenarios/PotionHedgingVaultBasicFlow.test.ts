import { expect } from "chai";
import { ethers, network } from "hardhat";

import {
    getDeploymentConfig,
    deployTestingEnv,
    MockOptions,
    TestingEnvironmentDeployment,
} from "../utils/deployTestingEnv";
import { PotionHedgingVaultConfigParams } from "../../scripts/config/deployConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
    ERC20PresetMinterPauser,
    InvestmentVault,
    PotionBuyAction,
    IPotionLiquidityPool,
    ISwapRouter,
} from "../../typechain";
import { LifecycleStates } from "../utils/LifecycleStates";
import { MockContract, FakeContract } from "@defi-wonderland/smock";
/**
    @notice Hedging Vault basic flow unit tests    
    
    @author Roberto Cano <robercano>
 */
describe.only("HedgingVault", function () {
    let ownerAccount: SignerWithAddress;
    let investorAccount: SignerWithAddress;

    let deploymentConfig: PotionHedgingVaultConfigParams;
    let vault: InvestmentVault;
    let action: PotionBuyAction;
    let underlyingAsset: MockContract<ERC20PresetMinterPauser>;
    let tEnv: TestingEnvironmentDeployment;
    let fakePotionProtocol: FakeContract<IPotionLiquidityPool>;
    let fakeUniswapRouter: FakeContract<ISwapRouter>;

    before(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        deploymentConfig = getDeploymentConfig(network.name);

        const mockOptions: MockOptions = {
            mockUSDC: true,
            mockUnderlyingAsset: true,
            mockUniswapV3SwapRouter: true,
            mockPotionLiquidityPoolManager: true,
            mockOpynController: true,
            mockOpynFactory: true,
        };
        tEnv = await deployTestingEnv(deploymentConfig, mockOptions);

        if (!tEnv.fakePotionProtocol) {
            throw new Error("Fake Potion protocol not found");
        }
        if (!tEnv.fakeUniswapV3) {
            throw new Error("Fake Uniswap protocol not found");
        }

        vault = tEnv.investmentVault;
        action = tEnv.potionBuyAction;
        fakePotionProtocol = tEnv.fakePotionProtocol;
        fakeUniswapRouter = tEnv.fakeUniswapV3;

        if (!tEnv.mockUnderlyingAsset) {
            throw new Error("Underlying asset not mocked");
        }
        underlyingAsset = tEnv.mockUnderlyingAsset;
    });

    it("Vault Deployment Values", async function () {
        // Roles
        expect(await vault.getAdmin()).to.equal(tEnv.adminAddress);
        expect(await vault.getOperator()).to.equal(tEnv.operatorAddress);
        expect(await vault.getStrategist()).to.equal(tEnv.strategistAddress);

        // Underlying asset and cap
        expect(await vault.asset()).to.equal(tEnv.underlyingAsset);
        expect(await vault.getVaultCap()).to.equal(tEnv.underlyingAssetCap);

        // Emergency Lock
        expect(await vault.paused()).to.equal(false);

        // Lifecycle State
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Refunds Helper
        expect(await vault.canRefundETH()).to.equal(true);
        expect(await vault.canRefund(tEnv.underlyingAsset)).to.equal(false);

        // Fee Configuration
        expect(await vault.getManagementFee()).to.equal(tEnv.managementFee);
        expect(await vault.getPerformanceFee()).to.equal(tEnv.performanceFee);
        expect(await vault.getFeesRecipient()).to.equal(tEnv.feesRecipient);

        // Actions
        expect(await vault.getActionsLength()).to.equal(1);
        expect(await vault.getAction(0)).to.equal(action.address);
    });
    it("Action Deployment Values", async function () {
        // Roles
        expect(await action.getAdmin()).to.equal(tEnv.adminAddress);
        expect(await action.getOperator()).to.equal(tEnv.operatorAddress);
        expect(await action.getStrategist()).to.equal(tEnv.strategistAddress);

        // Emergency Lock
        expect(await action.paused()).to.equal(false);

        // Lifecycle State
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Unlocked);

        // Refunds Helper
        expect(await action.canRefundETH()).to.equal(true);
        expect(await action.canRefund(tEnv.underlyingAsset)).to.equal(false);
        expect(await action.canRefund(tEnv.USDC)).to.equal(false);

        // Uniswap helper
        expect(await action.getSwapRouter()).to.equal(tEnv.uniswapV3SwapRouter);

        // Potion Protocol helper
        expect(await action.getPotionLiquidityManager()).to.equal(tEnv.potionLiquidityPoolManager);
        expect(await action.getOpynController()).to.equal(tEnv.opynController);
        expect(await action.getUSDC()).to.equal(tEnv.USDC);

        // Action Values
        expect(await action.maxPremiumPercentage()).to.equal(tEnv.maxPremiumPercentage);
        expect(await action.premiumSlippage()).to.equal(tEnv.premiumSlippage);
        expect(await action.swapSlippage()).to.equal(tEnv.swapSlippage);
        expect(await action.maxSwapDurationSecs()).to.equal(tEnv.maxSwapDurationSecs);
        expect(await action.cycleDurationSecs()).to.equal(tEnv.cycleDurationSecs);
    });

    it("Basic Deposit/Withdrawal", async function () {
        // Mint and approve
        await underlyingAsset.mint(investorAccount.address, 20000);
        expect(await underlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);

        await underlyingAsset.connect(investorAccount).approve(vault.address, 20000);
        expect(
            await underlyingAsset.connect(investorAccount).allowance(investorAccount.address, vault.address),
        ).to.equal(20000);

        // Deposit and check received shares
        await vault.connect(investorAccount).deposit(20000, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(20000);
        expect(await underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        // Withdraw and check received assets
        await vault.connect(investorAccount).withdraw(20000, investorAccount.address, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(0);
        expect(await underlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);

        // Burn it
        await underlyingAsset.connect(investorAccount).burn(20000);
        expect(await underlyingAsset.balanceOf(investorAccount.address)).to.equal(0);
    });
});
