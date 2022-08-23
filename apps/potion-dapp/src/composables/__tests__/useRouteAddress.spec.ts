import { describe, expect, it } from "vitest";
import { useRouteAddress } from "../useRouteAddress";

describe("useRouteAddress", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a formattedAddress", () => {
      const { formattedAddress } = useRouteAddress();
      expect(formattedAddress).not.toBeUndefined();
    });

    it("returns a validAddress", () => {
      const { validAddress } = useRouteAddress();
      expect(validAddress).not.toBeUndefined();
    });
  });

  describe("it parse address correctly", () => {
    it("returns the address if it is a string", () => {
      const { formattedAddress } = useRouteAddress("0x000");
      expect(formattedAddress.value).toBe("0x000");
    });

    it("returns '' if address is an array", () => {
      const { formattedAddress } = useRouteAddress(["0x000", "0x0001"]);
      expect(formattedAddress.value).toBe("");
    });

    it("returns '' if there isn't an address", () => {
      const { formattedAddress } = useRouteAddress();
      expect(formattedAddress.value).toBe("");
    });

    it("returns address in lower case", () => {
      const { formattedAddress } = useRouteAddress("0xABCD");
      expect(formattedAddress.value).toBe("0xabcd");
    });
  });

  describe("it validates address as expected", () => {
    it("returns true with a correct address", () => {
      const { validAddress } = useRouteAddress("0x000");
      expect(validAddress.value).toBe(true);
    });

    it("returns false if address isn't a valid address", () => {
      const { validAddress } = useRouteAddress("aaa");
      expect(validAddress.value).toBe(false);
    });

    it("returns false if address is an array", () => {
      const { validAddress } = useRouteAddress(["0x000", "0x001"]);
      expect(validAddress.value).toBe(false);
    });

    it("returns false if there isn't an address", () => {
      const { validAddress } = useRouteAddress();
      expect(validAddress.value).toBe(false);
    });
  });
});
