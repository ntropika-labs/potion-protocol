import { describe, expect, it } from "vitest";
import { parsePercentage, parsePriceInUSDC, parseAmount, convertAmountToUSDC } from "../src/utils";
import { BigNumber } from "ethers";

describe.only("utils", () => {
    // parsePercentage
    it("parse percentage number", () => {
        expect(parsePercentage(0.5).toString()).toBe("500000");
        expect(parsePercentage(3.5).toString()).toBe("3500000");
        expect(parsePercentage(64.8).toString()).toBe("64800000");
    });
    it("parse percentage string", () => {
        expect(parsePercentage("0.5").toString()).toBe("500000");
        expect(parsePercentage("3.5").toString()).toBe("3500000");
        expect(parsePercentage("64.8").toString()).toBe("64800000");
    });
    it("parse percentage bignumber", () => {
        expect(parsePercentage(BigNumber.from(500000)).toString()).toBe("500000");
        expect(parsePercentage(BigNumber.from(3500000)).toString()).toBe("3500000");
        expect(parsePercentage(BigNumber.from(64800000)).toString()).toBe("64800000");
    });

    // parsePriceInUSDC
    it("parse price in usdc number", () => {
        expect(parsePriceInUSDC(0.5).toString()).toBe("500000");
        expect(parsePriceInUSDC(3.5).toString()).toBe("3500000");
        expect(parsePriceInUSDC(64.8).toString()).toBe("64800000");
    });
    it("parse price in usdc string", () => {
        expect(parsePriceInUSDC("0.5").toString()).toBe("500000");
        expect(parsePriceInUSDC("3.5").toString()).toBe("3500000");
        expect(parsePriceInUSDC("64.8").toString()).toBe("64800000");
    });
    it("parse price in usdc bignumber", () => {
        expect(parsePriceInUSDC(BigNumber.from(500000)).toString()).toBe("500000");
        expect(parsePriceInUSDC(BigNumber.from(3500000)).toString()).toBe("3500000");
        expect(parsePriceInUSDC(BigNumber.from(64800000)).toString()).toBe("64800000");
    });

    // parseAmount
    it("parse amount number", () => {
        expect(parseAmount(0.5, 6).toString()).toBe("500000");
        expect(parseAmount(3.5, 12).toString()).toBe("3500000000000");
        expect(parseAmount(64.8, "18").toString()).toBe("64800000000000000000");
        expect(parseAmount(64.8, BigNumber.from(4)).toString()).toBe("648000");
    });
    it("parse amount string", () => {
        expect(parseAmount("0.5", 6).toString()).toBe("500000");
        expect(parseAmount("3.5", 12).toString()).toBe("3500000000000");
        expect(parseAmount("64.8", "18").toString()).toBe("64800000000000000000");
        expect(parseAmount("64.8", BigNumber.from(4)).toString()).toBe("648000");
    });
    it("parse amount bignumber", () => {
        expect(parseAmount(BigNumber.from(500000), 6).toString()).toBe("500000");
        expect(parseAmount(BigNumber.from(3500000000000), 12).toString()).toBe("3500000000000");
        expect(parseAmount(BigNumber.from("64800000000000000000"), "18").toString()).toBe("64800000000000000000");
        expect(parseAmount(BigNumber.from(648000), BigNumber.from(4)).toString()).toBe("648000");
    });

    // convertAmountToUSDC
    it("convert amount to usdc number", () => {
        expect(convertAmountToUSDC(0.5, 6, 20).toString()).toBe("10000000");
        expect(convertAmountToUSDC(3.5, 12, 2).toString()).toBe("7000000");
        expect(convertAmountToUSDC(64.8, "18", 4315.0).toString()).toBe("279612000000");
        expect(convertAmountToUSDC(64.8, BigNumber.from(4), BigNumber.from(321000000)).toString()).toBe("20800800000");
    });
    it("convert amount to usdc string", () => {
        expect(convertAmountToUSDC("0.5", 6, 20).toString()).toBe("10000000");
        expect(convertAmountToUSDC("3.5", 12, 2).toString()).toBe("7000000");
        expect(convertAmountToUSDC("64.8", "18", 4315.0).toString()).toBe("279612000000");
        expect(convertAmountToUSDC("64.8", BigNumber.from(4), BigNumber.from(321000000)).toString()).toBe(
            "20800800000",
        );
    });
    it("convert amount to usdc bignumber", () => {
        expect(convertAmountToUSDC(BigNumber.from(500000), 6, 20).toString()).toBe("10000000");
        expect(convertAmountToUSDC(BigNumber.from(3500000000000), 12, 2).toString()).toBe("7000000");
        expect(convertAmountToUSDC(BigNumber.from("64800000000000000000"), "18", 4315.0).toString()).toBe(
            "279612000000",
        );
        expect(
            convertAmountToUSDC(BigNumber.from(648000), BigNumber.from(4), BigNumber.from(321000000)).toString(),
        ).toBe("20800800000");
    });
});
