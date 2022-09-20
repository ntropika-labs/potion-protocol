import path from "path";
import Unocss from "unocss/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig, searchForWorkspaceRoot } from "vite";

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
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
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), "../../libs"],
    },
  },
});
