import { HardhatUserConfig } from "hardhat/config";
import { getHardhatConfig } from "hardhat-helpers";

import "./tasks/accounts";
import "./tasks/clean";
import "./tasks/fast-forward";
import "./tasks/set-prices";

const userConfig: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                },
            },
            {
                version: "0.6.10",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                },
            },
        ],
    },
    abiExporter: {
        path: "./abis",
        runOnCompile: true,
        clear: true,
        flat: true,
        only: [
            // There are lots of contracts, which have many direct and indirect dependencies
            // To avoid clutter, we only export the ABIs that we need
            // As we are flattening the output, we must also take care not to avoid duplicate contract names or one will overwrite the other
            // These are generally used in the vue or subgraph code to test or interact with our contracts
            ":PotionLiquidityPool$",
            ":ICriteriaManager$",
            ":ICurveManager$",
            ":IERC20MetadataUpgradeable$",
            //":ERC20$",
            // scripts/compareAbis.ts checks that our interface definitions are up to date
            // To facilitate this, we dump ABIs for our interfaces and for each of the contracts they represent
            // Some of these are alos required for the vue or subgraph code
            "opynInterface/*",
            "gamma-protocol.*:Otoken$",
            "gamma-protocol.*:OtokenFactory$",
            "gamma-protocol.*:Whitelist$",
            "gamma-protocol.*:Controller$",
            "gamma-protocol.*:AddressBook$",
            "gamma-protocol.*:MarginCalculator$",
            "gamma-protocol.*:Oracle$",
            "gamma-protocol.*:ChainLinkPricer$",
        ],
        spacing: 2,
        pretty: false,
    },
};

export default getHardhatConfig(userConfig);
