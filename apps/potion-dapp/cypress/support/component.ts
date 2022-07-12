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

import { mount } from "cypress/vue";
import { h } from "vue";
import { createI18n } from "vue-i18n";

import { vAutoAnimate } from "@formkit/auto-animate";

//@ts-expect-error shims error
import EmptyLayout from "../../src/layouts/EmptyLayout.vue";

import type { CyMountOptions } from "cypress/vue";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {},
});

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
    options.global.directives = options.global.directives || [];
    options.global.directives = { "auto-animate": vAutoAnimate };
    return mount(() => {
      return h(EmptyLayout, () => h(comp, options.props, []));
    }, options);
  }
);

// Example use:
// cy.mount(MyComponent)
