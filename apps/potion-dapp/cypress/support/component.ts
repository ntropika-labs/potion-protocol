/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "@unocss/reset/tailwind.css";
import "potion-unocss/src/variables.css";
import "../../src/assets/base.css";
import "uno.css";

// Alternatively you can use CommonJS syntax:
// require('./commands')
import { mount } from "cypress/vue";
import { createI18n } from "vue-i18n";

//@ts-expect-error shims error
import messages from "@intlify/vite-plugin-vue-i18n/messages";

import type { CyMountOptions } from "cypress/vue";
// import { config } from "@vue/test-utils";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});
// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add(
  "mount",
  <C extends Parameters<typeof mount>[0]>(
    comp: C,
    options: CyMountOptions<C> = {}
  ) => {
    options.global = options.global || {};
    options.global.stubs = options.global.stubs || {};
    options.global.stubs.transition = false;
    options.global.plugins = options.global.plugins || [];
    options.global.plugins.push(i18n);

    return mount(comp, options);
    // return mount(() => {
    //   return h(comp, options.props, []);
    // }, options);
  }
);

// Example use:
// cy.mount(MyComponent)
