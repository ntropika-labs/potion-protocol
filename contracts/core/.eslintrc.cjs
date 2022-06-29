/* eslint-env node */
module.exports = {
    parser: "@typescript-eslint/parser",
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
