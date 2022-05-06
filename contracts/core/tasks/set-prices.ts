import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("setPrices", "Call the Oracle to set current prices for tokens, and/or to set expiry prices for otokens")
    .addOptionalParam("token", "The token to set the price for (optional)", "", types.string)
    .addOptionalParam("otoken", "The otoken to set the expiry prices for (optional)", "", types.string)
    .addParam("price", "The price in dollars", undefined, types.float, false)
    .setAction(async args => {
        if (args.otoken) {
            // Import using require to avoid circular dependencies
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { setExpiryPrice } = require("./scripts/lib/setExpiryPrice");
            console.log(`Processing otoken ${args.otoken}`);
            await setExpiryPrice(args.otoken, args.price);
        }
        if (args.token) {
            // Import using require to avoid circular dependencies
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { setPrice } = require("./scripts/lib/setCurrentPrice");
            console.log(`Processing token ${args.token}`);
            await setPrice(args.token, args.price);
        }
    });
