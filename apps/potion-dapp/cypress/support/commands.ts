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
/// <reference path="./index.d.ts" />

import "@testing-library/cypress/add-commands";

Cypress.Commands.add(
  "seed",
  (databasePath, chainTime, startFresh = true, persistData = false) => {
    const testSeedPath = persistData
      ? databasePath
      : databasePath.replace("/opt", "/opt/tests");
    let currentDbPath = "";
    let isDabataseInUse = false;

    cy.exec(
      "docker inspect -f '{{range .Config.Cmd}}{{printf \"%s\\n\" .}}{{end}}'  potion_ganache  | sed -e 's/^--database\\.dbPath=\\(.*\\)$/\\1/;t;d'"
    )
      .then((result) => {
        currentDbPath = result.stdout;
        isDabataseInUse = currentDbPath === testSeedPath;
        expect(result.code).to.eq(0);
      })
      .then(() => {
        console.log(
          "is db in use",
          isDabataseInUse,
          currentDbPath,
          testSeedPath
        );

        if (startFresh || !isDabataseInUse) {
          if (!persistData) {
            cy.exec(`docker compose exec -T ganache rm -rf ${testSeedPath}`)
              .its("code")
              .should("eq", 0);
            cy.exec(
              `docker compose exec -T ganache cp -R ${databasePath} ${testSeedPath}`
            )
              .its("code")
              .should("eq", 0);
          }

          const version = isDabataseInUse
            ? (Math.random() + 1).toString(36).substring(7)
            : "0.0.1";

          cy.exec(`cd ../../ && ./bin/start-local-env ${version}`, {
            env: { DATABASE_PATH: testSeedPath, CHAIN_TIME: chainTime },
            failOnNonZeroExit: false,
            timeout: 180000,
          }).then((result) => {
            expect(result.code).to.eq(0);
            expect(result.stdout).to.contain("stack is ready");
          });
        }
      });
  }
);
