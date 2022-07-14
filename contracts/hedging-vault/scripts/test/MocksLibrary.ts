import { MockContract } from "@defi-wonderland/smock";
import { PotionHedgingVaultConfigParams } from "../config/deployConfig";

import {
    MockERC20PresetMinterPauser,
    MockPotionLiquidityPool,
    MockOpynController,
    MockOpynFactory,
    MockUniswapV3Router,
} from "../../typechain";

import { deploy, deployMock } from "../utils/deployment";

export async function mockERC20(
    deploymentConfig: PotionHedgingVaultConfigParams,
    alias: string,
): Promise<{
    softMock?: MockContract<MockERC20PresetMinterPauser>;
    hardMock: MockERC20PresetMinterPauser;
    address: string;
}> {
    let softMock: MockContract<MockERC20PresetMinterPauser> | undefined;
    let hardMock: MockERC20PresetMinterPauser;
    let address: string;

    if (deploymentConfig.networkName === "hardhat") {
        softMock = await deployMock<MockERC20PresetMinterPauser>("MockERC20PresetMinterPauser", [], { alias });
        hardMock = softMock as unknown as MockERC20PresetMinterPauser;
        address = softMock.address;
    } else {
        hardMock = (await deploy("MockERC20PresetMinterPauser", [], { alias })) as MockERC20PresetMinterPauser;
        address = hardMock.address;
    }

    return { softMock, hardMock, address };
}

export async function mockPotionLiquidityPoolManager(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockPotionLiquidityPool>;
    hardMock: MockPotionLiquidityPool;
    address: string;
}> {
    let softMock: MockContract<MockPotionLiquidityPool> | undefined;
    let hardMock: MockPotionLiquidityPool;
    let address: string;

    if (deploymentConfig.networkName === "hardhat") {
        softMock = await deployMock<MockPotionLiquidityPool>("MockPotionLiquidityPool");
        hardMock = softMock as unknown as MockPotionLiquidityPool;
        address = softMock.address;
    } else {
        hardMock = (await deploy("MockPotionLiquidityPool")) as MockPotionLiquidityPool;
        address = hardMock.address;
    }

    return { softMock, hardMock, address };
}

export async function mockOpynController(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynController>;
    hardMock: MockOpynController;
    address: string;
}> {
    let softMock: MockContract<MockOpynController> | undefined;
    let hardMock: MockOpynController;
    let address: string;

    if (deploymentConfig.networkName === "hardhat") {
        softMock = await deployMock<MockOpynController>("MockOpynController");
        hardMock = softMock as unknown as MockOpynController;
        address = softMock.address;
    } else {
        hardMock = (await deploy("MockOpynController")) as MockOpynController;
        address = hardMock.address;
    }

    return { softMock, hardMock, address };
}

export async function mockOpynFactory(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockOpynFactory>;
    hardMock: MockOpynFactory;
    address: string;
}> {
    let softMock: MockContract<MockOpynFactory> | undefined;
    let hardMock: MockOpynFactory;
    let address: string;

    if (deploymentConfig.networkName === "hardhat") {
        softMock = await deployMock<MockOpynFactory>("MockOpynFactory");
        hardMock = softMock as unknown as MockOpynFactory;
        address = softMock.address;
    } else {
        hardMock = (await deploy("MockOpynFactory")) as MockOpynFactory;
        address = hardMock.address;
    }

    return { softMock, hardMock, address };
}

export async function mockUniswapV3SwapRouter(deploymentConfig: PotionHedgingVaultConfigParams): Promise<{
    softMock?: MockContract<MockUniswapV3Router>;
    hardMock: MockUniswapV3Router;
    address: string;
}> {
    let softMock: MockContract<MockUniswapV3Router> | undefined;
    let hardMock: MockUniswapV3Router;
    let address: string;

    if (deploymentConfig.networkName === "hardhat") {
        softMock = await deployMock<MockUniswapV3Router>("MockUniswapV3Router");
        hardMock = softMock as unknown as MockUniswapV3Router;
        address = softMock.address;
    } else {
        hardMock = (await deploy("MockUniswapV3Router")) as MockUniswapV3Router;
        address = hardMock.address;
    }

    return { softMock, hardMock, address };
}
