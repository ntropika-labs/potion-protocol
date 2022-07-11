import { defineConfig } from "cypress";
import cypressFailFast from "cypress-fail-fast/plugin";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    FAIL_FAST_STRATEGY: "spec",
    FAIL_FAST_ENABLED: true,
    FAIL_FAST_BAIL: 2,
  },

  component: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      cypressFailFast(on, config);

      console.log(on, config);

      return config;
    },
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
