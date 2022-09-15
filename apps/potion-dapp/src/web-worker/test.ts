import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "potion-router";

import { getUniswapRoute, runPremiumSwapRouter } from "@premium-swap-router";

export const worker = {
  getEmergingBondingCurvesFromCriterias,
  runPremiumSwapRouter,
  runDepthRouter,
  getUniswapRoute,
};
