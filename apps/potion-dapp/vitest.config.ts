import path from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vitest/config";

import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

const getFsPath = (path: string) =>
  //@ts-expect-error import without module in package.json
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  test: {
    reporters: ["default", "junit"],
    outputFile: {
      junit: "reports/report.xml",
    },
    coverage: {
      reporter: ["text", "text-summary", "json", "json-summary", "html"],
    },
  },
  plugins: [
    vue({ reactivityTransform: true }),
    vueI18n({
      include: path.resolve(__dirname, "../../libs/locales/testing.yaml"),
    }),
  ],
  resolve: {
    alias: {
      "lightweight-charts": path.resolve(
        "../../node_modules/lightweight-charts/dist/lightweight-charts.esm.production.js"
      ),
      "@": getFsPath("./src"),
      "@web-worker/alpha-router": getFsPath(
        "./src/web-worker/__tests__/alpha-router.ts"
      ),
      "@web-worker/potion-router": getFsPath(
        "./src/web-worker/__tests__/potion-router.ts"
      ),
      "@onboard-composable": getFsPath("./src/composables/useMockedOnboard.ts"),
      "@vault-operator-utils": getFsPath(
        "./src/helpers/mockedVaultOperatorUtils.ts"
      ),
      "@premium-swap-router": getFsPath(
        "./src/helpers/mockedPremiumSwapRouter.ts"
      ),
      "@coingecko-composable": getFsPath(
        "./src/composables/useMockedCoingecko.ts"
      ),
    },
  },
});
