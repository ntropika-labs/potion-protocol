import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePotionQuantity } from "../usePotionQuantity";

describe("usePotionQuantity", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns potionQuantity", () => {
      const { potionQuantity } = usePotionQuantity(ref(0));
      expect(potionQuantity).not.toBeUndefined();
    });

    it("returns isPotionQuantityValid", () => {
      const { isPotionQuantityValid } = usePotionQuantity(ref(0));
      expect(isPotionQuantityValid).not.toBeUndefined();
    });

    it("returns orderSize", () => {
      const { orderSize } = usePotionQuantity(ref(0));
      expect(orderSize).not.toBeUndefined();
    });
  });

  describe("orderSize computation", () => {
    it("returns 0 if strikeSelected is 0", () => {
      const { orderSize } = usePotionQuantity(ref(0));
      expect(orderSize.value).toBe(0);
    });
    it("returns 0.2 if potionQuantity is default and strikeSelected is 200", () => {
      const { orderSize } = usePotionQuantity(ref(200));
      expect(orderSize.value).toBe(0.2);
    });
    it("returns 0 if potionQuantity is 0 and strikeSelected is 100", () => {
      const { potionQuantity, orderSize } = usePotionQuantity(ref(100));
      potionQuantity.value = 0;
      expect(orderSize.value).toBe(0);
    });
    it("returns 90 if potionQuantity is 2 and strikeSelected is 45", () => {
      const { potionQuantity, orderSize } = usePotionQuantity(ref(45));
      potionQuantity.value = 2;
      expect(orderSize.value).toBe(90);
    });
  });
});
