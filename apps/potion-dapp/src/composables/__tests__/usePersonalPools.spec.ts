import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePersonalPools } from "../usePersonalPools";
import { withSetupUrql } from "./test-utils";

describe("usePersonalPools", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns pools", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("0x000")));
      expect(result.pools).not.toBeUndefined();
    });

    it("returns loadMorePools", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("0x000")));
      expect(result.loadMorePools).not.toBeUndefined();
    });

    it("returns getTokens", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("0x000")));
      expect(result.getTokens).not.toBeUndefined();
    });

    it("returns totalPools", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("0x000")));
      expect(result.totalPools).not.toBeUndefined();
    });

    it("returns averagePnl", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("0x000")));
      expect(result.averagePnl).not.toBeUndefined();
    });

    it("returns totalLiquidity", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("0x000")));
      expect(result.totalLiquidity).not.toBeUndefined();
    });
  });
});
