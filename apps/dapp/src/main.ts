import "uno.css";
import "@unocss/reset/tailwind.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "@/App.vue";
import { init } from "@/composables/useOnboard";
import { onboardOptions } from "@/helpers";
import router from "@/router";
import urql from "@urql/vue";

init(onboardOptions);
const app = createApp(App);

app.use(urql, {
  requestPolicy: "network-only",
  url: import.meta.env.VITE_SUBGRAPH_ADDRESS,
});

app.use(createPinia());
app.use(router);

app.mount("#app");
