const { resolve } = require("path");
const Unocss = require("unocss/vite").default;

module.exports = {
  stories: [
    "../stories/**/*.stories.@(ts|mdx)",
    "../**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "storybook-dark-mode",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-vite",
  },
  typescript: {
    check: false,
    checkOptions: {},
  },
  async viteFinal(config) {
    config.resolve.alias["~"] = `${resolve(__dirname, "src")}/`;
    config.resolve.modules = [
      resolve(__dirname, "@", "../src"),
      "node_modules",
    ];
    config.plugins = config.plugins ?? [];
    config.plugins.push(Unocss());

    return config;
  },
};
