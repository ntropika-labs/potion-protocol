import {
  getUniswapRoute,
  runPremiumSwapRouter,
} from "../helpers/premiumSwapRouter";
import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "./worker-functions";

export const worker = {
  getEmergingBondingCurvesFromCriterias,
  runPremiumSwapRouter,
  runDepthRouter,
  getUniswapRoute,
};
