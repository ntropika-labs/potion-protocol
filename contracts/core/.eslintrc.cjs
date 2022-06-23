/* eslint-env node */
module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    extends: ["plugin:import/typescript", "../../.eslintrc.cjs"],
    rules: {
        "@typescript-eslint/no-unused-vars": "error",
    },
};
