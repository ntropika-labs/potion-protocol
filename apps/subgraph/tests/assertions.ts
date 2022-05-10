/*
 * Functions used to assert the equality of fields in an entity with some parameters
 * used to make the unit tests easier to read
 */

import { assert } from "matchstick-as/assembly/index";

export function assertPoolExists(
  poolId: string,
  size: string,
  unlocked: string,
  locked: string,
  lp: string
): void {
  assert.fieldEquals("Pool", poolId, "size", size);
  assert.fieldEquals("Pool", poolId, "unlocked", unlocked);
  assert.fieldEquals("Pool", poolId, "locked", locked);
  assert.fieldEquals("Pool", poolId, "lp", lp);
}

export function assertPoolLiquidity(
  poolId: string,
  size: string,
  unlocked: string,
  locked: string,
  initialBalance: string
): void {
  assert.fieldEquals("Pool", poolId, "size", size);
  assert.fieldEquals("Pool", poolId, "unlocked", unlocked);
  assert.fieldEquals("Pool", poolId, "locked", locked);
  assert.fieldEquals("Pool", poolId, "initialBalance", initialBalance);
}

export function assertPoolMarketData(
  poolId: string,
  pnlTotal: string,
  pnlPercentage: string,
  liquidityAtTrades: string
): void {
  assert.fieldEquals("Pool", poolId, "pnlTotal", pnlTotal);
  assert.fieldEquals("Pool", poolId, "pnlPercentage", pnlPercentage);
  assert.fieldEquals("Pool", poolId, "liquidityAtTrades", liquidityAtTrades);
}

export function assertTemplateLiquidity(
  templateId: string,
  size: string,
  locked: string
): void {
  assert.fieldEquals("Template", templateId, "size", size);
  assert.fieldEquals("Template", templateId, "locked", locked);
}

export function assertCurveFields(
  curveId: string,
  a: string,
  b: string,
  c: string,
  d: string,
  maxUtil: string
): void {
  assert.fieldEquals("Curve", curveId, "a", a);
  assert.fieldEquals("Curve", curveId, "b", b);
  assert.fieldEquals("Curve", curveId, "c", c);
  assert.fieldEquals("Curve", curveId, "d", d);
  assert.fieldEquals("Curve", curveId, "maxUtil", maxUtil);
}

export function assertCriteriaFields(
  criteriaId: string,
  isPut: string,
  maxStrikePercent: string,
  maxDurationInDays: string
): void {
  assert.fieldEquals("Criteria", criteriaId, "isPut", isPut);
  assert.fieldEquals(
    "Criteria",
    criteriaId,
    "maxStrikePercent",
    maxStrikePercent
  );
  assert.fieldEquals(
    "Criteria",
    criteriaId,
    "maxDurationInDays",
    maxDurationInDays
  );
}

export function assertOtokenFields(
  otokenId: string,
  tokenAddress: string,
  creator: string,
  underlyingAsset: string,
  strikeAsset: string,
  collateralAsset: string,
  strikePrice: string,
  expiry: string,
  isPut: string,
  decimals: string,
  settled: string,
  premium: string,
  collateralized: string,
  liquiditySettled: string,
  numberOfOTokens: string,
  purchasesCount: string
): void {
  assert.fieldEquals("OToken", otokenId, "collateralAsset", collateralAsset);
  assert.fieldEquals("OToken", otokenId, "collateralized", collateralized);
  assert.fieldEquals("OToken", otokenId, "creator", creator);
  assert.fieldEquals("OToken", otokenId, "decimals", decimals);
  assert.fieldEquals("OToken", otokenId, "expiry", expiry);
  assert.fieldEquals("OToken", otokenId, "isPut", isPut);
  assert.fieldEquals("OToken", otokenId, "liquiditySettled", liquiditySettled);
  assert.fieldEquals("OToken", otokenId, "numberOfOTokens", numberOfOTokens);
  assert.fieldEquals("OToken", otokenId, "premium", premium);
  assert.fieldEquals("OToken", otokenId, "purchasesCount", purchasesCount);
  assert.fieldEquals("OToken", otokenId, "settled", settled);
  assert.fieldEquals("OToken", otokenId, "strikeAsset", strikeAsset);
  assert.fieldEquals("OToken", otokenId, "strikePrice", strikePrice);
  assert.fieldEquals("OToken", otokenId, "tokenAddress", tokenAddress);
  assert.fieldEquals("OToken", otokenId, "underlyingAsset", underlyingAsset);
}
