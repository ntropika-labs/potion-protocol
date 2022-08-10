import { describe, expect, it } from "vitest";
import { getTokenFromAddress, toOptionToken } from "../tokens";

describe("tokens helper", () => {
  describe("getTokenFromAddress", () => {
    it("returns an empty token if the address doesn't exist in the TokenList", () => {
      const result = getTokenFromAddress("0x000");
      expect(result).toMatchObject({
        address: "0x000",
        name: "",
        symbol: "",
        image: "",
        decimals: 18,
      });
    });

    it("returns a token from the TokenList", () => {
      const result = getTokenFromAddress(
        "0xc5a5c42992decbae36851359345fe25997f5c42d",
        22
      );
      expect(result).toMatchObject({
        address: "0xc5a5c42992decbae36851359345fe25997f5c42d",
        name: "Uniswap",
        symbol: "UNI",
        image:
          "https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
        decimals: 22,
      });
    });
  });

  describe("toOptionToken", () => {
    it("formats an option token correctly", () => {
      const mockedToken = {
        address: "0x001",
        name: "Mocked Token",
        symbol: "MCK",
        image: "http://mocked.com/logo.png",
      };
      const result = toOptionToken(mockedToken, "100", "200");
      expect(result).toMatchObject({
        id: "",
        isPut: false,
        duration: "100",
        strike: "200",
        address: "0x001",
        name: "Mocked Token",
        symbol: "MCK",
        image: "http://mocked.com/logo.png",
      });
    });
  });
});
