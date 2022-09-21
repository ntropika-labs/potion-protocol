import "@unocss/reset/tailwind.css";
import "uno.css";
import "potion-unocss/src/variables.css";
import "./assets/base.css";

import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "./App.vue";
import { router } from "./router";
import { vAutoAnimate } from "@formkit/auto-animate";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});
const app = createApp(App);

app.use(router);
app.use(i18n);

app.directive("auto-animate", vAutoAnimate);

app.mount("#app");
