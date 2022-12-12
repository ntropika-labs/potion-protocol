// Global setup file for Vue Test Utils
// Add here plugins like vue-i18n that should be installed on all test environments

import { config } from "@vue/test-utils";
import { createI18n } from "vue-i18n";

import en from "../locales/en.yaml";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: { en },
});

config.global.plugins = [i18n];
