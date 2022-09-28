import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";
import { ethers } from "hardhat";
import { IERC4626Upgradeable, IERC4626Upgradeable__factory } from "../../typechain";
import { MockERC20PresetMinterPauser } from "../../typechain";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getFakeTargetVault(
    underlyingAsset: MockContract<MockERC20PresetMinterPauser>,
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
    fakeTargetVault.transferFrom.returns(true);

    fakeTargetVault.asset.returns(underlyingAsset.address);
    fakeTargetVault.decimals.returns(18);

    return fakeTargetVault;
}
