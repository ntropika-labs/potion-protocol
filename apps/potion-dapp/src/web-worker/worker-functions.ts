import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "potion-router";

import { expose } from "comlink";

export interface PotionWorker {
  runDepthRouter: typeof runDepthRouter;
  getEmergingBondingCurvesFromCriterias: typeof getEmergingBondingCurvesFromCriterias;
}

expose({ getEmergingBondingCurvesFromCriterias, runDepthRouter });
