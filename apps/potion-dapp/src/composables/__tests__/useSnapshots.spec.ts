import { describe, expect, it } from "vitest";
import { usePoolSnapshots, useTemplateSnapshots } from "../useSnapshots";
import { withSetupUrql } from "./test-utils";
import { mockSnapshots } from "./test-mocks";

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

  describe("chartData is computated correctly", () => {
    it("returns an empty array if it fails to load", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.chartData.value.length).toBe(0);
    });

    it("returns an empty array if there aren't snapshots for this pool", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.chartData.value.length).toBe(0);
    });

    it("returns an array with one chart point if there is one snapshot for this pool", () => {
      const [result] = withSetupUrql(
        () => usePoolSnapshots("0x000"),
        mockSnapshots([
          { timestamp: "10", size: "20", utilization: "0.3", pnl: "15" },
        ])
      );
      expect(result.chartData.value.length).toBe(1);
      expect(result.chartData.value[0]).toMatchObject({
        timestamp: 10,
        liquidity: 20,
        pnl: 15,
        utilization: 30,
      });
    });

    it("returns an array with all chart points if there are multiple snapshots for this pool", () => {
      const [result] = withSetupUrql(
        () => usePoolSnapshots("0x000"),
        mockSnapshots([
          { timestamp: "10", size: "20", utilization: "0.3", pnl: "15" },
          { timestamp: "30", size: "2000", utilization: "0.01", pnl: "-40" },
          { timestamp: "50", size: "120", utilization: "0.7", pnl: "5" },
        ])
      );
      expect(result.chartData.value.length).toBe(3);
      expect(result.chartData.value[0]).toMatchObject({
        timestamp: 10,
        liquidity: 20,
        pnl: 15,
        utilization: 30,
      });
      expect(result.chartData.value[1]).toMatchObject({
        timestamp: 30,
        liquidity: 2000,
        pnl: -40,
        utilization: 1,
      });
      expect(result.chartData.value[2]).toMatchObject({
        timestamp: 50,
        liquidity: 120,
        pnl: 5,
        utilization: 70,
      });
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

    it("returns executeQuery", () => {
      const [result] = withSetupUrql(() => usePoolSnapshots("0x000"));
      expect(result.executeQuery).not.toBeUndefined();
    });
  });

  describe("chartData is computated correctly", () => {
    it("returns an empty array if it fails to load", () => {
      const [result] = withSetupUrql(() => useTemplateSnapshots("0x000"));
      expect(result.chartData.value.length).toBe(0);
    });

    it("returns an empty array if there aren't snapshots for this pool", () => {
      const [result] = withSetupUrql(() => useTemplateSnapshots("0x000"));
      expect(result.chartData.value.length).toBe(0);
    });

    it("returns an array with one chart point if there is one snapshot for this pool", () => {
      const [result] = withSetupUrql(
        () => useTemplateSnapshots("0x000"),
        mockSnapshots([
          {
            timestamp: "10",
            templateSize: "20",
            templateUtilization: "0.3",
            templatePnl: "15",
          },
        ])
      );
      expect(result.chartData.value.length).toBe(1);
      expect(result.chartData.value[0]).toMatchObject({
        timestamp: 10,
        liquidity: 20,
        pnl: 15,
        utilization: 30,
      });
    });

    it("returns an array with all chart points if there are multiple snapshots for this pool", () => {
      const [result] = withSetupUrql(
        () => useTemplateSnapshots("0x000"),
        mockSnapshots([
          {
            timestamp: "10",
            templateSize: "20",
            templateUtilization: "0.3",
            templatePnl: "15",
          },
          {
            timestamp: "30",
            templateSize: "2000",
            templateUtilization: "0.01",
            templatePnl: "-40",
          },
          {
            timestamp: "50",
            templateSize: "120",
            templateUtilization: "0.7",
            templatePnl: "5",
          },
        ])
      );
      expect(result.chartData.value.length).toBe(3);
      expect(result.chartData.value[0]).toMatchObject({
        timestamp: 10,
        liquidity: 20,
        pnl: 15,
        utilization: 30,
      });
      expect(result.chartData.value[1]).toMatchObject({
        timestamp: 30,
        liquidity: 2000,
        pnl: -40,
        utilization: 1,
      });
      expect(result.chartData.value[2]).toMatchObject({
        timestamp: 50,
        liquidity: 120,
        pnl: 5,
        utilization: 70,
      });
    });
  });
});
