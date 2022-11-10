import { expose } from "comlink";

import { getUniswapRoute, getPotionRoute } from "@premium-swap-router";

expose({
  getUniswapRoute,
  getPotionRoute,
});

export interface AlphaRouter {
  getUniswapRoute: typeof getUniswapRoute;
  getPotionRoute: typeof getPotionRoute;
}
