import { expose } from "comlink";
import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "potion-router";

expose({
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
});
