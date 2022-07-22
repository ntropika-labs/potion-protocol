import { MockContract } from "@defi-wonderland/smock";
import { PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { network } from "hardhat";

import {
    MockERC20PresetMinterPauser,
    MockPotionLiquidityPool,
    MockOpynController,
    MockOpynFactory,
    MockUniswapV3Router,
    MockOpynOracle,
    MockOpynAddressBook,
} from "../../typechain";

import { deploy, deployMock } from "../utils/deployment";
import { BaseContract } from "ethers";

export async function mockERC20(
    deploymentConfig: PotionHedgingVaultConfigParams,
    alias: string,
): Promise<{
    softMock?: MockContract<MockERC20PresetMinterPauser>;
    hardMock: MockERC20PresetMinterPauser;
    address: string;
}> {
    return mockContract<MockERC20PresetMinterPauser>(
        deploymentConfig.networkName,
        "MockERC20PresetMinterPauser",
        [],
        alias,
    );
}

export async function mockPotionLiquidityPoolManager(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockPotionLiquidityPool>;
    hardMock: MockPotionLiquidityPool;
    address: string;
}> {
    return mockContract<MockPotionLiquidityPool>(
        deploymentConfig.networkName,
        "MockPotionLiquidityPool",
        [],
        "PotionLiquidityPool",
    );
}

export async function mockOpynController(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynController>;
    hardMock: MockOpynController;
    address: string;
}> {
    return mockContract<MockOpynController>(deploymentConfig.networkName, "MockOpynController", [], "OpynController");
}

export async function mockOpynFactory(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynFactory>;
    hardMock: MockOpynFactory;
    address: string;
}> {
    return mockContract<MockOpynFactory>(deploymentConfig.networkName, "MockOpynFactory", [], "OpynFactory");
}

export async function mockUniswapV3SwapRouter(
    deploymentConfig: PotionHedgingVaultConfigParams,
    tokens: string[] = [],
): Promise<{
    softMock?: MockContract<MockUniswapV3Router>;
    hardMock: MockUniswapV3Router;
    address: string;
}> {
    return mockContract<MockUniswapV3Router>(
        deploymentConfig.networkName,
        "MockUniswapV3Router",
        [tokens],
        "UniswapV3Router",
    );
}

export async function mockOpynOracle(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynOracle>;
    hardMock: MockOpynOracle;
    address: string;
}> {
    return mockContract<MockOpynOracle>(deploymentConfig.networkName, "MockOpynOracle", [], "OpynOracle");
}

export async function mockOpynAddressBook(
    deploymentConfig: PotionHedgingVaultConfigParams,
    opynController: string,
    opynFactory: string,
    opynOracle: string,
): Promise<{
    softMock?: MockContract<MockOpynAddressBook>;
    hardMock: MockOpynAddressBook;
    address: string;
}> {
    return mockContract<MockOpynAddressBook>(
        deploymentConfig.networkName,
        "MockOpynAddressBook",
        [opynController, opynFactory, opynOracle],
        "OpynAddressBook",
    );
}

export async function mockContract<T extends BaseContract>(
    networkName: string,
    contractName: string,
    parameters: any = [],
    alias?: string,
): Promise<{
    softMock?: MockContract<T>;
    hardMock: T;
    address: string;
}> {
    let softMock: MockContract<T> | undefined;
    let hardMock: T;
    let address: string;

    if (networkName === "hardhat") {
        softMock = await deployMock<T>(contractName, parameters, alias !== undefined ? { alias } : undefined);
        hardMock = softMock as unknown as T;
        address = softMock.address;
    } else {
        hardMock = (await deploy(contractName, parameters, alias !== undefined ? { alias } : undefined)) as T;
        address = hardMock.address;
    }
    return { softMock, hardMock, address };
}

export declare type MockOrContract<T extends BaseContract> = T | MockContract<T>;

export function isMock<T extends BaseContract>(contract: MockOrContract<T>): contract is MockContract<T> {
    return (contract as MockContract<T>).wallet !== undefined && (contract as MockContract<T>).fallback !== undefined;
}

export function asMock<T extends BaseContract>(contract: MockOrContract<T>): MockContract<T> | undefined {
    return isMock(contract) ? (contract as MockContract<T>) : undefined;
}

export function ifMocksEnabled(fn: () => void): void {
    if (network.name === "hardhat") {
        fn();
    }
}
