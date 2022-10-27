import { describe, expect, it } from "vitest";
import { calculatePnL, estimatePnL } from "../pnl";

describe("pnl helper", () => {
  describe("calculatePnL", () => {
    it("calculate the PnL correctly when a LP earns money", () => {
      const result = calculatePnL(500, 100, 400);
      expect(result).toBe(8);
    });
    it("calculate the PnL correctly when a LP don't gain any money", () => {
      const result = calculatePnL(500, 500, 0);
      expect(result).toBe(0);
    });
    it("calculate the PnL correctly when a LP lose money", () => {
      const result = calculatePnL(500, 1000, 0);
      expect(result).toBe(-0.5);
    });
  });
  describe("estimatePnL", () => {
    it("estimate the PnL correctly when a LP should earn money", () => {
      const result = estimatePnL(500, 200, 1000, 1500);
      expect(result).toBe(2.5);
    });
    it("estimate the PnL correctly when a LP should't gain any money", () => {
      const result = estimatePnL(500, 1000, 1000, 500);
      expect(result).toBe(0);
    });
    it("estimate the PnL correctly when a LP should lose money", () => {
      const result = estimatePnL(500, 1000, 1000, 50);
      expect(result).toBe(-0.45);
    });
  });
});
