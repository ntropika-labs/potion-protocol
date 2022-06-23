// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

import "@testing-library/cypress/add-commands";

Cypress.Commands.add("seed", (databasePath) => {
  cy.exec("cd ../../ && bin/start-local-env-headless", {
    env: { DATABASE_PATH: databasePath },
    failOnNonZeroExit: false,
    timeout: 180000,
  }).then((result) => {
    expect(result.code).to.eq(0);
    expect(result.stdout).to.contain("stack is ready");
  });
});
