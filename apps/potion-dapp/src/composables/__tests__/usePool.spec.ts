import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePool } from "../usePool";
import { withSetupUrql } from "./test-utils";
import { mockPool, mockCriteria } from "./test-mocks";

describe("usePool", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns error", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.error).not.toBeUndefined();
    });

    it("returns fetching", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.fetching).not.toBeUndefined();
    });

    it("returns pool", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.pool).not.toBeUndefined();
    });

    it("returns curve", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.curve).not.toBeUndefined();
    });

    it("returns criterias", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.criterias).not.toBeUndefined();
    });
  });

  describe("pool is computated correctly", () => {
    it("returns null if it fails to load", () => {
      const [result] = withSetupUrql(() => usePool(ref("")));
      expect(result.pool.value).toBeNull();
    });

    it("returns null if the pool doesn't exist", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.pool.value).toBeNull();
    });

    it("returns the pool if it exists", () => {
      const [result] = withSetupUrql(
        () => usePool(ref("0x000")),
        mockPool({ id: "0x000", poolId: 100 })
      );
      expect(result.pool.value).toMatchObject({
        id: "0x000",
        poolId: 100,
      });
    });
  });

  describe("curve is computated correctly", () => {
    it("returns null if it fails to load", () => {
      const [result] = withSetupUrql(() => usePool(ref("")));
      expect(result.curve.value).toBeNull();
    });

    it("returns null if the pool doesn't exist", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.curve.value).toBeNull();
    });

    it("returns the pool curve if the pool exists", () => {
      const [result] = withSetupUrql(
        () => usePool(ref("0x000")),
        mockPool({
          id: "0x000",
          curve: { a: "10", b: "20", c: "30", d: "40", maxUtil: "0.5" },
        })
      );
      expect(result.curve.value).toMatchObject({
        a: "10",
        b: "20",
        c: "30",
        d: "40",
        maxUtil: "0.5",
      });
    });
  });

  describe("criterias is computated correctly", () => {
    it("returns [] if it fails to load", () => {
      const [result] = withSetupUrql(() => usePool(ref("")));
      expect(result.criterias.value.length).toBe(0);
    });

    it("returns [] if the pool doesn't exist", () => {
      const [result] = withSetupUrql(() => usePool(ref("0x000")));
      expect(result.criterias.value.length).toBe(0);
    });

    it("returns the pool criterias if the pool exists", () => {
      const [result] = withSetupUrql(
        () => usePool(ref("0x000")),
        mockPool({
          id: "0x000",
          criterias: [mockCriteria("0x001", "100", "30")],
        })
      );
      expect(result.criterias.value.length).toBe(1);
      expect(result.criterias.value[0]).toMatchObject({
        token: {
          address: "0x001",
          symbol: "",
          image: "",
        },
        maxStrike: 100,
        maxDuration: 30,
      });
    });
  });
});
