import "@unocss/reset/tailwind.css";
import "uno.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "@/App.vue";
import { init } from "@/composables/useOnboard";
import { onboardOptions } from "@/helpers/onboard";
import router from "@/router";
import messages from "@intlify/vite-plugin-vue-i18n/messages";
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

app.mount("#app");
