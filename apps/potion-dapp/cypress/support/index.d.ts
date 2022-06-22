/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to seed ganache with a specific database
     * @example cy.seed('/a/database/path')
     */
    seed(databasePath: string): Chainable<Element>;
  }
}
