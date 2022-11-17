import { describe, expect, it } from "vitest";
import * as vaultEstimations from "../src/vaultEstimations";

describe("vaultEstimations", () => {
    const usdcBalanceActionContract = 100;
    const underlyingBalanceActionContract = 10;
    const underlyingPrice = 10;
    const strikePrice = 100;
    const potionsQuantity = 2;
    const investmentVaultContractShares = 100;

    it("calculate the underlying balance action contract correctly", () => {
        const result = vaultEstimations.calculateEstimatedUnderlyingBalanceActionContract(
            usdcBalanceActionContract,
            underlyingBalanceActionContract,
            underlyingPrice,
        );
        expect(result).toEqual(20);
    });
    it("calculate the potion unit payout in usdc correctly", () => {
        const result1 = vaultEstimations.calculatePotionUnitPayoutInUsdc(strikePrice, underlyingPrice);
        expect(result1).toEqual(90);
        const result2 = vaultEstimations.calculatePotionUnitPayoutInUsdc(strikePrice, 110);
        expect(result2).toEqual(0);
    });
    it("calculate the potion payout in usdc correctly", () => {
        const result1 = vaultEstimations.calculatePotionPayoutInUsdc(strikePrice, underlyingPrice, potionsQuantity);
        expect(result1).toEqual(180);
        const result2 = vaultEstimations.calculatePotionPayoutInUsdc(strikePrice, 110, potionsQuantity);
        expect(result2).toEqual(0);
    });
    it("calculate the potion payout in underlying correctly", () => {
        const result1 = vaultEstimations.calculatePotionPayoutInUnderlying(
            strikePrice,
            underlyingPrice,
            potionsQuantity,
        );
        expect(result1).toEqual(18);
        const result2 = vaultEstimations.calculatePotionPayoutInUnderlying(strikePrice, 110, potionsQuantity);
        expect(result2).toEqual(0);
    });
    it("calculate the current total underlyings correctly", () => {
        const estimatedUnderlyingBalanceActionContract =
            vaultEstimations.calculateEstimatedUnderlyingBalanceActionContract(
                usdcBalanceActionContract,
                underlyingBalanceActionContract,
                underlyingPrice,
            );
        const potionPayoutInUnderlying = vaultEstimations.calculatePotionPayoutInUnderlying(
            strikePrice,
            underlyingPrice,
            potionsQuantity,
        );
        const result = vaultEstimations.calculateCurrentTotalUnderlyings(
            usdcBalanceActionContract,
            underlyingBalanceActionContract,
            underlyingPrice,
            strikePrice,
            potionsQuantity,
        );
        expect(result).toEqual(estimatedUnderlyingBalanceActionContract + potionPayoutInUnderlying);
    });

    it("calculate the current Share To Asset Rate correctly", () => {
        const currentTotalUnderlyings = vaultEstimations.calculateCurrentTotalUnderlyings(
            usdcBalanceActionContract,
            underlyingBalanceActionContract,
            underlyingPrice,
            strikePrice,
            potionsQuantity,
        );
        const result = vaultEstimations.calculateCurrentShareToAssetRate(
            usdcBalanceActionContract,
            underlyingBalanceActionContract,
            underlyingPrice,
            strikePrice,
            potionsQuantity,
            investmentVaultContractShares,
        );
        expect(result).toEqual(currentTotalUnderlyings / investmentVaultContractShares);
    });
});
