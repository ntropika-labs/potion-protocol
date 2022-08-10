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

  describe("it parse lp correctly", () => {
    it("returns the lp if it is a string", () => {
      const { poolLp } = useRouteLiquidityProvider({
        lp: "0x000",
      });
      expect(poolLp.value).toBe("0x000");
    });

    it("returns '' if lp is an array", () => {
      const { poolLp } = useRouteLiquidityProvider({
        lp: ["0x000", "0x0001"],
      });
      expect(poolLp.value).toBe("");
    });

    it("returns '' if there isn't a lp", () => {
      const { poolLp } = useRouteLiquidityProvider({});
      expect(poolLp.value).toBe("");
    });

    it("returns lp in lower case", () => {
      const { poolLp } = useRouteLiquidityProvider({
        lp: "0xABCD",
      });
      expect(poolLp.value).toBe("0xabcd");
    });
  });

  describe("it validates lp as expected", () => {
    it("returns true with a correct lp", () => {
      const { validLp } = useRouteLiquidityProvider({
        lp: "0x000",
      });
      expect(validLp.value).toBe(true);
    });

    it("returns false if lp isn't a valid address", () => {
      const { validLp } = useRouteLiquidityProvider({
        lp: "aaa",
      });
      expect(validLp.value).toBe(false);
    });

    it("returns false if lp is an array", () => {
      const { validLp } = useRouteLiquidityProvider({
        lp: ["0x000", "0x001"],
      });
      expect(validLp.value).toBe(false);
    });

    it("returns false if there isn't a lp", () => {
      const { validLp } = useRouteLiquidityProvider({});
      expect(validLp.value).toBe(false);
    });
  });
});
