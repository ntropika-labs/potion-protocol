import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  supportFolder: "cypress/support",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log(on, config);
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
