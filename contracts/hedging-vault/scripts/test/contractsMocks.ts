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
import { mockContract } from "contracts-utils";

export async function mockERC20(
    networkName: string,
    alias: string,
): Promise<{
    softMock?: MockContract<MockERC20PresetMinterPauser>;
    hardMock: MockERC20PresetMinterPauser;
    address: string;
}> {
    return mockContract<MockERC20PresetMinterPauser>(networkName, "MockERC20PresetMinterPauser", [], alias, true);
}

export async function mockPotionLiquidityPoolManager(networkName: string): Promise<{
    softMock?: MockContract<MockPotionLiquidityPool>;
    hardMock: MockPotionLiquidityPool;
    address: string;
}> {
    return mockContract<MockPotionLiquidityPool>(
        networkName,
        "MockPotionLiquidityPool",
        [],
        "PotionLiquidityPool",
        true,
    );
}

export async function mockOpynController(networkName: string): Promise<{
    softMock?: MockContract<MockOpynController>;
    hardMock: MockOpynController;
    address: string;
}> {
    return mockContract<MockOpynController>(networkName, "MockOpynController", [], "OpynController", true);
}

export async function mockOpynFactory(networkName: string): Promise<{
    softMock?: MockContract<MockOpynFactory>;
    hardMock: MockOpynFactory;
    address: string;
}> {
    return mockContract<MockOpynFactory>(networkName, "MockOpynFactory", [], "OpynFactory", true);
}

export async function mockUniswapV3SwapRouter(
    networkName: string,
    tokens: string[] = [],
): Promise<{
    softMock?: MockContract<MockUniswapV3Router>;
    hardMock: MockUniswapV3Router;
    address: string;
}> {
    return mockContract<MockUniswapV3Router>(networkName, "MockUniswapV3Router", [tokens], "UniswapV3Router", true);
}

export async function mockOpynOracle(networkName: string): Promise<{
    softMock?: MockContract<MockOpynOracle>;
    hardMock: MockOpynOracle;
    address: string;
}> {
    return mockContract<MockOpynOracle>(networkName, "MockOpynOracle", [], "OpynOracle");
}

export async function mockOpynAddressBook(
    networkName: string,
    opynController: string,
    opynFactory: string,
    opynOracle: string,
): Promise<{
    softMock?: MockContract<MockOpynAddressBook>;
    hardMock: MockOpynAddressBook;
    address: string;
}> {
    return mockContract<MockOpynAddressBook>(
        networkName,
        "MockOpynAddressBook",
        [opynController, opynFactory, opynOracle],
        "OpynAddressBook",
        true,
    );
}

export async function mockERC4626(
    networkName: string,
    name: string,
    symbol: string,
    asset: string,
    alias: string,
): Promise<{
    softMock?: MockContract<MockERC4626>;
    hardMock: MockERC4626;
    address: string;
}> {
    return mockContract<MockERC4626>(networkName, "MockERC4626", [name, symbol, asset], alias, true);
}
