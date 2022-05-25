import { min as _min, range as _range } from "lodash-es";

import { runMarginalCostRouter } from "./index";

import type { EmergingCurvePoints } from "dapp-types";
import type { ChartCriteriaPool } from "./types";

const deltaX = 1000;
const curvePoints = 100;
const sqCurvePoints = curvePoints ** 2;
const step = 1 / curvePoints;

const initialPoint = [_min([step / 10, 1 / sqCurvePoints]) as number];

const stepArray = initialPoint.concat(_range(step, 1, step));

/**
 *
 * @param chartCriteriaPools
 * @returns the data needed to compute the chart for the emerging bonding curves of the selected criterias
 */
const getEmergingBondingCurvesFromCriterias = async (
  chartCriteriaPools: ChartCriteriaPool[]
): Promise<EmergingCurvePoints[]> => {
  const bondingCurves: EmergingCurvePoints[] = [];
  for (const { pools, symbol } of chartCriteriaPools) {
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
