import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import { TestWrapperPercentageUtils } from "../../typechain";

/**
    @notice PercentageUtils unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("PercentageUtils", function () {
    let percentageUtils: TestWrapperPercentageUtils;
    let PercentageDecimals: BigNumber;
    let PercentageFactor: BigNumber;
    let Percentage100: BigNumber;

    before(async function () {
        const PercentageUtilsFactory = await ethers.getContractFactory("TestWrapperPercentageUtils");
        percentageUtils = (await PercentageUtilsFactory.deploy()) as TestWrapperPercentageUtils;

        PercentageDecimals = await percentageUtils.PERCENTAGE_DECIMALS();
        PercentageFactor = await percentageUtils.PERCENTAGE_FACTOR();
        Percentage100 = await percentageUtils.PERCENTAGE_100();
    });

    it("PU0001 - Check Constants", async function () {
        expect(PercentageDecimals).to.be.eq(6);
        expect(PercentageFactor).to.be.eq(10 ** 6);
        expect(Percentage100).to.be.eq(PercentageFactor.mul(100));
    });
    it("PU0002 - Percentage Range", async function () {
        expect(await percentageUtils.isPercentageInRange(0)).to.be.true;
        expect(await percentageUtils.isPercentageInRange(Percentage100)).to.be.true;
        expect(await percentageUtils.isPercentageInRange(PercentageFactor.mul(101))).to.be.false;
        expect(await percentageUtils.isPercentageInRange(PercentageFactor.mul(1000))).to.be.false;
    });
    it("PU0003 - Add Percentage", async function () {
        expect(await percentageUtils.addPercentage(1000, PercentageFactor.mul(10))).to.be.eq(1100);
        expect(await percentageUtils.addPercentage(10, PercentageFactor.mul(50))).to.be.eq(15);
        expect(await percentageUtils.addPercentage(0, PercentageFactor.mul(30))).to.be.eq(0);
    });
    it("PU0004 - Subtract Percentage", async function () {
        expect(await percentageUtils.subtractPercentage(1000, PercentageFactor.mul(10))).to.be.eq(900);
        expect(await percentageUtils.subtractPercentage(10, PercentageFactor.mul(50))).to.be.eq(5);
        expect(await percentageUtils.subtractPercentage(0, PercentageFactor.mul(30))).to.be.eq(0);
    });
    it("PU0005 - Apply Percentage", async function () {
        expect(await percentageUtils.applyPercentage(1000, PercentageFactor.mul(10))).to.be.eq(100);
        expect(await percentageUtils.applyPercentage(10, PercentageFactor.mul(40))).to.be.eq(4);
        expect(await percentageUtils.applyPercentage(0, PercentageFactor.mul(30))).to.be.eq(0);
    });
});
