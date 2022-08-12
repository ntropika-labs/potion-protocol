import { describe, expect, it } from "vitest";
import { usePoolSnapshots, useTemplateSnapshots } from "../useSnapshots";
import { withSetupUrql } from "./test-utils";

describe("usePoolSnapshots", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns snapshots", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.snapshots).not.toBeUndefined();
    });

    it("returns fetching", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.fetching).not.toBeUndefined();
    });

    it("returns chartData", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.chartData).not.toBeUndefined();
    });

    it("returns executeQuery", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.executeQuery).not.toBeUndefined();
    });
  });
});

describe("useTemplateSnapshots", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns snapshots", () => {
      const [result] = withSetupUrql(() => useTemplateSnapshots("0x000"));
      expect(result.snapshots).not.toBeUndefined();
    });

    it("returns fetching", () => {
      const [result] = withSetupUrql(() => useTemplateSnapshots("0x000"));
      expect(result.fetching).not.toBeUndefined();
    });

    it("returns chartData", () => {
      const [result] = withSetupUrql(() => useTemplateSnapshots("0x000"));
      expect(result.chartData).not.toBeUndefined();
    });
  });
});
