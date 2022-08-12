import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePoolLiquidity } from "../usePoolLiquidity";

describe("usePoolLiquidity", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns liquidity", () => {
      const { liquidity } = usePoolLiquidity(ref("0"), ref("0"));
      expect(liquidity).not.toBeUndefined();
    });

    it("returns formattedLiquidity", () => {
      const { formattedLiquidity } = usePoolLiquidity(ref("0"), ref("0"));
      expect(formattedLiquidity).not.toBeUndefined();
    });

    it("returns addLiquidity", () => {
      const { addLiquidity } = usePoolLiquidity(ref("0"), ref("0"));
      expect(addLiquidity).not.toBeUndefined();
    });

    it("returns decreaseLiquidity", () => {
      const { decreaseLiquidity } = usePoolLiquidity(ref("0"), ref("0"));
      expect(decreaseLiquidity).not.toBeUndefined();
    });

    it("returns unutilizedLiquidity", () => {
      const { unutilizedLiquidity } = usePoolLiquidity(ref("0"), ref("0"));
      expect(unutilizedLiquidity).not.toBeUndefined();
    });

    it("returns utilization", () => {
      const { utilization } = usePoolLiquidity(ref("0"), ref("0"));
      expect(utilization).not.toBeUndefined();
    });

    it("returns utilizationPercentage", () => {
      const { utilizationPercentage } = usePoolLiquidity(ref("0"), ref("0"));
      expect(utilizationPercentage).not.toBeUndefined();
    });
  });

  describe("liquidity is calculated correctly", () => {
    it("is equal to the pool size initially", () => {
      const { liquidity } = usePoolLiquidity(ref("100"), ref("0"));
      expect(liquidity.value).toBe(100);
    });

    it("is increased calling addLiquidity", () => {
      const { liquidity, addLiquidity } = usePoolLiquidity(ref("50"), ref("0"));
      addLiquidity(200);
      expect(liquidity.value).toBe(250);
    });

    it("is decreased calling decreaseLiquidity", () => {
      const { liquidity, decreaseLiquidity } = usePoolLiquidity(
        ref("50"),
        ref("0")
      );
      decreaseLiquidity(20);
      expect(liquidity.value).toBe(30);
    });
  });

  describe("unutilizedLiquidity is calculated correctly", () => {
    it("is equal to the pool size if locked is 0", () => {
      const { unutilizedLiquidity } = usePoolLiquidity(ref("10"), ref("0"));
      expect(unutilizedLiquidity.value).toBe(10);
    });

    it("is 0 if size = locked", () => {
      const { unutilizedLiquidity } = usePoolLiquidity(
        ref("1000"),
        ref("1000")
      );
      expect(unutilizedLiquidity.value).toBe(0);
    });

    it("is increased calling addLiquidity", () => {
      const { unutilizedLiquidity, addLiquidity } = usePoolLiquidity(
        ref("350"),
        ref("0")
      );
      addLiquidity(200);
      expect(unutilizedLiquidity.value).toBe(550);
    });

    it("is decreased calling decreaseLiquidity", () => {
      const { unutilizedLiquidity, decreaseLiquidity } = usePoolLiquidity(
        ref("75"),
        ref("0")
      );
      decreaseLiquidity(5);
      expect(unutilizedLiquidity.value).toBe(70);
    });
  });

  describe("utilizationPercentage is calculated correctly", () => {
    it("is 0 if locked is 0", () => {
      const { utilizationPercentage } = usePoolLiquidity(ref("200"), ref("0"));
      expect(utilizationPercentage.value).toBe("0");
    });

    it("is 50 if locked = size / 2", () => {
      const { utilizationPercentage } = usePoolLiquidity(ref("50"), ref("25"));
      expect(utilizationPercentage.value).toBe("50");
    });

    it("is 100 if locked = size", () => {
      const { utilizationPercentage } = usePoolLiquidity(ref("10"), ref("10"));
      expect(utilizationPercentage.value).toBe("100");
    });

    it("is decreased calling addLiquidity", () => {
      const { utilizationPercentage, addLiquidity } = usePoolLiquidity(
        ref("50"),
        ref("50")
      );
      expect(utilizationPercentage.value).toBe("100");
      addLiquidity(450);
      expect(utilizationPercentage.value).toBe("10");
    });

    it("is increased calling decreaseLiquidity", () => {
      const { utilizationPercentage, decreaseLiquidity } = usePoolLiquidity(
        ref("200"),
        ref("100")
      );
      expect(utilizationPercentage.value).toBe("50");
      decreaseLiquidity(100);
      expect(utilizationPercentage.value).toBe("100");
    });
  });
});
