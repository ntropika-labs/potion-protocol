require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
};
