import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useVaultOperatorCalculations } from "../useVaultOperatorCalculations";
import { withSetup } from "./test-utils";

describe("useVaultOperatorCalculations", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns oraclePrice", () => {
      const [result] = withSetup(() =>
        useVaultOperatorCalculations(ref(""), ref(1), ref(1), ref(1))
      );
      expect(result.oraclePrice).not.toBeUndefined();
    });
    it("returns strikePrice", () => {
      const [result] = withSetup(() =>
        useVaultOperatorCalculations(ref(""), ref(1), ref(1), ref(1))
      );
      expect(result.strikePrice).not.toBeUndefined();
    });
    it("returns orderSize", () => {
      const [result] = withSetup(() =>
        useVaultOperatorCalculations(ref(""), ref(1), ref(1), ref(1))
      );
      expect(result.orderSize).not.toBeUndefined();
    });
    it("returns numberOfOtokensToBuyBN", () => {
      const [result] = withSetup(() =>
        useVaultOperatorCalculations(ref(""), ref(1), ref(1), ref(1))
      );
      expect(result.numberOfOtokensToBuyBN).not.toBeUndefined();
    });
  });
});
