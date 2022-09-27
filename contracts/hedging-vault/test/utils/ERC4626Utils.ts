import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";
import { ethers } from "hardhat";
import { IERC4626Upgradeable, IERC4626Upgradeable__factory } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";

export async function getFakeTargetVault(
    underlyingAsset: string | undefined = undefined,
): Promise<FakeContract<IERC4626Upgradeable>> {
    const fakeTargetVault = await smock.fake<IERC4626Upgradeable>(IERC4626Upgradeable__factory.abi);

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
    fakeTargetVault.transfer.returns(true);

    if (underlyingAsset) {
        fakeTargetVault.asset.returns(underlyingAsset);
    } else {
        const ERC20MockFactory = await smock.mock("MockERC20PresetMinterPauser");
        const assetTokenMock =
            (await ERC20MockFactory.deploy()) as unknown as MockContract<MockERC20PresetMinterPauser>;
        fakeTargetVault.asset.returns(assetTokenMock.address);
    }

    return fakeTargetVault;
}
