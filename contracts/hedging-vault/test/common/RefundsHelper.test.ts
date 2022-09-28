import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperRefundsHelper, MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AccessControlMissingRole, Roles } from "hedging-vault-sdk";

/**
    @notice RefundsHelper unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("RefundsHelper", function () {
    let ownerAccount: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let tokenAddressA: string;
    let tokenAddressB: string;
    let tokenAddressC: string;
    let refundsHelper: TestWrapperRefundsHelper;
    let erc20D: MockERC20PresetMinterPauser;
    let cannotRefundTokens: string[];
    let cannotRefundETH: boolean;

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    describe("Cannot refund ETH", function () {
        before(async function () {
            ownerAccount = (await ethers.getSigners())[0];
            unpriviledgedAccount = (await ethers.getSigners())[1];

            // Use the signer addresses as token address to have a valid checksummed address
            tokenAddressA = (await ethers.getSigners())[2].address;
            tokenAddressB = (await ethers.getSigners())[3].address;
            tokenAddressC = (await ethers.getSigners())[4].address;

            // Deploy ERC20s
            const ERC20Factory = await ethers.getContractFactory("MockERC20PresetMinterPauser");
            erc20D = await ERC20Factory.deploy();

            const RefundsHelperFactory = await ethers.getContractFactory("TestWrapperRefundsHelper");
            refundsHelper = (await RefundsHelperFactory.deploy()) as TestWrapperRefundsHelper;

            cannotRefundTokens = [tokenAddressA, tokenAddressB, tokenAddressC];
            cannotRefundETH = true;

            await refundsHelper.initialize(
                ownerAccount.address,
                ownerAccount.address,
                cannotRefundTokens,
                cannotRefundETH,
            );
        });

        it("RH0001 - Default Value", async function () {
            expect(await refundsHelper.canRefundETH()).to.be.false;

            for (const tokenAddress of cannotRefundTokens) {
                expect(await refundsHelper.canRefund(tokenAddress)).to.be.false;
            }
        });
        it("RH0002 - Check Refundable Token", async function () {
            expect(await refundsHelper.canRefund(erc20D.address)).to.be.true;
        });
        it("RH0003 - Refund Non-Refundable Tokens", async function () {
            for (const tokenAddress of cannotRefundTokens) {
                await expect(
                    refundsHelper.refund(tokenAddress, ethers.utils.parseEther("1"), unpriviledgedAccount.address),
                ).to.be.revertedWith("Token cannot be refunded");
            }
        });
        it("RH0004 - Refund Refundable Tokens", async function () {
            await erc20D.mint(refundsHelper.address, ethers.utils.parseEther("1"));
            expect(await erc20D.balanceOf(refundsHelper.address)).to.eq(ethers.utils.parseEther("1"));
            expect(await erc20D.balanceOf(unpriviledgedAccount.address)).to.eq(ethers.utils.parseEther("0"));

            await refundsHelper.refund(erc20D.address, ethers.utils.parseEther("1"), unpriviledgedAccount.address);
            expect(await erc20D.balanceOf(refundsHelper.address)).to.eq(ethers.utils.parseEther("0"));
            expect(await erc20D.balanceOf(unpriviledgedAccount.address)).to.eq(ethers.utils.parseEther("1"));
        });
        it("RH0005 - Recipient Not Zero Address", async function () {
            await expect(
                refundsHelper.refund(erc20D.address, ethers.utils.parseEther("1"), zeroAddress),
            ).to.be.revertedWith("Recipient address cannot be the null address");
        });
        it("RH0006 - Only Admin", async function () {
            await expect(
                refundsHelper
                    .connect(unpriviledgedAccount)
                    .refund(erc20D.address, ethers.utils.parseEther("1"), unpriviledgedAccount.address),
            ).to.be.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
            await expect(
                refundsHelper
                    .connect(unpriviledgedAccount)
                    .refundETH(ethers.utils.parseEther("1"), unpriviledgedAccount.address),
            ).to.be.revertedWith(AccessControlMissingRole(Roles.Admin, unpriviledgedAccount.address));
        });
    });

    describe("Can refund ETH", function () {
        before(async function () {
            ownerAccount = (await ethers.getSigners())[0];
            unpriviledgedAccount = (await ethers.getSigners())[8];

            // Use the signer addresses as token address to have a valid checksummed address
            tokenAddressA = (await ethers.getSigners())[2].address;
            tokenAddressB = (await ethers.getSigners())[3].address;
            tokenAddressC = (await ethers.getSigners())[4].address;

            // Deploy ERC20s
            const ERC20Factory = await ethers.getContractFactory("MockERC20PresetMinterPauser");
            erc20D = await ERC20Factory.deploy();

            const RefundsHelperFactory = await ethers.getContractFactory("TestWrapperRefundsHelper");
            refundsHelper = (await RefundsHelperFactory.deploy()) as TestWrapperRefundsHelper;

            cannotRefundTokens = [tokenAddressA, tokenAddressB, tokenAddressC];
            cannotRefundETH = false;

            await refundsHelper.initialize(
                ownerAccount.address,
                ownerAccount.address,
                cannotRefundTokens,
                cannotRefundETH,
            );
        });

        it("RH0007 - Default Value", async function () {
            expect(await refundsHelper.canRefundETH()).to.be.true;

            for (const tokenAddress of cannotRefundTokens) {
                expect(await refundsHelper.canRefund(tokenAddress)).to.be.false;
            }
        });
        it("RH0008 - Refund ETH", async function () {
            await ownerAccount.sendTransaction({
                to: refundsHelper.address,
                value: ethers.utils.parseEther("1"),
            });

            expect(await ethers.provider.getBalance(refundsHelper.address)).to.be.equal(ethers.utils.parseEther("1"));

            const prevBalance = await ethers.provider.getBalance(unpriviledgedAccount.address);

            await refundsHelper.refundETH(ethers.utils.parseEther("1"), unpriviledgedAccount.address);
            expect(await ethers.provider.getBalance(unpriviledgedAccount.address)).to.be.equal(
                prevBalance.add(ethers.utils.parseEther("1")),
            );
        });
    });
});
