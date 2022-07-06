import { mount } from "cypress/vue";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;

      /**
       * Custom command to seed ganache with a specific database
       * @example cy.seed('/a/database/path')
       * Can also be called specifing a chainTime to start the blockchain at a specific date
       * @example cy.seed('/a/database/path', '2021-01-01 08:00:00+00:00')
       */
      seed(databasePath: string, chainTime?: string): Chainable<Element>;
    }
  }
}
