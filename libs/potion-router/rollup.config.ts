import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";

const input = "src/index.ts";

export default [
  {
    input,
    output: [
      { file: "dist/index.mjs", format: "es" },
      { file: "dist/index.cjs", format: "cjs" },
      {
        file: "dist/index.iife.js",
        format: "iife",
        name: "potion-router",
        extend: true,
      },
    ],
    plugins: [esbuild(), json()],
  },
  {
    input,
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
