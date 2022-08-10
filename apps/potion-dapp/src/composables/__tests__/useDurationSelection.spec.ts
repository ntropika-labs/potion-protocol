import { describe, expect, it } from "vitest";
import { ref, nextTick } from "vue";
import { useDurationSelection } from "../useDurationSelection";
import { withSetupUrql } from "./test-utils";
import { mockCriterias } from "./test-mocks";

describe("useDurationSelection", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a durationSelected", () => {
      const [result] = withSetupUrql(() =>
        useDurationSelection(ref("0x000"), ref(10))
      );
      expect(result.durationSelected).not.toBeUndefined();
    });

    it("returns a durationSelectedDate", () => {
      const [result] = withSetupUrql(() =>
        useDurationSelection(ref("0x000"), ref(10))
      );
      expect(result.durationSelectedDate).not.toBeUndefined();
    });

    it("returns a isDurationValid", () => {
      const [result] = withSetupUrql(() =>
        useDurationSelection(ref("0x000"), ref(10))
      );
      expect(result.isDurationValid).not.toBeUndefined();
    });

    it("returns a maxSelectableDuration", () => {
      const [result] = withSetupUrql(() =>
        useDurationSelection(ref("0x000"), ref(10))
      );
      expect(result.maxSelectableDuration).not.toBeUndefined();
    });

    it("returns a maxSelectableDurationInDays", () => {
      const [result] = withSetupUrql(() =>
        useDurationSelection(ref("0x000"), ref(10))
      );
      expect(result.maxSelectableDurationInDays).not.toBeUndefined();
    });

    it("returns a setDurationFromExpiry", () => {
      const [result] = withSetupUrql(() =>
        useDurationSelection(ref("0x000"), ref(10))
      );
      expect(result.setDurationFromExpiry).not.toBeUndefined();
    });
  });

  describe("maxSelectableDuration is computated correctly", () => {
    it("is 0 if there isn't a duration", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(() =>
        useDurationSelection(tokenAddress, ref(10))
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableDuration.value).toBe(0);
      });
    });

    it("is 0 if there isn't a duration with liquidity", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useDurationSelection(tokenAddress, ref(10)),
        mockCriterias([
          { templates: [], maxDurationInDays: 5 },
          { templates: [], maxDurationInDays: 20 },
          { templates: [], maxDurationInDays: 15 },
        ])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableDuration.value).toBe(0);
      });
    });

    it("is 10 if there is only one maxDurationInDays with liquidity and value 10", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useDurationSelection(tokenAddress, ref(10)),
        mockCriterias([{ templates: [1], maxDurationInDays: 10 }])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableDuration.value).toBe(10);
      });
    });

    it("is 30 if the biggest maxDurationInDays with liquidity is 30", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(
        () => useDurationSelection(tokenAddress, ref(10)),
        mockCriterias([
          { templates: [1], maxDurationInDays: 10 },
          { templates: [4, 6], maxDurationInDays: 5 },
          { templates: [5], maxDurationInDays: 30 },
          { templates: [], maxDurationInDays: 150 },
        ])
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableDuration.value).toBe(30);
      });
    });
  });

  // note: in the unit tests the blockchain timestamp is set to 0 (means that the time starts from 01/01/1970)
  describe("maxSelectableDurationInDays is computated correctly", () => {
    it("is 01/01/1970 if there isn't a duration", () => {
      const tokenAddress = ref("");
      const [result] = withSetupUrql(() =>
        useDurationSelection(tokenAddress, ref(10))
      );
      tokenAddress.value = "0x000";
      nextTick(() => {
        expect(result.maxSelectableDurationInDays.value).toBe("Jan 1, 1970");
      });
    });
  });

  it("is 01/02/1970 the biggest maxDurationInDays with liquidity is 31", () => {
    const tokenAddress = ref("");
    const [result] = withSetupUrql(
      () => useDurationSelection(tokenAddress, ref(10)),
      mockCriterias([
        { templates: [1], maxDurationInDays: 10 },
        { templates: [4, 6], maxDurationInDays: 5 },
        { templates: [5], maxDurationInDays: 31 },
        { templates: [], maxDurationInDays: 150 },
      ])
    );
    tokenAddress.value = "0x000";
    nextTick(() => {
      expect(result.maxSelectableDurationInDays.value).toBe("Feb 1, 1970");
    });
  });
});
