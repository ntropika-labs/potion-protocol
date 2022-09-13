import path from "path";
import gzipPlugin from "rollup-plugin-gzip";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { visualizer } from "rollup-plugin-visualizer";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import comlink from "vite-plugin-comlink";
import { brotliCompressSync } from "zlib";

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";

const MODE = process.env.NODE_ENV;
const development = MODE === "development";
const VITE_MODE = process.env.MODE;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    vueI18n({
      include: path.resolve(__dirname, "../../libs/locales/**"),
    }),
    Unocss(),
    comlink(),
    development &&
      nodePolyfills({
        include: [
          "node_modules/**/*.js",
          new RegExp("node_modules/.vite/.*js"),
        ],
      }),
  ],
  worker: {
    plugins: [comlink()],
  },
  resolve: {
    alias: {
      //@ts-expect-error volar giving errors
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@web-worker": fileURLToPath(
        //@ts-expect-error volar giving errors
        new URL("./src/web-worker", import.meta.url)
      ),
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
      "@coingecko-composable":
        VITE_MODE === "test" || VITE_MODE === "testnet"
          ? fileURLToPath(
              new URL(
                "./src/composables/useMockedCoingecko.ts",
                //@ts-expect-errorvolar  giving errors

                import.meta.url
              )
            )
          : fileURLToPath(
              //@ts-expect-error volar giving errors

              new URL("./src/composables/useCoinGecko.ts", import.meta.url)
            ),

      "@onboard-composable":
        VITE_MODE === "test"
          ? fileURLToPath(
              //@ts-expect-error volar giving errors
              new URL("./src/composables/useMockedOnboard.ts", import.meta.url)
            )
          : fileURLToPath(
              //@ts-expect-error volar giving errors
              new URL("./src/composables/useOnboard.ts", import.meta.url)
            ),
    },
  },
  build: {
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
