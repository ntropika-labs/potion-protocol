const worker = new ComlinkWorker<typeof import("./worker-functions")>(
  new URL("./worker-functions", import.meta.url),
  { type: "module" }
);
export { worker };
