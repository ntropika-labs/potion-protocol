import path from "path";
import Unocss from "unocss/vite";
import { defineConfig, searchForWorkspaceRoot } from "vite";

import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    Unocss({
      // dist-chunk will split the css into multiple files. It makes the build --watch mode work. Needs some investigation
      mode: "dist-chunk",
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "UI",
      fileName: (format) => `ui.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      /**
       * Storybook (specifically the interactions addon) requires that we use their
       *   instrumented version of jest-expect. So our storybook does so. To make
       *   these interactions still work in vitest we have @storybook/jest aliased
       *   to resolve to vitest which, critically, exports { expect } as well.
       */
      "@storybook/jest": "vitest",
    },
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), "../../libs"],
    },
  },
});
