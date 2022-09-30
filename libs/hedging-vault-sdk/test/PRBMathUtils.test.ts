import { describe, expect, it } from "vitest";

import { getRateInUD60x18 } from "../src/PRBMathUtils";
import { toBn } from "evm-bn";

describe("PRBMathUtils", () => {
  it("same decimals rate", () => {
    const inputTokenPriceInUSD = 64.8; // USD/DAI
    const outputTokenPriceInUSD = 2.0; // USD/WETH
    const inputTokenDecimals = 18;
    const outputTokenDecimals = 18;

    const priceRateUD60x18 = getRateInUD60x18(
      inputTokenPriceInUSD,
      outputTokenPriceInUSD,
      inputTokenDecimals,
      outputTokenDecimals
    );

    expect(priceRateUD60x18).toEqual(toBn(String(32.4)));
  });
  it("input decimals greater than output decimals", () => {
    const inputTokenPriceInUSD = 64.8; // USD/DAI
    const outputTokenPriceInUSD = 2.0; // USD/USDC
    const inputTokenDecimals = 18;
    const outputTokenDecimals = 6;

    const priceRateUD60x18 = getRateInUD60x18(
      inputTokenPriceInUSD,
      outputTokenPriceInUSD,
      inputTokenDecimals,
      outputTokenDecimals
    );

    expect(priceRateUD60x18).toEqual(toBn(String(0.0000000000324)));
  });
  it("same decimals rate", () => {
    const inputTokenPriceInUSD = 64.8; // USD/USDC
    const outputTokenPriceInUSD = 2.0; // USD/WETH
    const inputTokenDecimals = 6;
    const outputTokenDecimals = 18;

    const priceRateUD60x18 = getRateInUD60x18(
      inputTokenPriceInUSD,
      outputTokenPriceInUSD,
      inputTokenDecimals,
      outputTokenDecimals
    );

    expect(priceRateUD60x18).toEqual(toBn(String(32400000000000)));
  });
  it("rate is passed as first parameter", () => {
    const priceRate = 32.4; // WETH/USDC
    const one = 1;
    const inputTokenDecimals = 6;
    const outputTokenDecimals = 18;

    const priceRateUD60x18 = getRateInUD60x18(
      priceRate,
      one,
      inputTokenDecimals,
      outputTokenDecimals
    );

    expect(priceRateUD60x18).toEqual(toBn(String(32400000000000)));
  });
  it("bignumber is supported", () => {
    const inputTokenPriceInUSD = toBn("64.8"); // USD/DAI
    const outputTokenPriceInUSD = toBn("2.0"); // USD/WETH
    const inputTokenDecimals = 18;
    const outputTokenDecimals = 18;

    const priceRateUD60x18 = getRateInUD60x18(
      inputTokenPriceInUSD,
      outputTokenPriceInUSD,
      inputTokenDecimals,
      outputTokenDecimals
    );

    expect(priceRateUD60x18).toEqual(toBn(String(32.4)));
  });
});
