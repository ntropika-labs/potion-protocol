import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MockContract } from "@defi-wonderland/smock";
import { mockERC20, mockERC4626 } from "../../scripts/test/contractsMocks";
import {
    ifMocksEnabled,
    asMock,
    Deployments,
    ProviderTypes,
    DeploymentNetwork,
    DeploymentFlags,
} from "contracts-utils";

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

    before(function () {
        Deployments.initialize({
            type: {
                provider: network.name === "localhost" ? ProviderTypes.Hardhat : ProviderTypes.Internal,
                network: DeploymentNetwork.Develop,
                config: "test",
            },
            options: DeploymentFlags.None,
        });
    });

    beforeEach(async function () {
        unpriviledgedAccount = (await ethers.getSigners())[1];
        unpriviledgedAccount2 = (await ethers.getSigners())[2];

        assetToken = await mockERC20("AssetToken");

        const VaultDeferredOperationFactory = await ethers.getContractFactory("TestWrapperVaultDeferredOperation");
        vaultDeferredOperation = (await VaultDeferredOperationFactory.deploy()) as TestWrapperVaultDeferredOperation;

        targetVault = await mockERC4626("TestVault", "TSTV", assetToken.address, "InvestmentVault");

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
        });
    });
});
