import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePersonalPools } from "../usePersonalPools";
import { withSetupUrql } from "./test-utils";
import { mockPools } from "./test-mocks";

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

  describe("pools are computated correctly", () => {
    it("returns an empty array if it fails to load", () => {
      const [result] = withSetupUrql(() => usePersonalPools(ref("")));
      expect(result.pools.value.length).toBe(0);
    });

    it("returns an empty array if there aren't pools to load", () => {
      const [result] = withSetupUrql(
        () => usePersonalPools(ref("0x000")),
        mockPools([])
      );
      expect(result.pools.value.length).toBe(0);
    });

    it("returns an array with one pool if this LP has one pool", () => {
      const [result] = withSetupUrql(
        () => usePersonalPools(ref("0x000")),
        mockPools([
          {
            id: "0x000x000",
            poolId: 10,
            curve: {
              a: "1",
              b: "2",
              c: "3",
              d: "4",
              maxUtil: "10",
            },
          },
        ])
      );
      expect(result.pools.value.length).toBe(1);
      expect(result.pools.value[0]).toMatchObject({
        id: "0x000x000",
        poolId: 10,
        template: {
          curve: {
            a: "1",
            b: "2",
            c: "3",
            d: "4",
            maxUtil: "10",
          },
        },
      });
    });

    it("returns an array with all the matching pools if the LP owns multiple pools", () => {
      const [result] = withSetupUrql(
        () => usePersonalPools(ref("0x000")),
        mockPools([
          {
            id: "0x000x000",
            poolId: 10,
            curve: {
              a: "1",
              b: "2",
              c: "3",
              d: "4",
              maxUtil: "10",
            },
          },
          {
            id: "0x000x010",
            poolId: 11,
            curve: {
              a: "5",
              b: "6",
              c: "7",
              d: "8",
              maxUtil: "20",
            },
          },
          {
            id: "0x000x020",
            poolId: 12,
            curve: {
              a: "9",
              b: "10",
              c: "11",
              d: "12",
              maxUtil: "30",
            },
          },
        ])
      );
      expect(result.pools.value.length).toBe(3);
      expect(result.pools.value[0]).toMatchObject({
        id: "0x000x000",
        poolId: 10,
        template: {
          curve: {
            a: "1",
            b: "2",
            c: "3",
            d: "4",
            maxUtil: "10",
          },
        },
      });
      expect(result.pools.value[1]).toMatchObject({
        id: "0x000x010",
        poolId: 11,
        template: {
          curve: {
            a: "5",
            b: "6",
            c: "7",
            d: "8",
            maxUtil: "20",
          },
        },
      });
      expect(result.pools.value[2]).toMatchObject({
        id: "0x000x020",
        poolId: 12,
        template: {
          curve: {
            a: "9",
            b: "10",
            c: "11",
            d: "12",
            maxUtil: "30",
          },
        },
      });
    });
  });
});
