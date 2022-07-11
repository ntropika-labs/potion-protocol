/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to seed ganache with a specific database
     * @example cy.seed('/a/database/path')
     * Can also be called specifing a chainTime to start the blockchain at a specific date
     * @example cy.seed('/a/database/path', '2021-01-01 08:00:00+00:00')
     */
    seed(databasePath: string, chainTime?: string): Chainable<Element>;
  }
}
