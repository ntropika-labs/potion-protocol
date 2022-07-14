import { expect } from "chai";
import { ethers, network } from "hardhat";

import { getDeploymentConfig, deployTestingEnv, TestingEnvironmentDeployment } from "../../scripts/test/TestingEnv";
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
import { fastForwardChain, DAY_IN_SECONDS, getNextTimestamp } from "../utils/BlockchainUtils";
import { expectSolidityDeepCompare } from "../utils/ExpectDeepUtils";
import { NetworksType } from "../../hardhat.helpers";
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
    let mockUnderlyingAsset: MockContract<ERC20PresetMinterPauser>;
    let tEnv: TestingEnvironmentDeployment;
    let fakePotionProtocol: FakeContract<IPotionLiquidityPool>;
    let fakeUniswapRouter: FakeContract<ISwapRouter>;
    let fakeOpynController: FakeContract<IOpynController>;
    let fakeOpynFactory: FakeContract<IOpynFactory>;
    let mockUSDC: MockContract<IERC20>;

    beforeEach(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        investorAccount = (await ethers.getSigners())[1];

        deploymentConfig = getDeploymentConfig(network.name as NetworksType);

        tEnv = await deployTestingEnv(deploymentConfig);

        if (!tEnv.mockPotionProtocol) {
            throw new Error("Fake Potion protocol not found");
        }
        if (!tEnv.mockUniswapV3) {
            throw new Error("Fake Uniswap protocol not found");
        }
        if (!tEnv.mockOpynController) {
            throw new Error("Fake Opyn Controller protocol not found");
        }
        if (!tEnv.mockOpynFactory) {
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
        fakePotionProtocol = tEnv.mockPotionProtocol;
        fakeUniswapRouter = tEnv.mockUniswapV3;
        fakeOpynController = tEnv.mockOpynController;
        fakeOpynFactory = tEnv.mockOpynFactory;

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
    it("Deposit and enter position", async function () {
        const potionOtokenAddress = (await ethers.getSigners())[5].address;
        const lpAddress = (await ethers.getSigners())[6].address;

        // Configure mock and fake contracts
        fakePotionProtocol.buyOtokens.returns((args: any) => {
            // This causes the potion library to not do an extra safeApprove on USDC
            // as all the allowane has been consumed
            return args._maxPremium;
        });
        fakeUniswapRouter.exactOutput.returns((args: any) => {
            // This causes the uniswap library to not do an extra safeApprove on the
            // underlying asset as all the allowance has been consumed
            return args.params.amountInMaximum;
        });
        fakeUniswapRouter.exactInput.returns((args: any) => {
            return args.params.amountOutMinimum;
        });
        fakeOpynController.isSettlementAllowed.whenCalledWith(potionOtokenAddress).returns(false);
        fakeOpynFactory.getOtoken.returns(potionOtokenAddress);
        mockUSDC.approve.returns(true);
        mockUnderlyingAsset.approve.returns(true);

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

        const nextBlockTimestamp = await getNextTimestamp();

        expect(await vault.connect(ownerAccount).enterPosition())
            .to.emit(vault.address, "InvestmentTotalTooHigh")
            .withArgs(20000, 20000);

        // Check the new state of the system
        expect(await vault.getLifecycleState()).to.equal(LifecycleStates.Locked);
        expect(await action.getLifecycleState()).to.equal(LifecycleStates.Locked);

        // These balances will not be valid if the real Uniswap and Potion protocol are used.
        // As of now, the asset is not really swapped, so the only movement in balances is from
        // the vault to the action
        expect(await mockUnderlyingAsset.balanceOf(vault.address)).to.equal(0);
        expect(await mockUnderlyingAsset.balanceOf(action.address)).to.equal(20000);

        // Check approve calls: the first call was directly done above in the test code, so
        // check the second and the third call.
        expect(mockUnderlyingAsset.approve).to.have.callCount(3);
        expect(mockUnderlyingAsset.approve.atCall(1)).to.have.been.calledWith(action.address, 20000);
        expect(mockUnderlyingAsset.approve.atCall(2)).to.have.been.calledWith(fakeUniswapRouter.address, 208);

        expect(mockUSDC.approve).to.have.been.calledOnce;
        expect(mockUSDC.approve.atCall(0)).to.have.been.calledWith(fakePotionProtocol.address, 1020);

        // Check the Uniswap Calls
        expect(fakeUniswapRouter.exactOutput).to.have.been.calledOnce;
        expect(fakeUniswapRouter.exactOutput.getCall(0).args[0]).to.be.deep.equal([
            swapInfo.swapPath,
            action.address,
            tEnv.maxSwapDurationSecs.add(nextBlockTimestamp),
            BigNumber.from(1020),
            BigNumber.from(208),
        ]);

        // Check the Potion calls
        expect(fakePotionProtocol.buyOtokens).to.have.been.calledOnce;
        expect(fakePotionProtocol.buyOtokens.getCall(0).args[0]).to.be.equal(potionOtokenAddress);
        expectSolidityDeepCompare(counterparties, fakePotionProtocol.buyOtokens.getCall(0).args[1]);
        expect(fakePotionProtocol.buyOtokens.getCall(0).args[2]).to.be.equal(1020);
    });
});
