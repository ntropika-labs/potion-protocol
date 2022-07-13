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
    IOpynFactory,
    IERC20,
    IOpynController,
    IUniswapV3Oracle,
} from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { LifecycleStates } from "../utils/LifecycleStates";
import { MockContract, FakeContract } from "@defi-wonderland/smock";
import { BigNumber } from "ethers";
import { toPRBMath } from "../utils/PRBMathUtils";
import { getEncodedSwapPath } from "../utils/UniswapV3Utils";
import { fastForwardChain, DAY_IN_SECONDS } from "../utils/BlockchainUtils";
import { expectSolidityDeepCompare } from "../utils/ExpectDeepUtils";
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
    let mockUnderlyingAsset: MockContract<ERC20PresetMinterPauser>;
    let tEnv: TestingEnvironmentDeployment;
    let fakePotionProtocol: FakeContract<IPotionLiquidityPool>;
    let fakeUniswapRouter: FakeContract<ISwapRouter>;
    let fakeOpynController: FakeContract<IOpynController>;
    let fakeOpynFactory: FakeContract<IOpynFactory>;
    let mockUSDC: MockContract<IERC20>;

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
        if (!tEnv.fakeOpynController) {
            throw new Error("Fake Opyn Controller protocol not found");
        }
        if (!tEnv.fakeOpynFactory) {
            throw new Error("Fake Opyn Factory protocol not found");
        }
        if (!tEnv.mockUnderlyingAsset) {
            throw new Error("Underlying asset not mocked");
        }

        if (!tEnv.mockUSDC) {
            throw new Error("USDC not mocked");
        }

        vault = tEnv.investmentVault;
        action = tEnv.potionBuyAction;
        fakePotionProtocol = tEnv.fakePotionProtocol;
        fakeUniswapRouter = tEnv.fakeUniswapV3;
        fakeOpynController = tEnv.fakeOpynController;
        fakeOpynFactory = tEnv.fakeOpynFactory;

        mockUSDC = tEnv.mockUSDC;
        mockUnderlyingAsset = tEnv.mockUnderlyingAsset;
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
        await mockUnderlyingAsset.mint(investorAccount.address, 20000);
        expect(await mockUnderlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);

        await mockUnderlyingAsset.connect(investorAccount).approve(vault.address, 20000);
        expect(
            await mockUnderlyingAsset.connect(investorAccount).allowance(investorAccount.address, vault.address),
        ).to.equal(20000);

        // Deposit and check received shares
        await vault.connect(investorAccount).deposit(20000, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(20000);
        expect(await mockUnderlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

        // Withdraw and check received assets
        await vault.connect(investorAccount).withdraw(20000, investorAccount.address, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(0);
        expect(await mockUnderlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);

        // Burn it
        await mockUnderlyingAsset.connect(investorAccount).burn(20000);
        expect(await mockUnderlyingAsset.balanceOf(investorAccount.address)).to.equal(0);
    });
    it.only("Deposit and execute investment cycle", async function () {
        const potionOtokenAddress = (await ethers.getSigners())[5].address;
        const lpAddress = (await ethers.getSigners())[6].address;

        // Configure mock and fake contracts
        fakePotionProtocol.buyOtokens.returns((args: any) => {
            return args._maxPremium;
        });
        fakeUniswapRouter.exactInput.returns((swapParams: any) => {
            return swapParams.amountOutMinimum;
        });
        fakeOpynController.isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(false);
        fakeOpynFactory.getOtoken.returns(potionOtokenAddress);
        mockUSDC.approve.returns(true);

        // Mint and approve
        await mockUnderlyingAsset.mint(investorAccount.address, 20000);
        expect(await mockUnderlyingAsset.balanceOf(investorAccount.address)).to.equal(20000);
        await mockUnderlyingAsset.connect(investorAccount).approve(vault.address, 20000);
        expect(
            await mockUnderlyingAsset.connect(investorAccount).allowance(investorAccount.address, vault.address),
        ).to.equal(20000);

        // Deposit and check received shares
        await vault.connect(investorAccount).deposit(20000, investorAccount.address);
        expect(await vault.balanceOf(investorAccount.address)).to.equal(20000);
        expect(await mockUnderlyingAsset.balanceOf(investorAccount.address)).to.equal(0);

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
                    underlyingAsset: tEnv.underlyingAsset,
                    strikeAsset: mockUSDC.address,
                    isPut: true,
                    maxStrikePercent: 99,
                    maxDurationInDays: 59,
                },
                orderSizeInOtokens: 3001,
            },
        ];

        const potionBuyInfo: PotionBuyInfoStruct = {
            targetPotionAddress: potionOtokenAddress,
            underlyingAsset: tEnv.underlyingAsset,
            strikePriceInUSDC: tEnv.strikePriceInUSDC,
            expirationTimestamp: expirationTimestamp,
            sellers: counterparties,
            expectedPremiumInUSDC: BigNumber.from("1000"),
            totalSizeInPotions: BigNumber.from("20000"),
        };

        await action.setPotionBuyInfo(potionBuyInfo);

        const currentPotionBuyInfo = await action.getPotionBuyInfo(
            tEnv.underlyingAsset,
            tEnv.strikePriceInUSDC,
            expirationTimestamp,
        );

        expectSolidityDeepCompare(potionBuyInfo, currentPotionBuyInfo);

        // Set the Uniswap route info
        const swapInfo: IUniswapV3Oracle.SwapInfoStruct = {
            inputToken: tEnv.underlyingAsset,
            outputToken: tEnv.USDC,
            expectedPriceRate: toPRBMath("5.0"),
            swapPath: getEncodedSwapPath([tEnv.underlyingAsset, tEnv.USDC]),
        };

        await action.setSwapInfo(swapInfo);

        const currentSwapInfo = await action.getSwapInfo(tEnv.underlyingAsset, tEnv.USDC);

        expectSolidityDeepCompare(swapInfo, currentSwapInfo);

        // Enter the position
        await fastForwardChain(DAY_IN_SECONDS);
        await vault.connect(ownerAccount).enterPosition();

        // Check the state
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Locked);
    });
});
