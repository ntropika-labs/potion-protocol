import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperFeeManager, MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("FeeManager", function () {
    let ownerAccount: SignerWithAddress;
    let feesRecipientAccount1: SignerWithAddress;
    let feesRecipientAccount2: SignerWithAddress;
    let feesRecipientAccount3: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let feeManager: TestWrapperFeeManager;
    let erc20: MockERC20PresetMinterPauser;

    const PercentageFactor = 10 ** 6;

    before(async function () {
        ownerAccount = (await ethers.getSigners())[0];
        feesRecipientAccount1 = (await ethers.getSigners())[1];
        feesRecipientAccount2 = (await ethers.getSigners())[2];
        feesRecipientAccount3 = (await ethers.getSigners())[3];
        unpriviledgedAccount = (await ethers.getSigners())[4];

        const ERC20Factory = await ethers.getContractFactory("MockERC20PresetMinterPauser");
        erc20 = (await ERC20Factory.deploy()) as MockERC20PresetMinterPauser;

        const FeeManagerFactory = await ethers.getContractFactory("TestWrapperFeeManager");
        feeManager = (await FeeManagerFactory.deploy()) as TestWrapperFeeManager;

        await feeManager.initialize(
            ownerAccount.address,
            4 * PercentageFactor,
            6 * PercentageFactor,
            feesRecipientAccount1.address,
        );
    });

    it("Check getters", async function () {
        expect(await feeManager.getManagementFee()).to.be.equal(4 * PercentageFactor);
        expect(await feeManager.getPerformanceFee()).to.be.equal(6 * PercentageFactor);
        expect(await feeManager.getFeesRecipient()).to.be.equal(feesRecipientAccount1.address);
    });
    it("Change fees and recipient", async function () {
        await feeManager.setManagementFee(8 * PercentageFactor);
        expect(await feeManager.getManagementFee()).to.be.equal(8 * PercentageFactor);

        await feeManager.setPerformanceFee(2 * PercentageFactor);
        expect(await feeManager.getPerformanceFee()).to.be.equal(2 * PercentageFactor);

        await feeManager.setFeesRecipient(feesRecipientAccount2.address);
        expect(await feeManager.getFeesRecipient()).to.be.equal(feesRecipientAccount2.address);
    });
    it("Only admin can change fees and recipient", async function () {
        await expect(
            feeManager.connect(unpriviledgedAccount).setManagementFee(8 * PercentageFactor),
        ).to.be.revertedWith("Only the Admin can call this function");
        await expect(
            feeManager.connect(unpriviledgedAccount).setPerformanceFee(8 * PercentageFactor),
        ).to.be.revertedWith("Only the Admin can call this function");
        await expect(
            feeManager.connect(unpriviledgedAccount).setFeesRecipient(feesRecipientAccount1.address),
        ).to.be.revertedWith("Only the Admin can call this function");
    });
    it("Calculate payments", async function () {
        await feeManager.setManagementFee(8 * PercentageFactor);
        await feeManager.setPerformanceFee(2 * PercentageFactor);

        expect(await feeManager.calculateManagementPayment(1000)).to.be.equal(80);
        expect(await feeManager.calculateManagementPayment(0)).to.be.equal(0);
        expect(await feeManager.calculateManagementPayment(133)).to.be.equal(10);

        expect(await feeManager.calculatePerformancePayment(1000)).to.be.equal(20);
        expect(await feeManager.calculatePerformancePayment(0)).to.be.equal(0);
        expect(await feeManager.calculatePerformancePayment(133)).to.be.equal(2);
    });
    it("Send token payments", async function () {
        await erc20.mint(feeManager.address, 100000);
        await feeManager.setManagementFee(8 * PercentageFactor);
        await feeManager.setPerformanceFee(2 * PercentageFactor);
        await feeManager.setFeesRecipient(feesRecipientAccount1.address);

        expect(await erc20.balanceOf(feesRecipientAccount1.address)).to.be.equal(0);
        expect(await erc20.balanceOf(feeManager.address)).to.be.equal(100000);

        await feeManager.payFees(erc20.address, 888, 999);

        expect(await erc20.balanceOf(feesRecipientAccount1.address)).to.be.equal(71 + 19);
        expect(await erc20.balanceOf(feeManager.address)).to.be.equal(100000 - (71 + 19));
    });
    it("Send ETH payments", async function () {
        await ownerAccount.sendTransaction({
            to: feeManager.address,
            value: ethers.utils.parseEther("1"),
        });
        await feeManager.setManagementFee(8 * PercentageFactor);
        await feeManager.setPerformanceFee(2 * PercentageFactor);
        await feeManager.setFeesRecipient(feesRecipientAccount2.address);

        const prevBalance = await ethers.provider.getBalance(feesRecipientAccount2.address);

        expect(await ethers.provider.getBalance(feeManager.address)).to.be.equal(ethers.utils.parseEther("1"));

        await feeManager.payFeesETH(888, 999);

        expect(await ethers.provider.getBalance(feesRecipientAccount2.address)).to.be.equal(prevBalance.add(71 + 19));
        expect(await ethers.provider.getBalance(feeManager.address)).to.be.equal(
            ethers.utils.parseEther("1").sub(71 + 19),
        );
    });
    it("Fees percentages must be in range", async function () {
        await expect(feeManager.setManagementFee(99 * PercentageFactor)).to.be.not.reverted;
        await expect(feeManager.setManagementFee(100 * PercentageFactor)).to.be.not.reverted;
        await expect(feeManager.setManagementFee(100 * PercentageFactor + 1)).to.be.revertedWith(
            "Management fee must be less than or equal to 100",
        );

        await expect(feeManager.setPerformanceFee(99 * PercentageFactor)).to.be.not.reverted;
        await expect(feeManager.setPerformanceFee(100 * PercentageFactor)).to.be.not.reverted;
        await expect(feeManager.setPerformanceFee(100 * PercentageFactor + 1)).to.be.revertedWith(
            "Performance fee must be less than or equal to 100",
        );
    });
    it("Setting the same fee recipient", async function () {
        await expect(feeManager.setFeesRecipient(feesRecipientAccount3.address)).to.be.not.reverted;
        await expect(feeManager.setFeesRecipient(feesRecipientAccount3.address)).to.be.revertedWith(
            "Fees recipient is the same as before",
        );
    });
});
