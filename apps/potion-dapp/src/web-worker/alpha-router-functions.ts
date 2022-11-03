import { expose } from "comlink";

import {
  getUniswapRoute,
  getPotionRoute,
  //runPremiumSwapRouter
} from "@premium-swap-router";

expose({
  getUniswapRoute,
  getPotionRoute,
});
