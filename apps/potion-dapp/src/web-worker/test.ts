import {
  getUniswapRoute,
  runPremiumSwapRouter,
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "./worker-functions";

export const worker = {
  getEmergingBondingCurvesFromCriterias,
  runPremiumSwapRouter,
  runDepthRouter,
  getUniswapRoute,
};
