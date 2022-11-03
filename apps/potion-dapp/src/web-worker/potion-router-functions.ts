import { expose } from "comlink";
import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "potion-router";

expose({
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
});

export interface PotionRouter {
  getEmergingBondingCurvesFromCriterias: typeof getEmergingBondingCurvesFromCriterias;
  runDepthRouter: typeof runDepthRouter;
}
