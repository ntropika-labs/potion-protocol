import chai, { expect } from "chai";
import { FakeContract, smock } from "@defi-wonderland/smock";
import { ethers } from "hardhat";

import {
    TestWrapperPotionProtocolLib,
    IPotionLiquidityPool,
    IPotionLiquidityPool__factory,
    IERC20,
    IERC20__factory,
} from "../../typechain";

import { PercentageUtils } from "../utils/PercentageUtils";

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
    let fakeUSDC: FakeContract<IERC20>;

    // Using `beforeEach` here because smock does not reset the call count for a function after each test
    beforeEach(async function () {
        const PotionProtocolLibFactory = await ethers.getContractFactory("TestWrapperPotionProtocolLib");
        potionProtocolLib = (await PotionProtocolLibFactory.deploy()) as TestWrapperPotionProtocolLib;

        fakePotionLiquidityPool = await smock.fake<IPotionLiquidityPool>(IPotionLiquidityPool__factory.abi);
        fakeUSDC = await smock.fake<IERC20>(IERC20__factory.abi);

        potionAddress = (await ethers.getSigners())[5].address;
        randomAddress = (await ethers.getSigners())[6].address;
        underlyingAsset = (await ethers.getSigners())[7].address;
        strikeAsset = (await ethers.getSigners())[8].address;
    });

    it("Buy Potion", async function () {
        // The valut returned by `buyOtokens` must be less than the maximum premium so the ERC20 approve
        // function is called twice
        fakePotionLiquidityPool.buyOtokens.returns(1594);
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

        const expectedPremium = 2567;

        expect(
            await potionProtocolLib.callStatic.buyPotion(
                fakePotionLiquidityPool.address,
                potionAddress,
                counterparties,
                expectedPremium,
                slippage,
                fakeUSDC.address,
            ),
        ).to.be.eq(1594);

        const maxPremium = PercentageUtils.addPercentage(expectedPremium, slippage);

        expect(fakePotionLiquidityPool.buyOtokens).to.have.been.calledOnce;
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[0]).to.be.eq(potionAddress);
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[2]).to.be.eq(maxPremium);

        // Check the counterparties
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
    it("Buy Potion Exact Premium", async function () {
        // The value returned by `buyOtokens` must be exactly the maximum premium so the ERC20 approve
        // function is called only once
        fakePotionLiquidityPool.buyOtokens.returns(2618);
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

        const expectedPremium = 2567;

        expect(
            await potionProtocolLib.callStatic.buyPotion(
                fakePotionLiquidityPool.address,
                potionAddress,
                counterparties,
                expectedPremium,
                slippage,
                fakeUSDC.address,
            ),
        ).to.be.eq(2618);

        const maxPremium = PercentageUtils.addPercentage(expectedPremium, slippage);

        expect(fakePotionLiquidityPool.buyOtokens).to.have.been.calledOnce;
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[0]).to.be.eq(potionAddress);
        expect(fakePotionLiquidityPool.buyOtokens.getCall(0).args[2]).to.be.eq(maxPremium);

        // Check the counterparties
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
    it("Redeem Potion", async function () {
        fakePotionLiquidityPool.settleAfterExpiry.returns(true);

        await potionProtocolLib.callStatic.redeemPotion(fakePotionLiquidityPool.address, potionAddress);

        expect(fakePotionLiquidityPool.settleAfterExpiry).to.have.been.calledOnce;
        expect(fakePotionLiquidityPool.settleAfterExpiry).to.have.been.calledWith(potionAddress);
    });
});
