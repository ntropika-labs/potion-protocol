// Global setup file for Vue Test Utils
// Add here plugins like vue-i18n that should be installed on all test environments

import { config } from "@vue/test-utils";
import { createI18n } from "vue-i18n";

import messages from "../locales/en.yaml";

const i18n = createI18n({
  locale: "en",
  messages: { en: messages }
});

config.global.plugins = [i18n];

