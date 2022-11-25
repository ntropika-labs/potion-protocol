import path from "path";
import gzipPlugin from "rollup-plugin-gzip";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { visualizer } from "rollup-plugin-visualizer";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { brotliCompressSync } from "zlib";

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";

const NODE_ENV = process.env.NODE_ENV;
const development = NODE_ENV === "development";
const VITE_MODE = process.env.MODE;

const getFsPath = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));
const getLibraryPath = (
  libPath: string,
  mockedPath: string,
  isTestMode = VITE_MODE === "test"
) => getFsPath(isTestMode ? mockedPath : libPath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    vueI18n({
      include: path.resolve(__dirname, "../../libs/locales/**"),
    }),
    Unocss(),
    development &&
      nodePolyfills({
        include: [
          "node_modules/**/*.js",
          new RegExp("node_modules/.vite/.*js"),
        ],
      }),
  ],
  resolve: {
    alias: {
      "@": getFsPath("./src"),
      "@web-worker/alpha-router": getFsPath("./src/web-worker/alpha-router.ts"),
      "@web-worker/potion-router": getFsPath(
        "./src/web-worker/potion-router.ts"
      ),
      "@coingecko-composable": getLibraryPath(
        "./src/composables/useCoinGecko.ts",
        "./src/composables/useMockedCoingecko.ts",
        VITE_MODE === "test" || VITE_MODE === "testnet" || development
      ),
      "@onboard-composable": getLibraryPath(
        "./src/composables/useOnboard.ts",
        "./src/composables/useMockedOnboard.ts"
      ),
      "@vault-operator-utils": getLibraryPath(
        "./src/helpers/vaultOperatorUtils.ts",
        "./src/helpers/mockedVaultOperatorUtils.ts",
        VITE_MODE === "test" || VITE_MODE === "testnet" || development
      ),
      "@premium-swap-router": getLibraryPath(
        "./src/helpers/premiumSwapRouter.ts",
        "./src/helpers/mockedPremiumSwapRouter.ts"
      ),
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
    },
  },
  worker: {
    // format: 'es',
    rollupOptions: {
      inlineDynamicImports: true,
    },
  },
  build: {
    minify: VITE_MODE !== "debug",
    sourcemap: VITE_MODE === "debug",
    rollupOptions: {
      plugins: [
        nodePolyfills(),
        // GZIP compression as .gz files
        VITE_MODE === "production" && gzipPlugin(),
        // Brotil compression as .br files
        VITE_MODE === "production" &&
          gzipPlugin({
            customCompression: (c) => brotliCompressSync(Buffer.from(c)),
            fileName: ".br",
          }),
        VITE_MODE === "debug" &&
          visualizer({
            filename: "dist/report.html",
            gzipSize: true,
            brotliSize: true,
          }),
      ],
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("ethers")) {
              return "ethers";
            }
            if (id.includes("lodash")) {
              return "lodash";
            }
            if (id.includes("lightweight-charts")) {
              return "lightweight-charts";
            }
            if (id.includes("billboard")) {
              return "billboard";
            }
          }
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), "../../libs"],
    },
  },
});
