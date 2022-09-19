import { getPoolsFromCriterias } from "potion-router";
import { worker } from "@web-worker/potion-router";
import { ref, unref } from "vue";

import type { Ref, ComputedRef } from "vue";
import type { EmergingCurvePoints, Criteria } from "dapp-types";

export const useEmergingCurves = (
  criterias: Ref<Criteria[]> | ComputedRef<Criteria[]> | Criteria[]
) => {
  const emergingCurves = ref<EmergingCurvePoints[]>([]);

  const loadEmergingCurves = async () => {
    // this returns us ComputedRef<Criteria[]> | Criteria[] so we need to unref it again
    const unreffedCriterias = unref(criterias);
    const poolSets = await getPoolsFromCriterias(unref(unreffedCriterias));
    emergingCurves.value = await worker.getEmergingBondingCurvesFromCriterias(
      poolSets
    );
  };

  return {
    emergingCurves,
    loadEmergingCurves,
  };
};
