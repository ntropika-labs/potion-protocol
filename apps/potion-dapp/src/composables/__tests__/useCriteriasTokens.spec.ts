import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useCriteriasTokens } from "../useCriteriasTokens";
import { withSetup } from "./test-utils";

describe("useCriteriasTokens", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns tokens", () => {
      const [result] = withSetup(() => useCriteriasTokens(ref([])));
      expect(result.tokens).not.toBeUndefined();
    });

    it("returns tokenPricesMap", () => {
      const [result] = withSetup(() => useCriteriasTokens(ref([])));
      expect(result.tokenPricesMap).not.toBeUndefined();
    });

    it("returns assets", () => {
      const [result] = withSetup(() => useCriteriasTokens(ref([])));
      expect(result.assets).not.toBeUndefined();
    });
  });
});
