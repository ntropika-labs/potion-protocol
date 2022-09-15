import { expose } from "comlink";
import {
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
} from "potion-router";

import { getUniswapRoute, runPremiumSwapRouter } from "@premium-swap-router";

expose({
  getEmergingBondingCurvesFromCriterias,
  runDepthRouter,
  getUniswapRoute,
  runPremiumSwapRouter,
});
