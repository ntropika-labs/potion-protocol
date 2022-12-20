#!/usr/bin/env node

import { build } from "vite";
import electronPath from "electron";
import { spawn } from "child_process";

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || "development");

/** @type {import('vite').LogLevel} */
const logLevel = "warn";

/**
 * Setup watcher for `main` package
 * On file changed it totally re-launch electron app.
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 * Needs to set up `VITE_DEV_SERVER_URL` environment variable from {@link import('vite').ViteDevServer.resolvedUrls}
 */
function setupMainPackageWatcher() {
  /** @type {ChildProcess | null} */
  let electronApp = null;

  return build({
    mode,
    logLevel,
    configFile: "main/vite.config.js",
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: "reload-app-on-main-package-change",
        writeBundle() {
          /** Kill electron if process already exist */
          if (electronApp !== null) {
            electronApp.removeListener("exit", process.exit);
            electronApp.kill("SIGINT");
            electronApp = null;
          }

          /** Spawn new electron process */
          electronApp = spawn(String(electronPath), ["."], {
            stdio: "inherit",
          });

          /** Stops the watch script when the application has been quit */
          electronApp.addListener("exit", process.exit);
        },
      },
    ],
  });
}

/**
 * Setup watcher for `preload` package
 */
function setupPreloadPackageWatcher() {
  return build({
    mode,
    logLevel,
    configFile: "preload/vite.config.js",
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
  });
}

/**
 * Dev server for Renderer package
 * This must be the first,
 * because the {@link setupMainPackageWatcher} and {@link setupPreloadPackageWatcher}
 * depend on the dev server properties
 */

await setupPreloadPackageWatcher();
await setupMainPackageWatcher();
