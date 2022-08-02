import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useSlippage } from "../useSlippage";

describe("useSlippage", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns slippage", () => {
      const { slippage } = useSlippage(ref(null));
      expect(slippage).not.toBeUndefined();
    });

    it("returns premiumSlippage", () => {
      const { premiumSlippage } = useSlippage(ref(null));
      expect(premiumSlippage).not.toBeUndefined();
    });

    it("returns formattedPremiumSlippage", () => {
      const { formattedPremiumSlippage } = useSlippage(ref(null));
      expect(formattedPremiumSlippage).not.toBeUndefined();
    });

    it("returns handleSlippageSelection", () => {
      const { handleSlippageSelection } = useSlippage(ref(null));
      expect(handleSlippageSelection).not.toBeUndefined();
    });
  });

  describe("handles slippage correctly", () => {
    it("has 3 options", () => {
      const { slippage } = useSlippage(ref(null));
      expect(slippage.value.length).toBe(3);
    });

    it("sets the first element as selected by default", () => {
      const { slippage } = useSlippage(ref(null));
      expect(slippage.value[0].selected).toBe(true);
      expect(slippage.value[1].selected).toBe(false);
      expect(slippage.value[2].selected).toBe(false);
    });

    it("can change the selected item", () => {
      const { slippage, handleSlippageSelection } = useSlippage(ref(null));
      handleSlippageSelection(1);
      expect(slippage.value[0].selected).toBe(false);
      expect(slippage.value[1].selected).toBe(true);
      expect(slippage.value[2].selected).toBe(false);
    });

    it("doesn't change the selected item if the index is < than 0", () => {
      const { slippage, handleSlippageSelection } = useSlippage(ref(null));
      handleSlippageSelection(-2);
      expect(slippage.value[0].selected).toBe(true);
      expect(slippage.value[1].selected).toBe(false);
      expect(slippage.value[2].selected).toBe(false);
    });

    it("doesn't change the selected item if the index is > than slippage length", () => {
      const { slippage, handleSlippageSelection } = useSlippage(ref(null));
      handleSlippageSelection(30);
      expect(slippage.value[0].selected).toBe(true);
      expect(slippage.value[1].selected).toBe(false);
      expect(slippage.value[2].selected).toBe(false);
    });
  });

  describe("calculates the premium correctly", () => {
    it("returns 0 if there isn't a RouterResult", () => {
      const { premiumSlippage, formattedPremiumSlippage } = useSlippage(
        ref(null)
      );
      expect(premiumSlippage.value).toBe(0);
      expect(formattedPremiumSlippage.value).toBe("USDC 0.0");
    });

    it("calculates the premium if there is a RouterResult", () => {
      const { premiumSlippage, formattedPremiumSlippage } = useSlippage(
        ref({ premium: 1, premiumGas: 0, counterparties: [] })
      );
      expect(premiumSlippage.value).toBe(1.005);
      expect(formattedPremiumSlippage.value).toBe("USDC 1.01");
    });

    it("calculates the premium if there is a RouterResult and slippage changes", () => {
      const {
        premiumSlippage,
        formattedPremiumSlippage,
        handleSlippageSelection,
      } = useSlippage(ref({ premium: 2, premiumGas: 0, counterparties: [] }));
      handleSlippageSelection(2);
      expect(premiumSlippage.value).toBe(2.1);
      expect(formattedPremiumSlippage.value).toBe("USDC 2.1");
    });
  });
});
