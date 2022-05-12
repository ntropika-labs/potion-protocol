module.exports = {
  parser: "vue-eslint-parser",
  extends: ["plugin:vue/vue3-recommended", "../../.eslintrc.cjs"],
  env: {
    "vue/setup-compiler-macros": true,
  },
};
