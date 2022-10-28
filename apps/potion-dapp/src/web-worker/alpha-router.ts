import { wrap } from "comlink";
import { getUniswapRoute, runPremiumSwapRouter } from "@premium-swap-router";
interface AlphaRouter {
  getUniswapRoute: typeof getUniswapRoute;
  runPremiumSwapRouter: typeof runPremiumSwapRouter;
}

const webWorker = new Worker(
  new URL("./alpha-router-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap<AlphaRouter>(webWorker);
export { worker };
