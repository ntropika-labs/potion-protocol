import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperPriceUtils } from "../../typechain";

/**
    @notice PriceUtils unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("PriceUtils", function () {
    let priceUtils: TestWrapperPriceUtils;

    // Using ethers.utils.parseEther because PriceUtils uses 18 decimals for the prices

    before(async function () {
        const PriceUtilsFactory = await ethers.getContractFactory("TestWrapperPriceUtils");
        priceUtils = (await PriceUtilsFactory.deploy()) as TestWrapperPriceUtils;
    });

    it("To output amount", async function () {
        expect(await priceUtils.toOutputAmount(ethers.utils.parseEther("1.20"), 1000)).to.be.equal(1200);
        expect(await priceUtils.toOutputAmount(ethers.utils.parseEther("0.85"), 800)).to.be.equal(680);
        expect(await priceUtils.toOutputAmount(ethers.utils.parseEther("100.33"), 333)).to.be.equal(33409);
    });
    it("To input amount", async function () {
        expect(await priceUtils.toInputAmount(ethers.utils.parseEther("1.20"), 1200)).to.be.equal(1000);
        expect(await priceUtils.toInputAmount(ethers.utils.parseEther("0.85"), 680)).to.be.equal(800);
        expect(await priceUtils.toInputAmount(ethers.utils.parseEther("100.33"), 33409)).to.be.equal(332);
    });
});
