import type { MockContract } from "@defi-wonderland/smock";
import { network, ethers } from "hardhat";

import { deploy, deployMock } from "../utils/deployment";
import type { BaseContract } from "ethers";

export async function mockContract<T extends BaseContract>(
  networkName: string,
  contractName: string,
  parameters: unknown[] = [],
  alias?: string,
  fundMockWallet = false
): Promise<{
  softMock?: MockContract<T>;
  hardMock: T;
  address: string;
}> {
  let softMock: MockContract<T> | undefined;
  let hardMock: T;
  let address: string;

  if (networkName === "hardhat") {
    softMock = await deployMock<T>(
      contractName,
      parameters,
      alias !== undefined ? { alias } : undefined
    );
    hardMock = softMock as unknown as T;
    address = softMock.address;
  } else {
    hardMock = (await deploy(
      contractName,
      parameters,
      alias !== undefined ? { alias } : undefined
    )) as T;
    address = hardMock.address;
  }

  if (softMock !== undefined && fundMockWallet) {
    await ethers.provider.send("hardhat_setBalance", [
      softMock.address,
      ethers.utils.hexStripZeros(
        ethers.utils.parseEther("10000").toHexString()
      ),
    ]);
  }

  return { softMock, hardMock, address };
}

export declare type MockOrContract<T extends BaseContract> =
  | T
  | MockContract<T>;

export function isMock<T extends BaseContract>(
  contract: MockOrContract<T>
): contract is MockContract<T> {
  return (
    (contract as MockContract<T>).wallet !== undefined &&
    (contract as MockContract<T>).fallback !== undefined
  );
}

export function asMock<T extends BaseContract>(
  contract: MockOrContract<T>
): MockContract<T> {
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
