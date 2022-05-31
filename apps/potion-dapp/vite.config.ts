import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import comlink from "vite-plugin-comlink";

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
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
