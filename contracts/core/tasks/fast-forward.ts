import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("fastForward", "Fast forward time (only works for local test networks)")
    .addOptionalParam(
        "seconds",
        "Number of seconds by which the blockchain should advance time (default: one year)",
        31556952,
        types.int,
    )
    .setAction(async (args, hre) => {
        // Default to one year
        await hre.ethers.provider.send("evm_increaseTime", [args.seconds]);
        await hre.ethers.provider.send("evm_mine", []);
        console.log(`Fast forwarded time by ${args.seconds} seconds (${args.seconds / (60 * 60 * 24)} days)`);
    });
