import { expose } from "comlink";

import { getUniswapRoute, runPremiumSwapRouter } from "@premium-swap-router";

expose({
  getUniswapRoute,
  runPremiumSwapRouter,
});

export interface AlphaRouter {
  getUniswapRoute: typeof getUniswapRoute;
  runPremiumSwapRouter: typeof runPremiumSwapRouter;
}
