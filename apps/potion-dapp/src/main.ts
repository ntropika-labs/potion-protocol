import "uno.css";
import "@unocss/reset/tailwind.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

import App from "@/App.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";

import { init } from "@/composables/useOnboard";
import { onboardOptions } from "@/helpers/onboard";
import router from "@/router";
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
app.component("BaseLayout", BaseLayout);
app.component("EmptyLayout", EmptyLayout);

app.mount("#app");
