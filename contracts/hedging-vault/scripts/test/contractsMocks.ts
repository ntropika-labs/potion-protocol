import {
    MockERC20PresetMinterPauser,
    MockPotionLiquidityPool,
    MockOpynController,
    MockOpynFactory,
    MockUniswapV3Router,
    MockOpynOracle,
    MockOpynAddressBook,
    MockERC4626,
} from "../../typechain";

import { MockContract } from "@defi-wonderland/smock";
import { Deployments, DeploymentFlags } from "contracts-utils";
import { Contract } from "ethers";

const MockOptions = DeploymentFlags.Export | DeploymentFlags.Mock;

async function mockContract<T extends Contract>(
    contractName: string,
    args: unknown[] = [],
    alias?: string,
): Promise<T | MockContract<T>> {
    return Deployments.deploy<T>(contractName, args, {
        options: MockOptions,
        alias,
    });
}

export async function mockERC20(
    alias: string,
): Promise<MockContract<MockERC20PresetMinterPauser> | MockERC20PresetMinterPauser> {
    return mockContract<MockERC20PresetMinterPauser>("MockERC20PresetMinterPauser", [], alias);
}

export async function mockPotionLiquidityPoolManager(): Promise<
    MockContract<MockPotionLiquidityPool> | MockPotionLiquidityPool
> {
    return mockContract<MockPotionLiquidityPool>("MockPotionLiquidityPool", [], "PotionLiquidityPool");
}

export async function mockOpynController(): Promise<MockContract<MockOpynController> | MockOpynController> {
    return mockContract<MockOpynController>("MockOpynController", [], "OpynController");
}

export async function mockOpynFactory(): Promise<MockContract<MockOpynFactory> | MockOpynFactory> {
    return mockContract<MockOpynFactory>("MockOpynFactory", [], "OpynFactory");
}

export async function mockUniswapV3SwapRouter(
    tokens: string[] = [],
): Promise<MockContract<MockUniswapV3Router> | MockUniswapV3Router> {
    return mockContract<MockUniswapV3Router>("MockUniswapV3Router", [tokens], "UniswapV3Router");
}

export async function mockOpynOracle(): Promise<MockContract<MockOpynOracle> | MockOpynOracle> {
    return mockContract<MockOpynOracle>("MockOpynOracle", [], "OpynOracle");
}

export async function mockOpynAddressBook(
    opynController: string,
    opynFactory: string,
    opynOracle: string,
): Promise<MockContract<MockOpynAddressBook> | MockOpynAddressBook> {
    return mockContract<MockOpynAddressBook>(
        "MockOpynAddressBook",
        [opynController, opynFactory, opynOracle],
        "OpynAddressBook",
    );
}

export async function mockERC4626(
    name: string,
    symbol: string,
    asset: string,
    alias: string,
): Promise<MockContract<MockERC4626> | MockERC4626> {
    return mockContract<MockERC4626>("MockERC4626", [name, symbol, asset], alias);
}
