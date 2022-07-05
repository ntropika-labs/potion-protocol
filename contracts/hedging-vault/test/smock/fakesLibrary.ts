import { smock } from "@defi-wonderland/smock";
import {
    TestWrapperERC20PresetMinterPauser__factory,
    IPotionLiquidityPool,
    IPotionLiquidityPool__factory,
    IOpynController,
    IOpynController__factory,
    ISwapRouter,
    ISwapRouter__factory,
} from "../../typechain";

export async function mockERC20() {
    const ERC20Factory = await smock.mock<TestWrapperERC20PresetMinterPauser__factory>(
        "TestWrapperERC20PresetMinterPauser",
    );
    return ERC20Factory.deploy();
}

export async function mockPotionLiquidityPoolManager() {
    return smock.fake<IPotionLiquidityPool>(IPotionLiquidityPool__factory.abi);
}

export async function mockOpynController() {
    return smock.fake<IOpynController>(IOpynController__factory.abi);
}

export async function mockUniswapV3SwapRouter() {
    return smock.fake<ISwapRouter>(ISwapRouter__factory.abi);
}
