import { wrap } from "comlink";
import type { MixedRouter } from "./worker-functions";

const webWorker = new Worker(
  new URL("./worker-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap<MixedRouter>(webWorker);
export { worker };
