import { describe, expect, it } from "vitest";
import { useRoutePoolIdentifier } from "../useRoutePoolIdentifier";

describe("useRoutePoolIdentifier", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a poolId", () => {
      const { poolId } = useRoutePoolIdentifier({});
      expect(poolId).not.toBeNull();
    });

    it("returns a validPoolId", () => {
      const { validPoolId } = useRoutePoolIdentifier({});
      expect(validPoolId).not.toBeNull();
    });
  });

  describe("it parse poolId correctly", () => {
    it("returns poolId as a number", () => {
      const { poolId } = useRoutePoolIdentifier({
        lp: "0x000",
        id: "10",
      });
      expect(poolId.value).toBe(10);
    });

    it("returns -1 if poolId is an array", () => {
      const { poolId } = useRoutePoolIdentifier({
        lp: "0x000",
        id: ["10", "20"],
      });
      expect(poolId.value).toBe(-1);
    });

    it("returns NaN if there isn't a poolId", () => {
      const { poolId } = useRoutePoolIdentifier({
        lp: "0x000",
      });
      expect(poolId.value).toBeNaN();
    });
  });

  describe("it validates poolId as expected", () => {
    it("returns true with a correct pool id", () => {
      const { validPoolId } = useRoutePoolIdentifier({
        lp: "0x000",
        id: "10",
      });
      expect(validPoolId.value).toBe(true);
    });

    it("returns false if pool id isn't a valid number", () => {
      const { validPoolId } = useRoutePoolIdentifier({
        lp: "0x000",
        id: "-112",
      });
      expect(validPoolId.value).toBe(false);
    });

    it("returns false if pool id is an array", () => {
      const { validPoolId } = useRoutePoolIdentifier({
        lp: "0x000",
        id: ["10", "20"],
      });
      expect(validPoolId.value).toBe(false);
    });

    it("returns false if there isn't a pool id", () => {
      const { validPoolId } = useRoutePoolIdentifier({
        lp: "0x000",
      });
      expect(validPoolId.value).toBe(false);
    });
  });
});
