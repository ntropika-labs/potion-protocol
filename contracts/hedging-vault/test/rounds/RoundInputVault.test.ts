import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";

import { RoundsInputVaultUpgradeable, IERC4626Upgradeable } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { getFakeTargetVault } from "../utils/ERC4626Utils";

/**
    @notice VaultDeferredOperation unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("RoundsInputVault", function () {
    let adminAccount: SignerWithAddress;
    let operatorAccount: SignerWithAddress;
    let unpriviledgedAccount: SignerWithAddress;
    let roundsInputVault: RoundsInputVaultUpgradeable;
    let assetTokenMock: MockContract<MockERC20PresetMinterPauser>;
    let fakeTargetVault: FakeContract<IERC4626Upgradeable>;

    beforeEach(async function () {
        adminAccount = (await ethers.getSigners())[0];
        operatorAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount = (await ethers.getSigners())[2];

        const ERC20MockFactory = await smock.mock("MockERC20PresetMinterPauser");
        assetTokenMock = (await ERC20MockFactory.deploy()) as unknown as MockContract<MockERC20PresetMinterPauser>;

        const RoundsInputVaultFactory = await ethers.getContractFactory("RoundsInputVaultUpgradeable");
        roundsInputVault = (await RoundsInputVaultFactory.deploy()) as RoundsInputVaultUpgradeable;

        fakeTargetVault = await getFakeTargetVault(assetTokenMock);

        await roundsInputVault.initialize(
            adminAccount.address,
            operatorAccount.address,
            fakeTargetVault.address,
            "SomeURI",
        );

        await assetTokenMock.mint(unpriviledgedAccount.address, ethers.utils.parseEther("1"));
        await assetTokenMock
            .connect(unpriviledgedAccount)
            .approve(roundsInputVault.address, ethers.utils.parseEther("1"));

        assetTokenMock.approve.reset();
    });

    it("RIV0001 - Default Value", async function () {
        expect(await roundsInputVault.getCurrentRound()).to.equal(0);
        expect(await roundsInputVault.exchangeAsset()).to.equal(fakeTargetVault.address);
        expect(await roundsInputVault.getExchangeRate(0)).to.equal(0);
    });

    it("RIV0002 - Deposit Round 0", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);
        const currentRound = await roundsInputVault.getCurrentRound();

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(assets);
    });

    it("RIV0003 - Next Round", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);
        const currentRound = await roundsInputVault.getCurrentRound();

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);

        const tx = roundsInputVault.connect(operatorAccount).nextRound();
        await expect(tx)
            .to.emit(roundsInputVault, "AssetsDeposited")
            .withArgs(currentRound, operatorAccount.address, assets, shares);

        await expect(tx).to.emit(roundsInputVault, "NextRound").withArgs(currentRound.add(1));

        expect(await roundsInputVault.getCurrentRound()).to.equal(currentRound.add(1));
    });

    it("RIV0004 - Deposit Round 1", async function () {
        await roundsInputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(assets);
    });

    it("RIV0005 - Deposit/Redeem Same Round", async function () {
        await roundsInputVault.connect(operatorAccount).nextRound();
        await roundsInputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(2);

        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(assets);

        await expect(
            roundsInputVault
                .connect(unpriviledgedAccount)
                .redeemExchangeAsset(currentRound, assets, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Exchange asset only available for previous rounds");

        await roundsInputVault
            .connect(unpriviledgedAccount)
            .redeem(currentRound, assets, unpriviledgedAccount.address, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(ethers.utils.parseEther("1.0"));
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);
    });

    it("RIV0006 - Deposit/Redeem Batch Same Round", async function () {
        await roundsInputVault.connect(operatorAccount).nextRound();
        await roundsInputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(2);

        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(assets);

        await expect(
            roundsInputVault
                .connect(unpriviledgedAccount)
                .redeemExchangeAsset(currentRound, assets, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Exchange asset only available for previous rounds");

        await roundsInputVault
            .connect(unpriviledgedAccount)
            .redeemBatch(
                [currentRound, currentRound],
                [assets.div(2), assets.div(2)],
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
            );

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(ethers.utils.parseEther("1.0"));
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);
    });

    it("RIV0007 - Deposit/Redeem Previous Round", async function () {
        await roundsInputVault.connect(operatorAccount).nextRound();

        const currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(assets);

        // Advance round
        await roundsInputVault.connect(operatorAccount).nextRound();

        await expect(
            roundsInputVault
                .connect(unpriviledgedAccount)
                .redeem(currentRound, assets, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Can only redeem current round");

        await roundsInputVault
            .connect(unpriviledgedAccount)
            .redeemExchangeAsset(currentRound, assets, unpriviledgedAccount.address, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);

        expect(fakeTargetVault.transfer).to.have.been.calledOnceWith(unpriviledgedAccount.address, shares);
    });

    it("RIV0008 - Deposit/Redeem Batch Previous Rounds", async function () {
        await roundsInputVault.connect(operatorAccount).nextRound();

        let currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(1);

        const shares = ethers.utils.parseEther("0.2");
        const assets = await roundsInputVault.convertToAssets(shares);

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets.div(2), unpriviledgedAccount.address);

        await roundsInputVault.connect(operatorAccount).nextRound();

        // TODO: Need to spend the allowance manually until Smock fixes their async returns issue
        await assetTokenMock.mockSpendAllowance(roundsInputVault.address, fakeTargetVault.address, assets.div(2));

        currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(2);

        await roundsInputVault.connect(unpriviledgedAccount).deposit(assets.div(2), unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound.sub(1))).to.equal(
            assets.div(2),
        );
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(assets.div(2));

        // Advance round
        await roundsInputVault.connect(operatorAccount).nextRound();

        // TODO: Need to spend the allowance manually until Smock fixes their async returns issue
        await assetTokenMock.mockSpendAllowance(roundsInputVault.address, fakeTargetVault.address, assets.div(2));

        currentRound = await roundsInputVault.getCurrentRound();
        expect(currentRound).to.equal(3);

        await expect(
            roundsInputVault
                .connect(unpriviledgedAccount)
                .redeem(currentRound.sub(2), assets, unpriviledgedAccount.address, unpriviledgedAccount.address),
        ).to.be.revertedWith("Can only redeem current round");

        await roundsInputVault
            .connect(unpriviledgedAccount)
            .redeemExchangeAssetBatch(
                [currentRound.sub(2), currentRound.sub(1)],
                [assets.div(2), assets.div(2)],
                unpriviledgedAccount.address,
                unpriviledgedAccount.address,
            );

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await roundsInputVault.balanceOfAll(unpriviledgedAccount.address)).to.equal(0);
        expect(await roundsInputVault.balanceOf(unpriviledgedAccount.address, currentRound)).to.equal(0);

        expect(fakeTargetVault.transfer).to.have.been.calledOnceWith(unpriviledgedAccount.address, shares);
    });
});
