import { min as _min, range as _range } from "lodash-es";

import { runMarginalCostRouter } from "./index";

import type { EmergingCurvePoints } from "dapp-types";
import type { CriteriaPool } from "./types";

const deltaX = 1000;
const curvePoints = 100;
const sqCurvePoints = curvePoints ** 2;
const step = 1 / curvePoints;

const initialPoint = [_min([step / 10, 1 / sqCurvePoints])];

const stepArray = initialPoint.concat(_range(step, 1, step)) as number[];

/**
 *
 * @param criteriaPools
 * @returns the data needed to compute the chart for the emerging bonding curves of the selected criterias
 */
const getEmergingBondingCurvesFromCriterias = async (
  criteriaPools: CriteriaPool[]
): Promise<EmergingCurvePoints[]> => {
  const bondingCurves: EmergingCurvePoints[] = [];
  for (const { pools, symbol } of criteriaPools) {
    let data = [] as number[];
    if (pools.length > 0) {
      const totalUnlocked = pools.reduce(
        (sum, pool) => sum + parseFloat(pool.unlocked),
        0
      );
      data = stepArray.map((step) => {
        const orderSize = totalUnlocked * step;
        const { premium } = runMarginalCostRouter(pools, orderSize, deltaX, 1);
        return orderSize > 0 ? premium / orderSize : 0;
      });
    }
    bondingCurves.push({
      data,
      symbol,
    });
  }
  return bondingCurves;
};

export { getEmergingBondingCurvesFromCriterias };
