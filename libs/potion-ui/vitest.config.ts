import { defineConfig } from "vitest/config";

import yaml from "@rollup/plugin-yaml";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: ["./vue-test-utils.setup.ts"],
    deps: {
      inline: ["lightweight-charts"],
    },
  },
  plugins: [vue(), yaml()],
});
