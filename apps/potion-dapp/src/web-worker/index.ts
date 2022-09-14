import { wrap } from "comlink";
const webWorker = new Worker(
  new URL("./worker-functions.ts", import.meta.url),
  {
    type: "module",
  }
);
const worker = wrap(webWorker);
export { worker };
