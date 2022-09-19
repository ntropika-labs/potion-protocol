import { wrap } from "comlink";

const webWorker = new Worker(
  new URL("./alpha-router-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap(webWorker);
export { worker };
