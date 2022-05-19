import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

const MODE = process.env.NODE_ENV;
const development = MODE === "development";
console.log(development);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    vueI18n({
      include: path.resolve(__dirname, "../../libs/locales/**"),
    }),
    vueJsx(),
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
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
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
