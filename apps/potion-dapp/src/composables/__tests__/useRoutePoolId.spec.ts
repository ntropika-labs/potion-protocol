import { describe, expect, it } from "vitest";
import { useRoutePoolId } from "../useRoutePoolId";

describe("useRoutePoolId", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns an id", () => {
      const { id } = useRoutePoolId({});
      expect(id).not.toBeNull();
    });

    it("returns a poolId", () => {
      const { poolId } = useRoutePoolId({});
      expect(poolId).not.toBeNull();
    });

    it("returns a validPoolId", () => {
      const { validPoolId } = useRoutePoolId({});
      expect(validPoolId).not.toBeNull();
    });
  });

  describe("it parse poolId correctly", () => {
    it("returns poolId as a number", () => {
      const { poolId } = useRoutePoolId({
        lp: "0x000",
        id: "10",
      });
      expect(poolId.value).toBe(10);
    });

    it("returns -1 if poolId is an array", () => {
      const { poolId } = useRoutePoolId({
        lp: "0x000",
        id: ["10", "20"],
      });
      expect(poolId.value).toBe(-1);
    });

    it("returns NaN if there isn't a poolId", () => {
      const { poolId } = useRoutePoolId({
        lp: "0x000",
      });
      expect(poolId.value).toBeNaN();
    });
  });

  describe("it formats id correctly", () => {
    it("returns the pool id", () => {
      const { id } = useRoutePoolId({
        lp: "0x000",
        id: "10",
      });
      expect(id.value).toBe("0x0000xa");
    });

    it("returns '' if pool id isn't a valid number", () => {
      const { id } = useRoutePoolId({
        lp: "0x000",
        id: "-1237",
      });
      expect(id.value).toBe("");
    });

    it("returns '' if pool id is an array", () => {
      const { id } = useRoutePoolId({
        lp: "0x000",
        id: ["10", "20"],
      });
      expect(id.value).toBe("");
    });

    it("returns '' if there isn't a pool id", () => {
      const { id } = useRoutePoolId({
        lp: "0x000",
      });
      expect(id.value).toBe("");
    });
  });

  describe("it validates as expected", () => {
    it("returns true with a correct pool id", () => {
      const { validPoolId } = useRoutePoolId({
        lp: "0x000",
        id: "10",
      });
      expect(validPoolId.value).toBe(true);
    });

    it("returns false if pool id isn't a valid number", () => {
      const { validPoolId } = useRoutePoolId({
        lp: "0x000",
        id: "-112",
      });
      expect(validPoolId.value).toBe(false);
    });

    it("returns false if pool id is an array", () => {
      const { validPoolId } = useRoutePoolId({
        lp: "0x000",
        id: ["10", "20"],
      });
      expect(validPoolId.value).toBe(false);
    });

    it("returns false if there isn't a pool id", () => {
      const { validPoolId } = useRoutePoolId({
        lp: "0x000",
      });
      expect(validPoolId.value).toBe(false);
    });
  });
});
