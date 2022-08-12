import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePotionOrders } from "../usePotionOrders";
import { withSetupUrql } from "./test-utils";
import { mockPotionOrders } from "./test-mocks";

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

  describe("orders are computated correctly", () => {
    it("returns an empty array if it fails to load", () => {
      const [result] = withSetupUrql(() => usePotionOrders(ref("0x000")));
      expect(result.orders.value.length).toBe(0);
    });

    it("returns an empty array if there aren't orders for this potion", () => {
      const [result] = withSetupUrql(() => usePotionOrders(ref("0x000")));
      expect(result.orders.value.length).toBe(0);
    });

    it("returns an array with one element if there is one order for this potion", () => {
      const [result] = withSetupUrql(
        () => usePotionOrders(ref("0x000")),
        mockPotionOrders([
          { id: "1", premium: "100", timestamp: "010", otokens: "5" },
        ])
      );
      expect(result.orders.value.length).toBe(1);
      expect(result.orders.value[0]).toMatchObject({
        id: "1",
        premium: "100",
        timestamp: "010",
        numberOfOTokens: "5",
      });
    });

    it("returns an array with all matching orders if there are multiple orders for this potion", () => {
      const [result] = withSetupUrql(
        () => usePotionOrders(ref("0x000")),
        mockPotionOrders([
          { id: "1", premium: "100", timestamp: "010", otokens: "5" },
          { id: "2", premium: "90", timestamp: "030", otokens: "3" },
          { id: "3", premium: "110", timestamp: "050", otokens: "11" },
        ])
      );
      expect(result.orders.value.length).toBe(3);
      expect(result.orders.value[0]).toMatchObject({
        id: "1",
        premium: "100",
        timestamp: "010",
        numberOfOTokens: "5",
      });
      expect(result.orders.value[1]).toMatchObject({
        id: "2",
        premium: "90",
        timestamp: "030",
        numberOfOTokens: "3",
      });
      expect(result.orders.value[2]).toMatchObject({
        id: "3",
        premium: "110",
        timestamp: "050",
        numberOfOTokens: "11",
      });
    });
  });
});
