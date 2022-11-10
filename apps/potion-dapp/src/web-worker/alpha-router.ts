import { wrap } from "comlink";
import type { AlphaRouter } from "./alpha-router-functions";

const webWorker = new Worker(
  new URL("./alpha-router-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap<AlphaRouter>(webWorker);
export { worker };
