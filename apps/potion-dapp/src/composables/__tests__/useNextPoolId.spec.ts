import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useNextPoolId } from "../useNextPoolId";
import { withSetupUrql } from "./test-utils";

describe("useNextPoolId", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns poolId", () => {
      const [result] = withSetupUrql(() => useNextPoolId(ref("0x000")));
      expect(result.poolId).not.toBeUndefined();
    });
  });

  describe("it returns the correct poolId", () => {
    it("returns 0 if the lp doesn't have any pool", () => {
      const [result] = withSetupUrql(() => useNextPoolId(ref("0x000")));
      expect(result.poolId.value).toBe(0);
    });

    it("returns 2 if the lp have one pool", () => {
      const [result] = withSetupUrql(() => useNextPoolId(ref("0x000")), {
        pools: [
          {
            poolId: 1,
          },
        ],
      });
      expect(result.poolId.value).toBe(2);
    });

    it("returns the next poolId", () => {
      const [result] = withSetupUrql(() => useNextPoolId(ref("0x000")), {
        pools: [
          {
            poolId: 15,
          },
        ],
      });
      expect(result.poolId.value).toBe(16);
    });
  });
});
