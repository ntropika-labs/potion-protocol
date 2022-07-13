import { ethers } from "hardhat";

export const DAY_IN_SECONDS = 86400;
export const WEEK_IN_SECONDS = 604800;

export async function fastForwardChain(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
}
