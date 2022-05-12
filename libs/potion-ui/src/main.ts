/**
 * We add uno.css and tailwind.css so we can use them in dev mode.
 * The library is going to be built with ./src/index.ts as the entry point. This file is going to be used only by vite in dev mode
 */
import "uno.css";
import "@unocss/reset/tailwind.css";

import { createApp } from "vue";

import App from "./App.vue";

createApp(App).mount("#app");
