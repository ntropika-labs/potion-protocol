import chai, { expect } from "chai";
import { FakeContract, smock } from "@defi-wonderland/smock";
import { ethers, network } from "hardhat";

import {
    TestWrapperPotionProtocolLib,
    IPotionLiquidityPool,
    IPotionLiquidityPool__factory,
    IOpynFactory,
    IOpynFactory__factory,
    IOpynController,
    IOpynController__factory,
    IERC20,
    IERC20__factory,
} from "../../typechain";

import * as PercentageUtils from "hedging-vault-sdk";
import { expectSolidityDeepCompare } from "../utils/chaiHelpers";
import { BigNumber } from "ethers";

chai.use(smock.matchers);

/**
    @notice PotionProtocolLib unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("PotionProtocolLib", function () {
    let potionAddress: string;
    let randomAddress: string;
    let underlyingAsset: string;
    let strikeAsset: string;
    let potionProtocolLib: TestWrapperPotionProtocolLib;
    let fakePotionLiquidityPool: FakeContract<IPotionLiquidityPool>;
    let fakeOpynFactory: FakeContract<IOpynFactory>;
    let fakeOpynController: FakeContract<IOpynController>;
    let fakeUSDC: FakeContract<IERC20>;

    // Using `beforeEach` here because smock does not reset the call count for a function after each test
    beforeEach(async function () {
        if (network.name !== "hardhat") {
            this.skip();
        }

        const PotionProtocolLibFactory = await ethers.getContractFactory("TestWrapperPotionProtocolLib");
        potionProtocolLib = (await PotionProtocolLibFactory.deploy()) as TestWrapperPotionProtocolLib;

        fakePotionLiquidityPool = await smock.fake<IPotionLiquidityPool>(IPotionLiquidityPool__factory.abi);
        fakeOpynFactory = await smock.fake<IOpynFactory>(IOpynFactory__factory.abi);
        fakeOpynController = await smock.fake<IOpynController>(IOpynController__factory.abi);
        fakeUSDC = await smock.fake<IERC20>(IERC20__factory.abi);

        potionAddress = (await ethers.getSigners())[5].address;
        randomAddress = (await ethers.getSigners())[6].address;
        underlyingAsset = (await ethers.getSigners())[7].address;
        strikeAsset = (await ethers.getSigners())[8].address;
    });

    it("PPL0001 - Buy Potion Not Max Slippage", async function () {
        if (network.name !== "hardhat") {
            this.skip();
        }

        // The value returned by `buyOtokens` must be less than the maximum premium so the ERC20 approve
        // function is called twice
        fakePotionLiquidityPool.buyOtokens.returns(1594);
        fakeOpynFactory.getOtoken.returns(potionAddress);
        fakeUSDC.approve.returns(true);

        const slippage = PercentageUtils.toSolidityPercentage(2.0);

        const counterparties: IPotionLiquidityPool.CounterpartyDetailsStruct[] = [
            {
                lp: randomAddress,
                poolId: 55,
                curve: {
                    a_59x18: 1,
                    b_59x18: 2,
                    c_59x18: 3,
                    d_59x18: 4,
                    max_util_59x18: 5,
                },
                criteria: {
                    underlyingAsset: underlyingAsset,
                    strikeAsset: strikeAsset,
                    isPut: true,
                    maxStrikePercent: 99,
                    maxDurationInDays: 59,
                },
                orderSizeInOtokens: 3001,
            },
        ];

        const expectedPremium = BigNumber.from(2567);
        const maxPremium = PercentageUtils.addPercentage(expectedPremium, slippage);

        const buyPotionParams: TestWrapperPotionProtocolLib.BuyPotionParamsStruct = {
            underlyingAsset,
            strikePriceInUSDC: BigNumber.from("100000000000"),
            expirationTimestamp: BigNumber.from("100000000000"), // Not important
            maxPremiumInUSDC: maxPremium,
            targetPotionAddress: potionAddress,
            sellers: counterparties,
            USDC: fakeUSDC.address,
        };

        expect(
            await potionProtocolLib.callStatic.buyPotion(
                fakePotionLiquidityPool.address,
                fakeOpynFactory.address,
                buyPotionParams,
            ),
        ).to.be.eq(1594);

        expect(fakePotionLiquidityPool.buyOtokens).to.have.been.calledOnce;
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[0]).to.be.eq(potionAddress);
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[2]).to.be.eq(maxPremium);

        // Check the counterparties
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const callCounterparties: any = fakePotionLiquidityPool.buyOtokens.getCall(0).args[1];
        expect(callCounterparties.length).to.be.eq(1);

        const firstCounterparty = callCounterparties[0];
        expect(firstCounterparty.lp).to.be.eq(randomAddress);
        expect(firstCounterparty.poolId).to.be.eq(55);
        expect(firstCounterparty.curve.a_59x18).to.be.eq(1);
        expect(firstCounterparty.curve.b_59x18).to.be.eq(2);
        expect(firstCounterparty.curve.c_59x18).to.be.eq(3);
        expect(firstCounterparty.curve.d_59x18).to.be.eq(4);
        expect(firstCounterparty.curve.max_util_59x18).to.be.eq(5);
        expect(firstCounterparty.criteria.underlyingAsset).to.be.eq(underlyingAsset);
        expect(firstCounterparty.criteria.strikeAsset).to.be.eq(strikeAsset);
        expect(firstCounterparty.criteria.isPut).to.be.eq(true);
        expect(firstCounterparty.criteria.maxStrikePercent).to.be.eq(99);
        expect(firstCounterparty.criteria.maxDurationInDays).to.be.eq(59);
        expect(firstCounterparty.orderSizeInOtokens).to.be.eq(3001);

        // Check the ERC20 approvals
        expect(fakeUSDC.approve).to.have.been.calledTwice;

        expect(fakeUSDC.approve.atCall(0)).to.have.been.calledWith(fakePotionLiquidityPool.address, maxPremium);
        expect(fakeUSDC.approve.atCall(1)).to.have.been.calledWith(fakePotionLiquidityPool.address, 0);
    });
    it("PPL0002 - Buy Potion Max Slippage", async function () {
        if (network.name !== "hardhat") {
            this.skip();
        }
        // The value returned by `buyOtokens` must be exactly the maximum premium so the ERC20 approve
        // function is called only once
        fakePotionLiquidityPool.buyOtokens.returns(2618);
        fakeOpynFactory.getOtoken.returns(potionAddress);
        fakeUSDC.approve.returns(true);

        const slippage = PercentageUtils.toSolidityPercentage(2.0);

        const counterparties: IPotionLiquidityPool.CounterpartyDetailsStruct[] = [
            {
                lp: randomAddress,
                poolId: 55,
                curve: {
                    a_59x18: 1,
                    b_59x18: 2,
                    c_59x18: 3,
                    d_59x18: 4,
                    max_util_59x18: 5,
                },
                criteria: {
                    underlyingAsset: underlyingAsset,
                    strikeAsset: strikeAsset,
                    isPut: true,
                    maxStrikePercent: 99,
                    maxDurationInDays: 59,
                },
                orderSizeInOtokens: 3001,
            },
        ];

        const expectedPremium = BigNumber.from(2567);
        const maxPremium = PercentageUtils.addPercentage(expectedPremium, slippage);

        const buyPotionParams: TestWrapperPotionProtocolLib.BuyPotionParamsStruct = {
            underlyingAsset,
            strikePriceInUSDC: BigNumber.from("100000000000"),
            expirationTimestamp: BigNumber.from("100000000000"), // Not important
            maxPremiumInUSDC: maxPremium,
            targetPotionAddress: potionAddress,
            sellers: counterparties,
            USDC: fakeUSDC.address,
        };

        expect(
            await potionProtocolLib.callStatic.buyPotion(
                fakePotionLiquidityPool.address,
                fakeOpynFactory.address,
                buyPotionParams,
            ),
        ).to.be.eq(2618);

        expect(fakePotionLiquidityPool.buyOtokens).to.have.been.calledOnce;
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[0]).to.be.eq(potionAddress);
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[2]).to.be.eq(maxPremium);

        // Check the counterparties
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const callCounterparties: any = fakePotionLiquidityPool.buyOtokens.getCall(0).args[1];
        expect(callCounterparties.length).to.be.eq(1);

        const firstCounterparty = callCounterparties[0];
        expect(firstCounterparty.lp).to.be.eq(randomAddress);
        expect(firstCounterparty.poolId).to.be.eq(55);
        expect(firstCounterparty.curve.a_59x18).to.be.eq(1);
        expect(firstCounterparty.curve.b_59x18).to.be.eq(2);
        expect(firstCounterparty.curve.c_59x18).to.be.eq(3);
        expect(firstCounterparty.curve.d_59x18).to.be.eq(4);
        expect(firstCounterparty.curve.max_util_59x18).to.be.eq(5);
        expect(firstCounterparty.criteria.underlyingAsset).to.be.eq(underlyingAsset);
        expect(firstCounterparty.criteria.strikeAsset).to.be.eq(strikeAsset);
        expect(firstCounterparty.criteria.isPut).to.be.eq(true);
        expect(firstCounterparty.criteria.maxStrikePercent).to.be.eq(99);
        expect(firstCounterparty.criteria.maxDurationInDays).to.be.eq(59);
        expect(firstCounterparty.orderSizeInOtokens).to.be.eq(3001);

        // Check the ERC20 approvals
        expect(fakeUSDC.approve).to.have.been.calledOnce;

        expect(fakeUSDC.approve.atCall(0)).to.have.been.calledWith(fakePotionLiquidityPool.address, maxPremium);
    });
    it("PPL0003 - Redeem Potion", async function () {
        if (network.name !== "hardhat") {
            this.skip();
        }
        fakePotionLiquidityPool.settleAndRedistributeSettlement.returns(true);

        const totalSizeInPotions = 3001;

        await potionProtocolLib.callStatic.redeemPotion(
            fakePotionLiquidityPool.address,
            fakeOpynController.address,
            potionAddress,
            3001,
        );

        expect(fakeOpynController.operate).to.have.been.calledOnce;

        const redeemExpectedArgs: IOpynController.ActionArgsStruct[] = [
            {
                actionType: 8,
                owner: potionProtocolLib.address,
                secondAddress: potionProtocolLib.address,
                asset: potionAddress,
                vaultId: 0,
                amount: totalSizeInPotions,
                index: 0,
                data: "0x",
            },
        ];
        const redeemActualArgs = fakeOpynController.operate.getCall(0).args[0] as IOpynController.ActionArgsStruct[];

        expectSolidityDeepCompare(redeemExpectedArgs, redeemActualArgs);
    });
});
