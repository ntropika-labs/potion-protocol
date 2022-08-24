import { describe, expect, it } from "vitest";
import { useRoutePotionId } from "../useRoutePotionId";

describe("useRoutePotionId", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns an address", () => {
      const { address } = useRoutePotionId({});
      expect(address).not.toBeNull();
    });

    it("returns a potionAddress", () => {
      const { potionAddress } = useRoutePotionId({});
      expect(potionAddress).not.toBeNull();
    });

    it("returns a validAddress", () => {
      const { validAddress } = useRoutePotionId({});
      expect(validAddress).not.toBeNull();
    });
  });

  describe("it parse address correctly", () => {
    it("returns potionAddress as a string", () => {
      const { potionAddress } = useRoutePotionId({
        id: "0x000",
      });
      expect(potionAddress.value).toBe("0x000");
    });

    it("returns '' if potionAddress is an array of addresses", () => {
      const { potionAddress } = useRoutePotionId({
        id: ["0x10", "0x20"],
      });
      expect(potionAddress.value).toBe("");
    });

    it("returns '' if address is a random string", () => {
      const { potionAddress } = useRoutePotionId({
        id: "fefefe",
      });
      expect(potionAddress.value).toBe("");
    });

    it("returns '' if address is an array of random strings", () => {
      const { potionAddress } = useRoutePotionId({
        id: ["10", "ab"],
      });
      expect(potionAddress.value).toBe("");
    });

    it("returns '' if there isn't a potionAddress", () => {
      const { potionAddress } = useRoutePotionId({});
      expect(potionAddress.value).toBe("");
    });
  });

  describe("it validates as expected", () => {
    it("returns true with a correct potion address", () => {
      const { validAddress } = useRoutePotionId({
        id: "0x000",
      });
      expect(validAddress.value).toBe(true);
    });

    it("returns false if address isn't a valid address", () => {
      const { validAddress } = useRoutePotionId({
        id: "abcd",
      });
      expect(validAddress.value).toBe(false);
    });

    it("returns false if address is an array of addresses", () => {
      const { validAddress } = useRoutePotionId({
        id: ["0x10", "0x20"],
      });
      expect(validAddress.value).toBe(false);
    });

    it("returns false if address is an array of random strings", () => {
      const { validAddress } = useRoutePotionId({
        id: ["10", "ab"],
      });
      expect(validAddress.value).toBe(false);
    });

    it("returns false if there isn't a address", () => {
      const { validAddress } = useRoutePotionId({});
      expect(validAddress.value).toBe(false);
    });
  });
});
