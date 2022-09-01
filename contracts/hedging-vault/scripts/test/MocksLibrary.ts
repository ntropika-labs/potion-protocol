import { MockContract } from "@defi-wonderland/smock";
import { PotionHedgingVaultConfigParams } from "../config/deployConfig";
import { network, ethers } from "hardhat";

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
        true,
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
        true,
    );
}

export async function mockOpynController(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynController>;
    hardMock: MockOpynController;
    address: string;
}> {
    return mockContract<MockOpynController>(
        deploymentConfig.networkName,
        "MockOpynController",
        [],
        "OpynController",
        true,
    );
}

export async function mockOpynFactory(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynFactory>;
    hardMock: MockOpynFactory;
    address: string;
}> {
    return mockContract<MockOpynFactory>(deploymentConfig.networkName, "MockOpynFactory", [], "OpynFactory", true);
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
        true,
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
        true,
    );
}

export async function mockContract<T extends BaseContract>(
    networkName: string,
    contractName: string,
    parameters: unknown[] = [],
    alias?: string,
    fundMockWallet: boolean = false,
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

    if (softMock !== undefined && fundMockWallet) {
        await ethers.provider.send("hardhat_setBalance", [
            softMock.address,
            ethers.utils.hexStripZeros(ethers.utils.parseEther("10000").toHexString()),
        ]);
    }

    return { softMock, hardMock, address };
}

export declare type MockOrContract<T extends BaseContract> = T | MockContract<T>;

export function isMock<T extends BaseContract>(contract: MockOrContract<T>): contract is MockContract<T> {
    return (contract as MockContract<T>).wallet !== undefined && (contract as MockContract<T>).fallback !== undefined;
}

export function asMock<T extends BaseContract>(contract: MockOrContract<T>): MockContract<T> {
    if (isMock(contract)) {
        return contract as MockContract<T>;
    } else {
        throw new Error(`Contract with address ${contract.address} is not a mock`);
    }
}

export function ifMocksEnabled(fn: () => void): void {
    if (network.name === "hardhat") {
        fn();
    }
}
