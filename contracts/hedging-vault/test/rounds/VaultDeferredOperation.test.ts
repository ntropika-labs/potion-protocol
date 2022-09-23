import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";

import { TestWrapperVaultDeferredOperation, IERC4626Upgradeable, IERC4626Upgradeable__factory } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

/**
    @notice VaultDeferredOperation unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("VaultDeferredOperation", function () {
    let unpriviledgedAccount: SignerWithAddress;
    let unpriviledgedAccount2: SignerWithAddress;
    let vaultDeferredOperation: TestWrapperVaultDeferredOperation;
    let assetTokenMock: MockContract<MockERC20PresetMinterPauser>;
    let fakeTargetVault: FakeContract<IERC4626Upgradeable>;

    async function getFakeTargetVault(): Promise<FakeContract<IERC4626Upgradeable>> {
        fakeTargetVault = await smock.fake<IERC4626Upgradeable>(IERC4626Upgradeable__factory.abi);

        fakeTargetVault.convertToShares.returns((args: any) => {
            return args.assets.mul(2);
        });
        fakeTargetVault.convertToAssets.returns((args: any) => {
            return args.shares.div(2);
        });
        fakeTargetVault.maxDeposit.returns(ethers.constants.MaxUint256);
        fakeTargetVault.maxMint.returns(ethers.constants.MaxUint256);
        fakeTargetVault.previewDeposit.returns((args: any) => {
            return args.assets.mul(2);
        });
        fakeTargetVault.previewMint.returns((args: any) => {
            return args.shares.div(2);
        });
        fakeTargetVault.previewRedeem.returns((args: any) => {
            return args.shares.div(2);
        });

        fakeTargetVault.redeem.returns((args: any) => {
            return args.shares.div(2);
        });
        fakeTargetVault.deposit.returns((args: any) => {
            return args.assets.mul(2);
        });

        fakeTargetVault.approve.returns(true);

        return fakeTargetVault;
    }

    beforeEach(async function () {
        unpriviledgedAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount2 = (await ethers.getSigners())[2];

        const ERC20MockFactory = await smock.mock("MockERC20PresetMinterPauser");
        assetTokenMock = (await ERC20MockFactory.deploy()) as unknown as MockContract<MockERC20PresetMinterPauser>;

        const VaultDeferredOperationFactory = await ethers.getContractFactory("TestWrapperVaultDeferredOperation");
        vaultDeferredOperation = (await VaultDeferredOperationFactory.deploy()) as TestWrapperVaultDeferredOperation;

        fakeTargetVault = await getFakeTargetVault();

        await vaultDeferredOperation.initialize(fakeTargetVault.address, assetTokenMock.address, "SomeURI");

        await assetTokenMock.mint(unpriviledgedAccount.address, ethers.utils.parseEther("1"));
        await assetTokenMock
            .connect(unpriviledgedAccount)
            .approve(vaultDeferredOperation.address, ethers.utils.parseEther("1"));

        await assetTokenMock.mint(unpriviledgedAccount2.address, ethers.utils.parseEther("1"));
        await assetTokenMock
            .connect(unpriviledgedAccount2)
            .approve(vaultDeferredOperation.address, ethers.utils.parseEther("1"));

        assetTokenMock.approve.reset();
    });

    it("Default Values", async function () {
        expect(await vaultDeferredOperation.vault()).to.equal(fakeTargetVault.address);
        expect(await vaultDeferredOperation.asset()).to.equal(assetTokenMock.address);
        expect(await vaultDeferredOperation.convertToShares(1)).to.equal(2);
        expect(await vaultDeferredOperation.convertToAssets(2)).to.equal(1);
        expect(await vaultDeferredOperation.maxDeposit(unpriviledgedAccount.address)).to.equal(
            ethers.constants.MaxUint256,
        );
        expect(await vaultDeferredOperation.maxMint(unpriviledgedAccount.address)).to.equal(
            ethers.constants.MaxUint256,
        );
        expect(await vaultDeferredOperation.previewDeposit(100)).to.equal(200);
        expect(await vaultDeferredOperation.previewMint(100)).to.equal(50);
        expect(await vaultDeferredOperation.previewRedeem(200)).to.equal(100);
    });

    it("Mint", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await vaultDeferredOperation.convertToAssets(shares);

        await vaultDeferredOperation.connect(unpriviledgedAccount).mint(shares, unpriviledgedAccount.address);

        expect(await assetTokenMock.balanceOf(unpriviledgedAccount.address)).to.equal(
            ethers.utils.parseEther("1.0").sub(assets),
        );
        expect(await vaultDeferredOperation.balanceOfAll(unpriviledgedAccount.address)).to.equal(assets);
    });

    it("Deposit From Target", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await vaultDeferredOperation.convertToAssets(shares);

        await vaultDeferredOperation.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);
        await vaultDeferredOperation.connect(unpriviledgedAccount).depositOnTarget(assets);

        expect(fakeTargetVault.deposit).to.be.calledOnceWith(assets, vaultDeferredOperation.address);
        expect(assetTokenMock.approve).to.be.calledOnceWith(fakeTargetVault.address, assets);
    });

    it("Redeem On Target", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await vaultDeferredOperation.convertToAssets(shares);

        await vaultDeferredOperation.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);
        await vaultDeferredOperation.connect(unpriviledgedAccount).redeemFromTarget(shares);

        expect(fakeTargetVault.redeem).to.be.calledOnceWith(
            shares,
            vaultDeferredOperation.address,
            vaultDeferredOperation.address,
        );
        expect(fakeTargetVault.approve).to.be.calledOnceWith(fakeTargetVault.address, shares);
    });
});
