import { describe, expect, it } from "vitest";
import { useRoutePoolId } from "../useRoutePoolId";

describe("useRoutePoolId", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns an id", () => {
      const { id } = useRoutePoolId({});
      expect(id).not.toBeNull();
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

    it("returns '' if there isn't an lp", () => {
      const { id } = useRoutePoolId({
        id: "10",
      });
      expect(id.value).toBe("");
    });

    it("returns '' if lp isn't a valid lp address", () => {
      const { id } = useRoutePoolId({
        lp: "abcd",
        id: "10",
      });
      expect(id.value).toBe("");
    });

    it("returns '' if lp is an array", () => {
      const { id } = useRoutePoolId({
        lp: ["0x000", "0x001"],
        id: "10",
      });
      expect(id.value).toBe("");
    });

    it("returns '' if there isn't a lp", () => {
      const { id } = useRoutePoolId({
        id: "10",
      });
      expect(id.value).toBe("");
    });
  });
});
