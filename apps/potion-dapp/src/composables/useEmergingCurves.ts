import { getPoolsFromCriterias } from "potion-router";
import { worker } from "@/web-worker";
import { ref } from "vue";

import type { Ref, ComputedRef } from "vue";
import type { EmergingCurvePoints, Criteria } from "dapp-types";

export const useEmergingCurves = (
  criterias: Ref<Criteria[]> | ComputedRef<Criteria[]>
) => {
  const emergingCurves = ref<EmergingCurvePoints[]>([]);

  const loadEmergingCurves = async () => {
    const poolSets = await getPoolsFromCriterias(criterias.value);
    emergingCurves.value = await worker.getEmergingBondingCurvesFromCriterias(
      poolSets
    );
  };

  return {
    emergingCurves,
    loadEmergingCurves,
  };
};
