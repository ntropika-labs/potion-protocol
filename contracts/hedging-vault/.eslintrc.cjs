/* eslint-env node */
module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    extends: ["plugin:import/typescript", "../../.eslintrc.cjs"],
    rules: {
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "_",
                varsIgnorePattern: "_",
            },
        ],
    },
};
