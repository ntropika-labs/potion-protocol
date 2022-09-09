import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useVaultOperatorActions } from "../useVaultOperatorActions";
import { withSetup } from "./test-utils";

describe("useVaultOperatorActions", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns totalAmountToSwap", () => {
      const [result] = withSetup(() =>
        useVaultOperatorActions(ref({ isFinal: true, currentPayout: 1 }))
      );
      expect(result.totalAmountToSwap).not.toBeUndefined();
    });
    it("returns isActionLoading", () => {
      const [result] = withSetup(() =>
        useVaultOperatorActions(ref({ isFinal: true, currentPayout: 1 }))
      );
      expect(result.isActionLoading).not.toBeUndefined();
    });
    it("returns isTotalAmountValid", () => {
      const [result] = withSetup(() =>
        useVaultOperatorActions(ref({ isFinal: true, currentPayout: 1 }))
      );
      expect(result.isTotalAmountValid).not.toBeUndefined();
    });
    it("returns hasCounterparties", () => {
      const [result] = withSetup(() =>
        useVaultOperatorActions(ref({ isFinal: true, currentPayout: 1 }))
      );
      expect(result.hasCounterparties).not.toBeUndefined();
    });
    it("returns isEnterPositionOperationValid", () => {
      const [result] = withSetup(() =>
        useVaultOperatorActions(ref({ isFinal: true, currentPayout: 1 }))
      );
      expect(result.isEnterPositionOperationValid).not.toBeUndefined();
    });
    it("returns isExitPositionOperationValid", () => {
      const [result] = withSetup(() =>
        useVaultOperatorActions(ref({ isFinal: true, currentPayout: 1 }))
      );
      expect(result.isExitPositionOperationValid).not.toBeUndefined();
    });
  });
});
