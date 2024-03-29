import "@unocss/reset/tailwind.css";
import "uno.css";
import "potion-unocss/src/variables.css";
import "./assets/base.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "@/App.vue";
import { onboardOptions } from "@/helpers/onboard";
import router from "@/router";
import { vAutoAnimate } from "@formkit/auto-animate";
import messages from "@intlify/vite-plugin-vue-i18n/messages";
import { init } from "@onboard-composable";
import urql from "@urql/vue";

init(onboardOptions);

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});
const app = createApp(App);

app.use(urql, {
  requestPolicy: "network-only",
  url: import.meta.env.VITE_SUBGRAPH_ADDRESS,
});

app.use(createPinia());
app.use(router);
app.use(i18n);

app.directive("auto-animate", vAutoAnimate);

app.mount("#app");
