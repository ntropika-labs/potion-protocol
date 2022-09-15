import path from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vitest/config";

import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

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
      //@ts-expect-error volar giving errors
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "@web-worker": fileURLToPath(
      //   //@ts-expect-error volar giving errors
      //   new URL("./src/web-worker/test.ts", import.meta.url)
      // ),
      "@onboard-composable": fileURLToPath(
        //@ts-expect-error volar giving errors
        new URL("./src/composables/useMockedOnboard.ts", import.meta.url)
      ),
      "@vault-operator-utils": fileURLToPath(
        //@ts-expect-error volar giving errors
        new URL("./src/helpers/mockedVaultOperatorUtils.ts", import.meta.url)
      ),
      "@premium-swap-router": fileURLToPath(
        //@ts-expect-error volar giving errors
        new URL("./src/helpers/mockedPremiumSwapRouter.ts", import.meta.url)
      ),
      "@coingecko-composable": fileURLToPath(
        //@ts-expect-error volar giving errors
        new URL("./src/composables/useMockedCoingecko.ts", import.meta.url)
      ),
    },
  },
});
