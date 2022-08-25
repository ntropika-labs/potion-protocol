import { ref } from "vue";
import { describe, expect, it } from "vitest";
import { useLiquidity } from "../useLiquidity";

describe("useLiquidity", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a liquidity", () => {
      const { liquidity } = useLiquidity(0, ref(0));
      expect(liquidity).not.toBeNull();
    });

    it("returns a validLiquidity", () => {
      const { validLiquidity } = useLiquidity(0, ref(0));
      expect(validLiquidity).not.toBeNull();
    });

    it("returns a validInput", () => {
      const { validInput } = useLiquidity(0, ref(0));
      expect(validInput).not.toBeNull();
    });
  });

  it("liquidity is initialized correctly", () => {
    const { liquidity } = useLiquidity(100, ref(0));
    expect(liquidity.value).toBe(100);
  });

  it("initializes validInput at false", () => {
    const { validInput } = useLiquidity(100, ref(50));
    expect(validInput.value).toBe(false);
  });

  describe("validLiquidity validates liquidity", () => {
    describe("it always returns false if validInput is false", () => {
      it("returns false if minLiquidity < liquidity < userBalance", () => {
        const { validLiquidity } = useLiquidity(50, ref(100), 10);
        expect(validLiquidity.value).toBe(false);
      });

      it("returns false if minLiquidity > liquidity < userBalance", () => {
        const { validLiquidity } = useLiquidity(10, ref(100), 50);
        expect(validLiquidity.value).toBe(false);
      });

      it("returns false if minLiquidity < liquidity > userBalance", () => {
        const { validLiquidity } = useLiquidity(110, ref(100), 50);
        expect(validLiquidity.value).toBe(false);
      });
    });

    describe("it checks minLiquidity and userBalance if validInput is true", () => {
      it("returns true if minLiquidity < liquidity < userBalance", () => {
        const { validLiquidity, validInput } = useLiquidity(50, ref(100), 10);
        validInput.value = true;
        expect(validLiquidity.value).toBe(true);
      });

      it("returns false if minLiquidity > liquidity < userBalance", () => {
        const { validLiquidity, validInput } = useLiquidity(10, ref(100), 50);
        validInput.value = true;
        expect(validLiquidity.value).toBe(false);
      });

      it("returns false if minLiquidity < liquidity > userBalance", () => {
        const { validLiquidity, validInput } = useLiquidity(110, ref(100), 50);
        validInput.value = true;
        expect(validLiquidity.value).toBe(false);
      });
    });
  });
});
