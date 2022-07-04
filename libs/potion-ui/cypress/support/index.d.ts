/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
