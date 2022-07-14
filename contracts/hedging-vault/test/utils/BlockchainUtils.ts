import { ethers } from "hardhat";

export const DAY_IN_SECONDS = 86400;
export const WEEK_IN_SECONDS = 604800;

export async function fastForwardChain(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
}

export async function getCurrentBlock() {
    return ethers.provider.getBlock("latest");
}

export async function getCurrentTimestamp() {
    const currentBlock = await getCurrentBlock();
    return currentBlock.timestamp;
}

export async function getNextTimestamp() {
    return (await getCurrentTimestamp()) + 1;
}

export async function prepareNextTimestamp(): Promise<number> {
    const currentTimestamp = await getCurrentTimestamp();

    await ethers.provider.send("evm_setNextBlockTimestamp", [currentTimestamp + 1]);
    await ethers.provider.send("evm_mine", []);

    return currentTimestamp + 1;
}
