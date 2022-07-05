import { smock } from "@defi-wonderland/smock";
import {
    IERC20,
    IERC20__factory,
    IPotionLiquidityPool,
    IPotionLiquidityPool__factory,
    IOpynController,
    IOpynController__factory,
    ISwapRouter,
    ISwapRouter__factory,
} from "../../typechain";

export async function fakeERC20() {
    return smock.fake<IERC20>(IERC20__factory.abi);
}

export async function fakePotionLiquidityPoolManager() {
    return smock.fake<IPotionLiquidityPool>(IPotionLiquidityPool__factory.abi);
}

export async function fakeOpynController() {
    return smock.fake<IOpynController>(IOpynController__factory.abi);
}

export async function fakeUniswapV3SwapRouter() {
    return smock.fake<ISwapRouter>(ISwapRouter__factory.abi);
}
