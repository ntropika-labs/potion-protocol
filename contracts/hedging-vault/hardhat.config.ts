import { HardhatUserConfig } from "hardhat/config";
import { getHardhatConfig } from "hardhat-helpers";

import "./tasks/accounts";
import "./tasks/clean";
import "./tasks/fast-forward";
import "./tasks/set-oracle-price";

const userConfig: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.14",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 250,
                    },
                    outputSelection: {
                        "*": {
                            "*": ["storageLayout"],
                        },
                    },
                },
            },
        ],
    },
};

export default getHardhatConfig(userConfig);
