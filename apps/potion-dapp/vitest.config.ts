import path from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vitest/config";

import vue from "@vitejs/plugin-vue";

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
  plugins: [vue({ reactivityTransform: true })],
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
      "@coingecko-composable": fileURLToPath(
        //@ts-expect-error volar giving errors
        new URL("./src/composables/useMockedCoingecko.ts", import.meta.url)
      ),
    },
  },
});
