import { ethers } from "hardhat";

export function getEncodedSwapPath(tokensPath: string[], fee: number = 3000): string {
    const types = [];
    const values = [];

    for (let i = 0; i < tokensPath.length; i++) {
        types.push("address");
        values.push(tokensPath[i]);

        if (i !== tokensPath.length - 1) {
            types.push("uint24");
            values.push(fee);
        }
    }

    return ethers.utils.solidityPack(types, values);
}
