import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";

import { TestWrapperVaultDeferredOperation, IERC4626Upgradeable, IERC4626Upgradeable__factory } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { getFakeTargetVault } from "../utils/ERC4626Utils";

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

    beforeEach(async function () {
        unpriviledgedAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount2 = (await ethers.getSigners())[2];

        const ERC20MockFactory = await smock.mock("MockERC20PresetMinterPauser");
        assetTokenMock = (await ERC20MockFactory.deploy()) as unknown as MockContract<MockERC20PresetMinterPauser>;

        const VaultDeferredOperationFactory = await ethers.getContractFactory("TestWrapperVaultDeferredOperation");
        vaultDeferredOperation = (await VaultDeferredOperationFactory.deploy()) as TestWrapperVaultDeferredOperation;

        fakeTargetVault = await getFakeTargetVault(assetTokenMock);

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

    it("VDO0001 - Default Value", async function () {
        expect(await vaultDeferredOperation.vault()).to.equal(fakeTargetVault.address);
        expect(await vaultDeferredOperation.asset()).to.equal(assetTokenMock.address);
    });

    it("VDO0002 - Deposit On Target", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await fakeTargetVault.convertToAssets(shares);

        await vaultDeferredOperation.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);
        await vaultDeferredOperation.connect(unpriviledgedAccount).depositOnTarget(assets);

        expect(fakeTargetVault.deposit).to.be.calledOnceWith(assets, vaultDeferredOperation.address);
        expect(assetTokenMock.approve).to.be.calledOnceWith(fakeTargetVault.address, assets);
    });

    it("VDO0003 - Redeem From Target", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await fakeTargetVault.convertToAssets(shares);

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
