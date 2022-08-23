import { describe, expect, it } from "vitest";
import { useTemplates } from "../useTemplates";
import { withSetupUrql } from "./test-utils";
import { mockPoolTemplate } from "./test-mocks";

describe("useTemplates", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns bySize", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.bySize).not.toBeUndefined();
    });

    it("returns byNumber", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.byNumber).not.toBeUndefined();
    });

    it("returns byPnl", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.byPnl).not.toBeUndefined();
    });

    it("returns canLoadMoreBySize", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.canLoadMoreBySize).not.toBeUndefined();
    });

    it("returns canLoadMoreByNumber", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.canLoadMoreByNumber).not.toBeUndefined();
    });

    it("returns canLoadMoreByPnl", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.canLoadMoreByPnl).not.toBeUndefined();
    });

    it("returns loadMoreBySize", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.loadMoreBySize).not.toBeUndefined();
    });

    it("returns loadMoreByNumber", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.loadMoreByNumber).not.toBeUndefined();
    });

    it("returns loadMoreByPnl", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.loadMoreByPnl).not.toBeUndefined();
    });

    it("returns getTokens", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.getTokens).not.toBeUndefined();
    });
  });

  describe("combined query load works as expected", () => {
    it("returns the 3 categories as empty arrays if there was an error", () => {
      const [result] = withSetupUrql(useTemplates);
      expect(result.bySize.value.length).toBe(0);
      expect(result.byNumber.value.length).toBe(0);
      expect(result.byPnl.value.length).toBe(0);
    });

    it("returns the 3 categories as empty arrays if there aren't pools in the protocol", () => {
      const [result] = withSetupUrql(useTemplates, {
        bySize: [],
        byNumber: [],
        byPnl: [],
      });
      expect(result.bySize.value.length).toBe(0);
      expect(result.byNumber.value.length).toBe(0);
      expect(result.byPnl.value.length).toBe(0);
    });

    describe("populates the correct category", () => {
      it("populates bySize correctly", () => {
        const [result] = withSetupUrql(useTemplates, {
          bySize: [
            mockPoolTemplate({ id: "0x000", creator: "0x00010" }).template,
          ],
          byNumber: [],
          byPnl: [],
        });
        expect(result.bySize.value.length).toBe(1);
        expect(result.bySize.value[0]).toMatchObject({
          id: "0x000",
          creator: "0x00010",
        });
        expect(result.byNumber.value.length).toBe(0);
        expect(result.byPnl.value.length).toBe(0);
      });

      it("populates byNumber correctly", () => {
        const [result] = withSetupUrql(useTemplates, {
          bySize: [],
          byNumber: [
            mockPoolTemplate({ id: "0x010", creator: "0x00020" }).template,
          ],
          byPnl: [],
        });
        expect(result.bySize.value.length).toBe(0);
        expect(result.byNumber.value.length).toBe(1);
        expect(result.byNumber.value[0]).toMatchObject({
          id: "0x010",
          creator: "0x00020",
        });
        expect(result.byPnl.value.length).toBe(0);
      });

      it("populates byPnl correctly", () => {
        const [result] = withSetupUrql(useTemplates, {
          bySize: [],
          byNumber: [],
          byPnl: [
            mockPoolTemplate({ id: "0x020", creator: "0x00030" }).template,
          ],
        });
        expect(result.bySize.value.length).toBe(0);
        expect(result.byNumber.value.length).toBe(0);
        expect(result.byPnl.value.length).toBe(1);
        expect(result.byPnl.value[0]).toMatchObject({
          id: "0x020",
          creator: "0x00030",
        });
      });
    });
  });
});
