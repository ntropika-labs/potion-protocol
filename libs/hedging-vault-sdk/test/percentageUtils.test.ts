import { describe, expect, it } from "vitest";

import { formatUnits } from "@ethersproject/units";

import {
    addPercentage,
    applyPercentage,
    divByPercentage,
    fromSolidityPercentage,
    isPercentageInRange,
    subtractPercentage,
    toSolidityPercentage,
} from "../src/percentageUtils";
import { BigNumber } from "@ethersproject/bignumber";

describe("percentageUtils", () => {
    it("the percentage is created correctly", () => {
        const percentage = toSolidityPercentage(10);
        const floatingResult = fromSolidityPercentage(percentage);
        expect(floatingResult).toEqual(10);
    });
    it("checks if the percentage is in range", () => {
        expect(isPercentageInRange(10)).toBe(true);
        expect(isPercentageInRange(0)).toBe(true);
        expect(isPercentageInRange(-10)).toBe(false);
        expect(isPercentageInRange(110)).toBe(false);

        expect(isPercentageInRange(toSolidityPercentage(10))).toBe(true);
        expect(isPercentageInRange(toSolidityPercentage(0))).toBe(true);
        expect(isPercentageInRange(toSolidityPercentage(110))).toBe(false);
        expect(isPercentageInRange(toSolidityPercentage(100))).toBe(true);
    });
    it("adds the percentage to the given amount and returns the result", () => {
        const amount = BigNumber.from(100000000);
        const percentage = toSolidityPercentage(10);
        const result = addPercentage(amount, percentage);
        const formattedResult = parseFloat(formatUnits(result, 6));
        expect(formattedResult).toEqual(110);
    });
    it("substracts the percentage from the given amount and returns the result", () => {
        const amount = BigNumber.from(100000000);
        const percentage = toSolidityPercentage(10);
        const result = subtractPercentage(amount, percentage);
        const formattedResult = parseFloat(formatUnits(result, 6));
        expect(formattedResult).toEqual(90);
    });
    it("applies the given percentage to the given amount and returns the result", () => {
        const amount = BigNumber.from(150000000);
        const percentage = toSolidityPercentage(10);
        const result = applyPercentage(amount, percentage);
        const formattedResult = parseFloat(formatUnits(result, 6));
        expect(formattedResult).toEqual(15);
    });
    it("divides the given amount by the given percentage and returns the result", () => {
        const amount = BigNumber.from(150000000);
        const percentage = toSolidityPercentage(10);
        const result = divByPercentage(amount, percentage);
        const formattedResult = parseFloat(formatUnits(result, 6));
        expect(formattedResult).toEqual(1500);
    });
});
