import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";

import { RoundsOutputVault, IERC4626Upgradeable } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { getFakeTargetVault } from "../utils/ERC4626Utils";
import { expectSolidityDeepCompare } from "../utils/ExpectDeepUtils";

/**
    @notice VaultDeferredOperation unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("RoundsOutputVault", function () {
    let adminAccount: SignerWithAddress;
    let operatorAccount: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let roundsOutputVault: RoundsOutputVault;
    let assetTokenMock: MockContract<MockERC20PresetMinterPauser>;
    let fakeTargetVault: FakeContract<IERC4626Upgradeable>;

    beforeEach(async function () {
        adminAccount = (await ethers.getSigners())[0];
        operatorAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount = (await ethers.getSigners())[2];

        const ERC20MockFactory = await smock.mock("MockERC20PresetMinterPauser");
        assetTokenMock = (await ERC20MockFactory.deploy()) as unknown as MockContract<MockERC20PresetMinterPauser>;

        const RoundsOutputVaultFactory = await ethers.getContractFactory("RoundsOutputVault");
        roundsOutputVault = (await RoundsOutputVaultFactory.deploy()) as RoundsOutputVault;

        fakeTargetVault = await getFakeTargetVault(assetTokenMock);

        await roundsOutputVault.initialize(
            adminAccount.address,
            operatorAccount.address,
            fakeTargetVault.address,
            "SomeURI",
        );
    });

    it("ROV0001 - Default Value", async function () {
        expect(await roundsOutputVault.getCurrentRound()).to.equal(0);
        expect(await roundsOutputVault.exchangeAsset()).to.equal(assetTokenMock.address);
        expect(await roundsOutputVault.getExchangeRate(0)).to.equal(0);
    });

    it("ROV0002 - Deposit Round 0", async function () {
        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);
        const currentRound = await roundsOutputVault.getCurrentRound();

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares, unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares,
        );

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(shares);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(shares);
    });

    it("ROV0003 - Next Round", async function () {
        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);
        const currentRound = await roundsOutputVault.getCurrentRound();

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares, unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares,
        );

        // TODO: Need to return some balance here because the shares were not actually transferred
        fakeTargetVault.balanceOf.returns(shares);

        const tx = roundsOutputVault.connect(operatorAccount).nextRound();
        await expect(tx)
            .to.emit(roundsOutputVault, "SharesRedeemed")
            .withArgs(currentRound, operatorAccount.address, shares, assets);

        await expect(tx).to.emit(roundsOutputVault, "NextRound").withArgs(currentRound.add(1));

        expect(await roundsOutputVault.getCurrentRound()).to.equal(currentRound.add(1));
    });

    it("ROV0004 - Deposit Round 1", async function () {
        await roundsOutputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares, unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares,
        );

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(shares);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(shares);
    });

    it("ROV0005 - Deposit/Redeem Same Round", async function () {
        await roundsOutputVault.connect(operatorAccount).nextRound();
        await roundsOutputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(2);

        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares, unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares,
        );

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(shares);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(shares);

        await expect(
            roundsOutputVault
                .connect(unpriviledgedAccount)
                .redeemExchangeAsset(currentRound, shares, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Exchange asset only available for previous rounds");

        await roundsOutputVault
            .connect(unpriviledgedAccount)
            .redeem(currentRound, shares, unpriviledgedAccount.address, unpriviledgedAccount.address);

        expect(fakeTargetVault.transfer).to.have.been.calledOnceWith(unpriviledgedAccount.address, shares);

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);
    });

    it("ROV0006 - Deposit/Redeem Batch Same Round", async function () {
        await roundsOutputVault.connect(operatorAccount).nextRound();
        await roundsOutputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(2);

        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares, unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares,
        );

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(shares);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(shares);

        await expect(
            roundsOutputVault
                .connect(unpriviledgedAccount)
                .redeemExchangeAsset(currentRound, shares, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Exchange asset only available for previous rounds");

        await roundsOutputVault
            .connect(unpriviledgedAccount)
            .redeemBatch(
                [currentRound, currentRound],
                [shares.div(2), shares.div(2)],
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
            );

        expect(fakeTargetVault.transfer).to.have.been.calledOnceWith(unpriviledgedAccount.address, shares);

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);
    });

    it("ROV0007 - Deposit/Redeem Previous Round", async function () {
        await roundsOutputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares, unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares,
        );

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(shares);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(shares);

        // Advance round
        await roundsOutputVault.connect(operatorAccount).nextRound();

        // TODO: minting because the fake vault cannot transfer assets back
        await assetTokenMock.mint(roundsOutputVault.address, assets);

        await expect(
            roundsOutputVault
                .connect(unpriviledgedAccount)
                .redeem(currentRound, shares, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Can only redeem current round");

        await roundsOutputVault
            .connect(unpriviledgedAccount)
            .redeemExchangeAsset(currentRound, shares, unpriviledgedAccount.address, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(assets);

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);
    });

    it("ROV0008 - Deposit/Redeem Batch Previous Rounds", async function () {
        await roundsOutputVault.connect(operatorAccount).nextRound();

        let currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        const assets = ethers.utils.parseEther("0.1");
        const shares = await fakeTargetVault.convertToShares(assets);

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares.div(2), unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledOnceWith(
            unpriviledgedAccount.address,
            roundsOutputVault.address,
            shares.div(2),
        );

        await roundsOutputVault.connect(operatorAccount).nextRound();

        // TODO: minting because the fake vault cannot transfer assets back
        await assetTokenMock.mint(roundsOutputVault.address, assets.div(2));

        currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(2);

        await roundsOutputVault.connect(unpriviledgedAccount).deposit(shares.div(2), unpriviledgedAccount.address);

        expect(fakeTargetVault.transferFrom).to.have.been.calledTwice;

        expectSolidityDeepCompare(
            [unpriviledgedAccount.address, roundsOutputVault.address, shares.div(2)],
            fakeTargetVault.transferFrom.getCall(1).args,
        );

        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(shares);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound.sub(1))).to.equal(
            shares.div(2),
        );
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(shares.div(2));

        // Advance round
        await roundsOutputVault.connect(operatorAccount).nextRound();

        // TODO: minting because the fake vault cannot transfer assets back
        await assetTokenMock.mint(roundsOutputVault.address, assets.div(2));

        currentRound = await roundsOutputVault.getCurrentRound();
        expect(currentRound).to.equal(3);

        await expect(
            roundsOutputVault
                .connect(unpriviledgedAccount)
                .redeem(currentRound.sub(2), shares.div(2), unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Can only redeem current round");

        await roundsOutputVault
            .connect(unpriviledgedAccount)
            .redeemExchangeAssetBatch(
                [currentRound.sub(2), currentRound.sub(1)],
                [shares.div(2), shares.div(2)],
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
            );

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsOutputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsOutputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);
    });
});
