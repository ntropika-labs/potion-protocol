import { expect } from "chai";
import { BigNumber } from "ethers";

export function expectSolidityDeepCompare(tsObject: any, solidityReturnObject: any) {
    for (const key of Object.keys(tsObject)) {
        expect(Object.keys(solidityReturnObject).includes(key)).to.be.true;

        const tsValue = tsObject[key];

        if (
            typeof tsValue !== "string" &&
            typeof tsValue !== "number" &&
            typeof tsValue !== "boolean" &&
            !(tsValue instanceof BigNumber)
        ) {
            const solidityValue = solidityReturnObject[key];
            expectSolidityDeepCompare(tsValue, solidityValue);
        } else {
            expect(solidityReturnObject[key]).to.deep.equal(tsObject[key]);
        }
    }
}
