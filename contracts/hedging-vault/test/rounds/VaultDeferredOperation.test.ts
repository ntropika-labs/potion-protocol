import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MockContract } from "@defi-wonderland/smock";
import { asMock, ifMocksEnabled, mockERC20, mockERC4626 } from "../../scripts/test/MocksLibrary";

import { TestWrapperVaultDeferredOperation, ERC4626, ERC20PresetMinterPauser } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

/**
    @notice VaultDeferredOperation unit tests    
    
    @author Roberto Cano <robercano>
 */
describe("VaultDeferredOperation", function () {
    let unpriviledgedAccount: SignerWithAddress;
    let unpriviledgedAccount2: SignerWithAddress;
    let vaultDeferredOperation: TestWrapperVaultDeferredOperation;
    let assetToken: ERC20PresetMinterPauser | MockContract<ERC20PresetMinterPauser>;
    let targetVault: ERC4626 | MockContract<ERC4626>;

    beforeEach(async function () {
        unpriviledgedAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount2 = (await ethers.getSigners())[2];

        const mockERC20Result = await mockERC20(network.name, "AssetToken");

        assetToken = mockERC20Result.softMock ? mockERC20Result.softMock : mockERC20Result.hardMock;

        const VaultDeferredOperationFactory = await ethers.getContractFactory("TestWrapperVaultDeferredOperation");
        vaultDeferredOperation = (await VaultDeferredOperationFactory.deploy()) as TestWrapperVaultDeferredOperation;

        const mockERC4626Result = await mockERC4626(
            network.name,
            "TestVault",
            "TSTV",
            assetToken.address,
            "InvestmentVault",
        );
        targetVault = mockERC4626Result.softMock ? mockERC4626Result.softMock : mockERC4626Result.hardMock;

        await vaultDeferredOperation.initialize(targetVault.address, assetToken.address, "SomeURI");

        await assetToken.mint(unpriviledgedAccount.address, ethers.utils.parseEther("1"));
        await assetToken
            .connect(unpriviledgedAccount)
            .approve(vaultDeferredOperation.address, ethers.utils.parseEther("1"));

        await assetToken.mint(unpriviledgedAccount2.address, ethers.utils.parseEther("1"));
        await assetToken
            .connect(unpriviledgedAccount2)
            .approve(vaultDeferredOperation.address, ethers.utils.parseEther("1"));

        ifMocksEnabled(() => {
            asMock(assetToken).approve.reset();
        });
    });

    it("VDO0001 - Default Value", async function () {
        expect(await vaultDeferredOperation.vault()).to.equal(targetVault.address);
        expect(await vaultDeferredOperation.asset()).to.equal(assetToken.address);
    });

    it("VDO0002 - Deposit On Target", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await targetVault.convertToAssets(shares);

        await vaultDeferredOperation.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);
        await vaultDeferredOperation.connect(unpriviledgedAccount).depositOnTarget(assets);

        ifMocksEnabled(() => {
            expect(asMock(targetVault).deposit).to.be.calledOnceWith(assets, vaultDeferredOperation.address);
            expect(asMock(assetToken).approve).to.be.calledOnceWith(targetVault.address, assets);
        });
    });

    it("VDO0003 - Redeem From Target", async function () {
        const shares = ethers.utils.parseEther("0.2");
        const assets = await targetVault.convertToAssets(shares);

        await vaultDeferredOperation.connect(unpriviledgedAccount).deposit(assets, unpriviledgedAccount.address);
        await vaultDeferredOperation.connect(unpriviledgedAccount).redeemFromTarget(shares);

        ifMocksEnabled(() => {
            expect(asMock(targetVault).redeem).to.be.calledOnceWith(
                shares,
                vaultDeferredOperation.address,
                vaultDeferredOperation.address,
            );
            expect(asMock(targetVault).approve).to.be.calledOnceWith(targetVault.address, shares);
        });
    });
});
