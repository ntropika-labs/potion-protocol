import path from "path";
import gzipPlugin from "rollup-plugin-gzip";
import { brotliCompressSync } from "zlib";
import nodePolyfills from "rollup-plugin-polyfill-node";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import comlink from "vite-plugin-comlink";

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";

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
      "@vault-operator-utils":
        VITE_MODE === "test" || development
          ? fileURLToPath(
              //@ts-expect-error volar giving errors
              new URL(
                "./src/helpers/mockedVaultOperatorUtils.ts",
                import.meta.url
              )
            )
          : fileURLToPath(
              //@ts-expect-error volar giving errors
              new URL("./src/helpers/vaultOperatorUtils.ts", import.meta.url)
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
