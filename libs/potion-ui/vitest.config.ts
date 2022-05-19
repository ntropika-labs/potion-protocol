import { defineConfig } from "vitest/config";
import yaml from "@rollup/plugin-yaml";

import vue from "@vitejs/plugin-vue";


// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: ["./vue-test-utils.setup.ts"],
  },
  plugins: [
    vue(),
    yaml(),
  ],
});
