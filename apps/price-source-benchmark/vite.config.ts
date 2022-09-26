import path, { join } from "path";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig, searchForWorkspaceRoot } from "vite";

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";

const VITE_RUNTIME = process.env.VITE_RUNTIME;
const electron = VITE_RUNTIME === "electron";

// https://vitejs.dev/config/
export default defineConfig({
  base: electron ? "" : undefined, // empty path is equal to relative, otherwise set it to undefined to keep the default
  root: electron ? __dirname : undefined, // dirname when electron, otherwise set it to undefined to keep the default
  plugins: [
    vue({ reactivityTransform: true }),
    vueI18n({
      include: path.resolve(__dirname, "../../libs/locales/**"),
    }),
    Unocss(),
  ],
  resolve: {
    alias: {
      //@ts-expect-error volar giving errors
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: electron
      ? path.resolve(__dirname, "../electron-wrapper/render/dist")
      : undefined, // path to electron-wrapper project when using electron, otherwise set it to undefined to keep the default
    emptyOutDir: electron ? true : undefined, // empty dist folder when using electron, otherwise set it to undefined to keep the default
    assetsDir: electron ? "." : undefined, // relative path when electron, otherwise set i t to undefined to keep the default
    rollupOptions: {
      input: electron ? join(__dirname, "index.html") : undefined,
    },
  },
  server: {
    fs: {
      strict: electron ? true : undefined,
      allow: electron
        ? undefined
        : [searchForWorkspaceRoot(process.cwd()), "../../libs"],
    },
  },
});
