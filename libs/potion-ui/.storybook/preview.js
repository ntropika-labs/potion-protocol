import "@unocss/reset/tailwind.css";
import "uno.css";

import { app } from '@storybook/vue3';
import { createI18n } from "vue-i18n";

import messages from "../../locales/en.yaml";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: messages
  },
});

app.use(i18n);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "potion",
    values: [
      {
        name: "potion",
        value: "linear-gradient( 113.69deg, #231b4b 23.72%, #1a152e 81.45% )",
      },
      {
        name: "light",
        value: "#F8F8F8",
      },
      {
        name: "dark",
        value: "#333333",
      },
    ],
  },
};
