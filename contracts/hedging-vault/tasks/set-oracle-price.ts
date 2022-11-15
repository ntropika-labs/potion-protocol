import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("setOraclePrice", "Call the Oracle to set current prices for tokens, and/or to set expiry prices for otokens")
    .addParam("deployment", "The name of the deployment config to be used")
    .addOptionalParam("asset", "The name of the asset to set the price for", "UnderlyingAsset", types.string)
    .addParam("price", "The price in dollars", undefined, types.float, false)
    .setAction(async args => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { setChainlinkOraclePrice } = require("../scripts/lib/setChainlinkOraclePrice");
        await setChainlinkOraclePrice(args.deployment, args.asset, args.price);

        if (args.otoken) {
            // Import using require to avoid circular dependencies
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { setExpiryPrice } = require("../scripts/lib/setOpynExpiryPrice");
            console.log(`Processing otoken ${args.otoken}`);
            await setExpiryPrice(args.otoken, args.price);
        }
    });
