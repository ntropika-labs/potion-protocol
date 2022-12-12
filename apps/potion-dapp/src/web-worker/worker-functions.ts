import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "potion-router";

import { expose } from "comlink";

expose({ getEmergingBondingCurvesFromCriterias, runDepthRouter });
