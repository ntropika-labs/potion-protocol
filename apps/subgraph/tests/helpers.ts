import {
  Curve,
  Criteria,
  CriteriaSet,
  OToken,
  CriteriaJoinedCriteriaSet,
} from "../generated/schema";
import {
  createPool,
  createPoolId,
  createTemplate,
  createTemplateId,
} from "../src/pools";

import { BigInt, Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import {
  COLLATERAL_PRECISION_BIG_INT,
  CURVE_PRECISION_BIG_INT,
  STRIKE_PRECISION_BIG_INT,
} from "./constants";
import { createCriteriaJoinedCriteriaSetId } from "../src/criterias";

import { assert } from "matchstick-as/assembly/index";

export function assertEntity(
  entity: string,
  id: string,
  values: string[][]
): void {
  for (let i = 0; i < values.length; i += 1) {
    assert.fieldEquals(entity, id, values[i][0], values[i][1]);
  }
}

export function createNewPool(
  lp: Address,
  poolId: BigInt,
  size: string,
  templateId: string
): void {
  const poolSize = BigDecimal.fromString(size);
  const id = createPoolId(lp, poolId);
  const pool = createPool(id, lp, poolId);
  pool.template = templateId;
  pool.size = poolSize;
  pool.unlocked = poolSize;
  pool.initialBalance = poolSize;
  pool.save();
}

export function createNewTemplate(
  curveHash: string,
  criteriaSetHash: string,
  size: string,
  locked: string,
  pnl: string,
  lp: Bytes
): void {
  const id = createTemplateId(
    Bytes.fromHexString(curveHash),
    Bytes.fromHexString(criteriaSetHash)
  );
  const template = createTemplate(id, curveHash, criteriaSetHash, lp);
  template.size = BigDecimal.fromString(size);
  template.locked = BigDecimal.fromString(locked);
  template.pnl = BigDecimal.fromString(pnl);
  template.save();
}

export function createNewCurve(
  id: string,
  a: BigDecimal,
  b: BigDecimal,
  c: BigDecimal,
  d: BigDecimal,
  maxUtil: BigDecimal
): void {
  const curve = new Curve(id);
  curve.a = a;
  curve.b = b;
  curve.c = c;
  curve.d = d;
  curve.maxUtil = maxUtil;
  curve.save();
}

export function toCurveParam(value: string): BigInt {
  return BigInt.fromString(value).times(CURVE_PRECISION_BIG_INT);
}

export function formatCollateral(value: string): BigInt {
  return BigInt.fromString(value).times(COLLATERAL_PRECISION_BIG_INT);
}

export function formatStrike(value: string): BigInt {
  return BigInt.fromString(value).times(STRIKE_PRECISION_BIG_INT);
}

export function createNewCriteria(
  id: string,
  underlyingAsset: string,
  strikeAsset: string,
  isPut: boolean,
  maxStrikePercent: BigDecimal,
  maxDurationInDays: BigInt
): void {
  const criteria = new Criteria(id);
  criteria.underlyingAsset = underlyingAsset;
  criteria.strikeAsset = strikeAsset;
  criteria.isPut = isPut;
  criteria.maxStrikePercent = maxStrikePercent;
  criteria.maxDurationInDays = maxDurationInDays;
  criteria.save();
}

export function createNewCriteriaSet(id: string): void {
  const criteriaSet = new CriteriaSet(id);
  criteriaSet.save();
}

export function createNewCriteriaJoinedCriteriaSet(
  criteriaId: string,
  criteriaSetId: string
): void {
  const id = createCriteriaJoinedCriteriaSetId(
    Bytes.fromHexString(criteriaId),
    Bytes.fromHexString(criteriaSetId)
  );
  const criteriaJoinedCriteriaSet = new CriteriaJoinedCriteriaSet(id);

  criteriaJoinedCriteriaSet.criteria = criteriaId;
  criteriaJoinedCriteriaSet.criteriaSet = criteriaSetId;
  criteriaJoinedCriteriaSet.save();
}

export function createNewOtoken(
  id: string,
  tokenAddress: string,
  creator: string,
  underlyingAsset: string,
  strikeAsset: string,
  collateralAsset: string,
  strikePrice: BigDecimal,
  expiry: BigInt,
  isPut: boolean,
  decimals: BigInt,
  settled: boolean,
  premium: BigDecimal,
  collateralized: BigDecimal,
  liquiditySettled: BigDecimal,
  numberOfOTokens: BigDecimal,
  purchasesCount: BigInt
): void {
  const otoken = new OToken(id);
  otoken.tokenAddress = Bytes.fromHexString(tokenAddress);
  otoken.creator = Bytes.fromHexString(creator);
  otoken.underlyingAsset = underlyingAsset;
  otoken.strikeAsset = strikeAsset;
  otoken.collateralAsset = collateralAsset;
  otoken.strikePrice = strikePrice;
  otoken.expiry = expiry;
  otoken.isPut = isPut;
  otoken.decimals = decimals;
  otoken.settled = settled;
  otoken.premium = premium;
  otoken.collateralized = collateralized;
  otoken.liquiditySettled = liquiditySettled;
  otoken.numberOfOTokens = numberOfOTokens;
  otoken.purchasesCount = purchasesCount;

  otoken.save();
}
