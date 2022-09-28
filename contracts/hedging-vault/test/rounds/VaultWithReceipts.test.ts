import { expect } from "chai";
import { ethers } from "hardhat";

import { TestWrapperVaultWithReceipts } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

/**
    @notice VaultWithReceipts unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("VaultWithReceipts", function () {
    let unpriviledgedAccount: SignerWithAddress;
    let unpriviledgedAccount2: SignerWithAddress;
    let vaultWithReceipts: TestWrapperVaultWithReceipts;
    let assetToken: MockERC20PresetMinterPauser;

    beforeEach(async function () {
        unpriviledgedAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount2 = (await ethers.getSigners())[2];

        const ERC20Factory = await ethers.getContractFactory("MockERC20PresetMinterPauser");
        assetToken = (await ERC20Factory.deploy()) as MockERC20PresetMinterPauser;

        const VaultWithReceiptsFactory = await ethers.getContractFactory("TestWrapperVaultWithReceipts");
        vaultWithReceipts = (await VaultWithReceiptsFactory.deploy()) as TestWrapperVaultWithReceipts;

        await vaultWithReceipts.initialize(assetToken.address, "SomeURI");

        await assetToken.mint(unpriviledgedAccount.address, ethers.utils.parseEther("1"));
        await assetToken.connect(unpriviledgedAccount).approve(vaultWithReceipts.address, ethers.utils.parseEther("1"));

        await assetToken.mint(unpriviledgedAccount2.address, ethers.utils.parseEther("1"));
        await assetToken
            .connect(unpriviledgedAccount2)
            .approve(vaultWithReceipts.address, ethers.utils.parseEther("1"));
    });

    it("VWR0001 - Default Value", async function () {
        expect(await vaultWithReceipts.asset()).to.equal(assetToken.address);
        expect(await vaultWithReceipts.totalAssets()).to.equal(0);
        expect(await vaultWithReceipts.maxDeposit(unpriviledgedAccount.address)).to.equal(ethers.constants.MaxUint256);
        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(0);
    });

    it("VWR0002 - Deposit", async function () {
        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount)
                .deposit(ethers.utils.parseEther("0.5"), unpriviledgedAccount.address),
        )
            .to.emit(vaultWithReceipts, "DepositWithReceipt")
            .withArgs(unpriviledgedAccount.address, unpriviledgedAccount.address, 0, ethers.utils.parseEther("0.5"));

        expect(await assetToken.balanceOf(vaultWithReceipts.address)).to.equal(ethers.utils.parseEther("0.5"));
        expect(await assetToken.balanceOf(unpriviledgedAccount.address)).to.equal(ethers.utils.parseEther("0.5"));

        expect(await vaultWithReceipts.totalAssets()).to.equal(ethers.utils.parseEther("0.5"));
        expect(await vaultWithReceipts.maxDeposit(unpriviledgedAccount.address)).to.equal(ethers.constants.MaxUint256);
        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(ethers.utils.parseEther("0.5"));
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(ethers.utils.parseEther("0.5"));

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(
            ethers.utils.parseEther("0.5"),
        );
    });

    it("VWR0003 - Redeem", async function () {
        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.5"), unpriviledgedAccount.address);

        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );

        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount)
                .redeem(0, ethers.utils.parseEther("0.5"), unpriviledgedAccount.address, unpriviledgedAccount.address),
        )
            .to.emit(vaultWithReceipts, "RedeemReceipt")
            .withArgs(
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                0,
                ethers.utils.parseEther("0.5"),
            );

        expect(await vaultWithReceipts.exists(0)).to.equal(false);
        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(0);
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(0);

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(0);
    });

    it("VWR0004 - Redeem Batch", async function () {
        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.2"), unpriviledgedAccount.address);

        await vaultWithReceipts.mockSetMintId(1);

        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.2"), unpriviledgedAccount.address);

        await vaultWithReceipts.mockSetMintId(2);

        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.2"), unpriviledgedAccount.address);

        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.6"),
        );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.exists(1)).to.equal(true);
        expect(await vaultWithReceipts.exists(2)).to.equal(true);

        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount)
                .redeemBatch(
                    [0, 1, 2],
                    [ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.2")],
                    unpriviledgedAccount.address,
                    unpriviledgedAccount.address,
                ),
        )
            .to.emit(vaultWithReceipts, "RedeemReceiptBatch")
            .withArgs(
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                [0, 1, 2],
                [ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.2")],
            );

        expect(await vaultWithReceipts.exists(0)).to.equal(false);
        expect(await vaultWithReceipts.exists(1)).to.equal(false);
        expect(await vaultWithReceipts.exists(2)).to.equal(false);
        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(0);
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(0);
        expect(await vaultWithReceipts.totalSupply(1)).to.equal(0);
        expect(await vaultWithReceipts.totalSupply(2)).to.equal(0);

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(0);
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 1)).to.equal(0);
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 2)).to.equal(0);
    });

    it("VWR0005 - Redeem Partial", async function () {
        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.5"), unpriviledgedAccount.address);

        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );

        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount)
                .redeem(0, ethers.utils.parseEther("0.3"), unpriviledgedAccount.address, unpriviledgedAccount.address),
        )
            .to.emit(vaultWithReceipts, "RedeemReceipt")
            .withArgs(
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                0,
                ethers.utils.parseEther("0.3"),
            );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(ethers.utils.parseEther("0.2"));
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(ethers.utils.parseEther("0.2"));

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.2"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(
            ethers.utils.parseEther("0.2"),
        );
    });

    it("VWR0006 - Redeem Partial Batch", async function () {
        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.3"), unpriviledgedAccount.address);

        await vaultWithReceipts.mockSetMintId(1);

        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.3"), unpriviledgedAccount.address);

        await vaultWithReceipts.mockSetMintId(2);

        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.3"), unpriviledgedAccount.address);

        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.9"),
        );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.exists(1)).to.equal(true);
        expect(await vaultWithReceipts.exists(2)).to.equal(true);

        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount)
                .redeemBatch(
                    [0, 1, 2],
                    [ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.3")],
                    unpriviledgedAccount.address,
                    unpriviledgedAccount.address,
                ),
        )
            .to.emit(vaultWithReceipts, "RedeemReceiptBatch")
            .withArgs(
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                [0, 1, 2],
                [ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.3")],
            );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.exists(1)).to.equal(true);
        expect(await vaultWithReceipts.exists(2)).to.equal(false);
        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(ethers.utils.parseEther("0.3"));
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(ethers.utils.parseEther("0.2"));
        expect(await vaultWithReceipts.totalSupply(1)).to.equal(ethers.utils.parseEther("0.1"));
        expect(await vaultWithReceipts.totalSupply(2)).to.equal(ethers.utils.parseEther("0"));

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.3"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(
            ethers.utils.parseEther("0.2"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 1)).to.equal(
            ethers.utils.parseEther("0.1"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 2)).to.equal(0);
    });

    it("VWR0007 - Two Participants", async function () {
        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.3"), unpriviledgedAccount.address);

        await vaultWithReceipts
            .connect(unpriviledgedAccount2)
            .deposit(ethers.utils.parseEther("0.2"), unpriviledgedAccount2.address);

        await vaultWithReceipts.mockSetMintId(1);

        await vaultWithReceipts
            .connect(unpriviledgedAccount)
            .deposit(ethers.utils.parseEther("0.3"), unpriviledgedAccount.address);

        await vaultWithReceipts
            .connect(unpriviledgedAccount2)
            .deposit(ethers.utils.parseEther("0.5"), unpriviledgedAccount2.address);

        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.6"),
        );
        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount2.address)).to.equal(
            ethers.utils.parseEther("0.7"),
        );

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.6"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(
            ethers.utils.parseEther("0.3"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 1)).to.equal(
            ethers.utils.parseEther("0.3"),
        );

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount2.address)).to.equal(
            ethers.utils.parseEther("0.7"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount2.address, 0)).to.equal(
            ethers.utils.parseEther("0.2"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount2.address, 1)).to.equal(
            ethers.utils.parseEther("0.5"),
        );

        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(ethers.utils.parseEther("1.3"));
        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(ethers.utils.parseEther("0.5"));
        expect(await vaultWithReceipts.exists(1)).to.equal(true);
        expect(await vaultWithReceipts.totalSupply(1)).to.equal(ethers.utils.parseEther("0.8"));

        // Redeem partially from each participant
        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount)
                .redeem(0, ethers.utils.parseEther("0.1"), unpriviledgedAccount.address, unpriviledgedAccount.address),
        )
            .to.emit(vaultWithReceipts, "RedeemReceipt")
            .withArgs(
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
                0,
                ethers.utils.parseEther("0.1"),
            );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);

        await expect(
            vaultWithReceipts
                .connect(unpriviledgedAccount2)
                .redeem(
                    1,
                    ethers.utils.parseEther("0.2"),
                    unpriviledgedAccount2.address,
                    unpriviledgedAccount2.address,
                ),
        )
            .to.emit(vaultWithReceipts, "RedeemReceipt")
            .withArgs(
                unpriviledgedAccount2.address,
                unpriviledgedAccount2.address,
                unpriviledgedAccount2.address,
                1,
                ethers.utils.parseEther("0.2"),
            );

        expect(await vaultWithReceipts.exists(0)).to.equal(true);
        expect(await vaultWithReceipts.exists(1)).to.equal(true);

        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );
        expect(await vaultWithReceipts.maxRedeem(unpriviledgedAccount2.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 0)).to.equal(
            ethers.utils.parseEther("0.2"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount.address, 1)).to.equal(
            ethers.utils.parseEther("0.3"),
        );

        expect(await vaultWithReceipts.balanceOfAll(unpriviledgedAccount2.address)).to.equal(
            ethers.utils.parseEther("0.5"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount2.address, 0)).to.equal(
            ethers.utils.parseEther("0.2"),
        );
        expect(await vaultWithReceipts.balanceOf(unpriviledgedAccount2.address, 1)).to.equal(
            ethers.utils.parseEther("0.3"),
        );

        expect(await vaultWithReceipts.totalSupplyAll()).to.equal(ethers.utils.parseEther("1.0"));
        expect(await vaultWithReceipts.totalSupply(0)).to.equal(ethers.utils.parseEther("0.4"));
        expect(await vaultWithReceipts.totalSupply(1)).to.equal(ethers.utils.parseEther("0.6"));
    });
});
