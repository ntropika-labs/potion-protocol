import { describe, expect, it } from "vitest";
import { useRouteLiquidityProvider } from "../useRouteLiquidityProvider";

describe("useRouteLiquidityProvider", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a poolLp", () => {
      const { poolLp } = useRouteLiquidityProvider({});
      expect(poolLp).not.toBeUndefined();
    });

    it("returns a validLp", () => {
      const { validLp } = useRouteLiquidityProvider({});
      expect(validLp).not.toBeUndefined();
    });
  });
});
