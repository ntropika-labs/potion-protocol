import { describe, expect, it } from "vitest";
import { ref, nextTick } from "vue";
import { useStrikeSelection } from "../useStrikeSelection";
import { withSetupUrql } from "./test-utils";
import { mockCriterias } from "./test-mocks";

describe("useStrikeSelection", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a strikeSelected", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(10))
      );
      expect(result.strikeSelected).not.toBeUndefined();
    });

    it("returns a strikeSelectedRelative", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(10))
      );
      expect(result.strikeSelectedRelative).not.toBeUndefined();
    });

    it("returns a maxSelectableStrikeAbsolute", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(10))
      );
      expect(result.maxSelectableStrikeAbsolute).not.toBeUndefined();
    });

    it("returns a isStrikeValid", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(10))
      );
      expect(result.isStrikeValid).not.toBeUndefined();
    });
  });

  describe("strikeSelectedRelative is computated correctly (strikeSelected * 100 / tokenPrice)", () => {
    it("is 0 with the default values", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(10))
      );
      expect(result.strikeSelectedRelative.value).toBe(0);
    });

    it("is 5 with tokenPrice = 100 and strikeSelected = 5", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(100))
      );
      result.strikeSelected.value = 5;
      expect(result.strikeSelectedRelative.value).toBe(5);
    });

    it("is 0.5 with tokenPrice = 1000 and strikeSelected = 5", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(1000))
      );
      result.strikeSelected.value = 5;
      expect(result.strikeSelectedRelative.value).toBe(0.5);
    });

    it("is 6.67 with tokenPrice = 1500 and strikeSelected = 100", () => {
      const [result] = withSetupUrql(() =>
        useStrikeSelection(ref("0x000"), ref(1500))
      );
      result.strikeSelected.value = 100;
      expect(result.strikeSelectedRelative.value).toBe(6.67);
    });
  });

  describe("maxSelectableStrikeAbsolute is computated correctly", () => {
    it("is 0 if there isn't a strike", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(() =>
        useStrikeSelection(tokenAddress, ref(10))
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableStrikeAbsolute.value).toBe(0);
      });
    });

    it("is 0 if there isn't a strike with liquidity", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useStrikeSelection(tokenAddress, ref(50)),
        mockCriterias([
          { templates: [], maxStrikePercent: 1050 },
          { templates: [], maxStrikePercent: 200 },
          { templates: [], maxStrikePercent: 15 },
        ])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableStrikeAbsolute.value).toBe(0);
      });
    });

    it("returns the tokenPrice if there is only one strike with liquidity and maxStrikePercent 100", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useStrikeSelection(tokenAddress, ref(10)),
        mockCriterias([{ templates: [1, 2, 3], maxStrikePercent: 100 }])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableStrikeAbsolute.value).toBe(10);
      });
    });

    it("returns the tokenPrice if the biggest strike with liquidity is 100", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useStrikeSelection(tokenAddress, ref(50)),
        mockCriterias([
          { templates: [1, 2, 3], maxStrikePercent: 100 },
          { templates: [], maxStrikePercent: 3000 },
          { templates: [4, 5, 6], maxStrikePercent: 10 },
        ])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableStrikeAbsolute.value).toBe(50);
      });
    });

    it("returns tokenPrice * 3 if the biggest strike with liquidity is 300", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useStrikeSelection(tokenAddress, ref(15)),
        mockCriterias([
          { templates: [1, 2, 3], maxStrikePercent: 150 },
          { templates: [7, 8, 9], maxStrikePercent: 300 },
          { templates: [4, 5, 6], maxStrikePercent: 190 },
        ])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableStrikeAbsolute.value).toBe(45);
      });
    });
  });
});
