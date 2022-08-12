import { describe, expect, it } from "vitest";
import { isValidAddress, getEtherscanUrl, formatAddress } from "../addresses";

describe("addresses helper", () => {
  describe("isValidAddress", () => {
    it("returns true if the string is an address", () => {
      const result = isValidAddress("0x000");
      expect(result).toBe(true);
    });

    it("returns false if the string is composed of random characters", () => {
      const result = isValidAddress("abcd");
      expect(result).toBe(false);
    });
  });

  describe("formatAddress", () => {
    it("returns address if it is already formatted correctly", () => {
      const result = formatAddress("0xabc123def");
      expect(result).toBe("0xabc123def");
    });

    it("returns address if it isn't in lower case", () => {
      const result = formatAddress("0xaBCd123eF");
      expect(result).toBe("0xabcd123ef");
    });
  });

  describe("getEtherscanUrl", () => {
    it("returns the link to etherscan", () => {
      const result = getEtherscanUrl("0xab12cd34ef");
      expect(result).toBe(
        "https://localhost.etherscan.io/address/0xab12cd34ef"
      );
    });
  });
});
