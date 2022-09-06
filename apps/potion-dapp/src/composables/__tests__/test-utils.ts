import { createApp, ref } from "vue";
import { never, fromValue } from "wonka";
import urql from "@urql/vue";
import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const i18n = createI18n({
  legacy: false,
  locale: "testing",
  messages,
});

/* eslint-disable vue/one-component-per-file, @typescript-eslint/no-empty-function, @typescript-eslint/ban-types */

// taken from https://vuejs.org/guide/scaling-up/testing.html#testing-composables
export function withSetup(composable: Function) {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      return () => {};
    },
  });
  app.use(i18n);
  app.mount(document.createElement("div"));
  // return the result and the app instance
  // for testing provide / unmount
  return [result, app];
}

// mocks urql with a specific query result
export function withSetupUrql(composable: Function, queryResultData = {}) {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      return () => {};
    },
  });
  const client = ref({
    url: "mocked",
    executeQuery: () =>
      fromValue({
        data: queryResultData,
      }),
  });
  app.use(urql, client);
  app.mount(document.createElement("div"));
  // return the result and the app instance
  // for testing provide / unmount
  return [result, app];
}

// mocks urql with a stuck query
export function withSetupUrqlNever(composable: Function) {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      return () => {};
    },
  });
  const client = ref({
    url: "mocked",
    executeQuery: () => never,
  });
  app.use(urql, client);
  app.mount(document.createElement("div"));
  // return the result and the app instance
  // for testing provide / unmount
  return [result, app];
}
/* eslint-enable */
