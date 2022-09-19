import { expose } from "comlink";

import { getUniswapRoute, runPremiumSwapRouter } from "@premium-swap-router";

expose({
  getUniswapRoute,
  runPremiumSwapRouter,
});
