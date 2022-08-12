import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePotionOrders } from "../usePotionOrders";
import { withSetupUrql } from "./test-utils";

describe("usePotionOrders", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns orders", () => {
      const [result] = withSetupUrql(() => usePotionOrders(ref("0x000")));
      expect(result.orders).not.toBeUndefined();
    });

    it("returns loading", () => {
      const [result] = withSetupUrql(() => usePotionOrders(ref("0x000")));
      expect(result.loading).not.toBeUndefined();
    });
  });
});
