import { wrap } from "comlink";
import type { PotionRouter } from "./potion-router-functions";

const webWorker = new Worker(
  new URL("./potion-router-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap<PotionRouter>(webWorker);
export { worker };
