import type { IPool, IPoolUntyped } from "./types";
import { CurveCriteria, HyperbolicCurve } from "contracts-math";

import { parseUnits } from "@ethersproject/units";

import { CounterpartyDetails } from "./types";

/**
 *
 * @param pools
 * @param orderSize
 * @returns returns true if the liquidity is higher or equal than the order size
 */
const checkTotalUnlockedCollateral = (
  pools: IPoolUntyped[],
  orderSize: number
): boolean => {
  return pools.reduce((sum, pool) => {
    return sum + parseFloat(pool.unlocked);
  }, 0) >= orderSize
    ? true
    : false;
};

/**
 *
 * @param pool
 * @param deltaX
 * @returns the marginal cost for the selected deltaX for the given pool
 */
const calculateMarginalCostForDeltaX = (
  pool: IPool,
  deltaX: number
): number => {
  const poolCurrentLocked = pool.poolOrderSize + pool.locked;
  const numerator =
    (poolCurrentLocked + deltaX) *
      pool.curve.evalAt((poolCurrentLocked + deltaX) / pool.size) -
    poolCurrentLocked * pool.curve.evalAt(poolCurrentLocked / pool.size);
  return numerator / deltaX;
};

/**
 *
 * @param pool
 * @param currentOrderSize
 * @param deltaX
 * @param depthFactor value from 0 to 1 representing a %
 * @param gas gas in WEI
 * @returns the depth marginal cost
 */
const calculateDepthMarginalCost = (
  pool: IPool,
  currentOrderSize: number,
  deltaX: number,
  depthFactor: number,
  gas: number
): number => {
  const unlocked =
    pool.maxUtil * pool.size - (pool.locked + pool.poolOrderSize);
  const selectedOrderSize = Math.min(unlocked, currentOrderSize);

  const lookupDepth =
    deltaX * (1 - depthFactor) + selectedOrderSize * depthFactor;

  const left =
    (lookupDepth + pool.locked) *
    pool.curve.evalAt((lookupDepth + pool.locked) / pool.size);
  const right = pool.locked * pool.curve.evalAt(pool.locked / pool.size);

  const numerator = left - right;

  const depthMarginalCost = numerator / lookupDepth;

  return gas / selectedOrderSize + depthMarginalCost;
};

const poolUntypedToTyped = (pool: IPoolUntyped): IPool => {
  const unlocked = parseFloat(pool.size) - parseFloat(pool.locked);
  const hyperbolicCurve = new HyperbolicCurve(
    parseFloat(pool.curve.a),
    parseFloat(pool.curve.b),
    parseFloat(pool.curve.c),
    parseFloat(pool.curve.d),
    parseFloat(pool.curve.maxUtil)
  );

  return {
    id: pool.id,
    poolId: parseInt(pool.poolId),
    lp: pool.lp,
    size: parseFloat(pool.size),
    locked: parseFloat(pool.locked),
    unlocked: unlocked,
    curve: hyperbolicCurve,
    curveCriteria: new CurveCriteria(
      pool.underlyingAddress,
      pool.strikeAddress,
      pool.isPut,
      parseFloat(pool.maxStrikePercent),
      parseFloat(pool.maxDurationInDays)
    ),
    poolOrderSize: 0,
    poolPremium: 0,
    marginalCostForDeltaX: 0,
    initialMarginalCost: 0,
    maxUtil: parseFloat(pool.curve.maxUtil),
    util: parseFloat(pool.utilization),
  };
};

const createCounterpartyDetail = (
  lp: string,
  poolId: number,
  curve: HyperbolicCurve,
  curveCriteria: CurveCriteria,
  orderSize: number,
  strikePriceUSDC: number
): CounterpartyDetails => {
  const collateralAmount = parseUnits(orderSize.toFixed(6));
  const strikePriceUSDCParsed = parseUnits(strikePriceUSDC.toFixed(6));
  const oTokenAmount = collateralAmount.mul(1e8).div(strikePriceUSDCParsed);
  return new CounterpartyDetails(
    lp,
    poolId,
    curve,
    curveCriteria,
    oTokenAmount
  );
};

export {
  calculateMarginalCostForDeltaX,
  poolUntypedToTyped,
  calculateDepthMarginalCost,
  createCounterpartyDetail,
  checkTotalUnlockedCollateral,
};
