import { wrap } from "comlink";
import type { PotionWorker } from "./worker-functions";

const webWorker = new Worker(
  new URL("./worker-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap<PotionWorker>(webWorker);
export { worker };
