import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePotion } from "../usePotion";
import { withSetupUrql } from "./test-utils";

const mockOtoken = (
  tokenAddress: string,
  strikePrice: number,
  expiry: number,
  underlyingAddress: string
) => ({
  otoken: {
    tokenAddress,
    underlyingAsset: {
      symbol: "foo",
      name: "bar",
      address: underlyingAddress,
      decimals: 18,
    },
    expiry,
    strikePrice,
  },
});

describe("usePotion", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns error", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.error).not.toBeUndefined();
    });

    it("returns fetching", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.fetching).not.toBeUndefined();
    });

    it("returns otoken", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otoken).not.toBeUndefined();
    });

    it("returns otokenAddress", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otokenAddress).not.toBeUndefined();
    });

    it("returns otokenStrikePrice", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otokenStrikePrice).not.toBeUndefined();
    });

    it("returns otokenExpiry", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otokenExpiry).not.toBeUndefined();
    });

    it("returns underlyingAddress", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.underlyingAddress).not.toBeUndefined();
    });
  });

  describe("otoken is computated correctly", () => {
    it("returns null if it fails to load", () => {
      const [result] = withSetupUrql(() => usePotion(ref("")));
      expect(result.otoken.value).toBeNull();
    });

    it("returns null if the potion doesn't exist", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otoken.value).toBeNull();
    });

    it("returns the otoken if it exists", () => {
      const [result] = withSetupUrql(
        () => usePotion(ref("0x000")),
        mockOtoken("0x000", 100, 30, "0x001")
      );
      expect(result.otoken.value).toEqual({
        tokenAddress: "0x000",
        underlyingAsset: {
          symbol: "foo",
          name: "bar",
          address: "0x001",
          decimals: 18,
        },
        expiry: 30,
        strikePrice: 100,
      });
    });
  });

  describe("otokenAddress is computated correctly", () => {
    it("returns null if it fails to load", () => {
      const [result] = withSetupUrql(() => usePotion(ref("")));
      expect(result.otokenAddress.value).toBeNull();
    });

    it("returns null if the potion doesn't exist", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otokenAddress.value).toBeNull();
    });

    it("returns the otoken tokenAddress if the otoken exists", () => {
      const [result] = withSetupUrql(
        () => usePotion(ref("0x000")),
        mockOtoken("0x010", 100, 30, "0x001")
      );
      expect(result.otokenAddress.value).toBe("0x010");
    });
  });

  describe("otokenStrikePrice is computated correctly", () => {
    it("returns 0 if it fails to load", () => {
      const [result] = withSetupUrql(() => usePotion(ref("")));
      expect(result.otokenStrikePrice.value).toBe(0);
    });

    it("returns 0 if the potion doesn't exist", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otokenStrikePrice.value).toBe(0);
    });

    it("returns the otoken strikePrice if the otoken exists", () => {
      const [result] = withSetupUrql(
        () => usePotion(ref("0x000")),
        mockOtoken("0x000", 250, 30, "0x001")
      );
      expect(result.otokenStrikePrice.value).toBe(250);
    });
  });

  describe("otokenExpiry is computated correctly", () => {
    it("returns 0 if it fails to load", () => {
      const [result] = withSetupUrql(() => usePotion(ref("")));
      expect(result.otokenExpiry.value).toBe(0);
    });

    it("returns 0 if the potion doesn't exist", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.otokenExpiry.value).toBe(0);
    });

    it("returns the otoken expiry if the otoken exists", () => {
      const [result] = withSetupUrql(
        () => usePotion(ref("0x000")),
        mockOtoken("0x000", 100, 68, "0x001")
      );
      expect(result.otokenExpiry.value).toBe(68);
    });
  });

  describe("underlyingAddress is computated correctly", () => {
    it("returns '' if it fails to load", () => {
      const [result] = withSetupUrql(() => usePotion(ref("")));
      expect(result.underlyingAddress.value).toBe("");
    });

    it("returns '' if the potion doesn't exist", () => {
      const [result] = withSetupUrql(() => usePotion(ref("0x000")));
      expect(result.underlyingAddress.value).toBe("");
    });

    it("returns the otoken underlyingAsset address if the otoken exists", () => {
      const [result] = withSetupUrql(
        () => usePotion(ref("0x000")),
        mockOtoken("0x000", 100, 30, "0x010")
      );
      expect(result.underlyingAddress.value).toBe("0x010");
    });
  });
});
