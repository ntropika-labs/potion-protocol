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
/// <reference types="cypress" />
/// <reference types="../support" />

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

          cy.exec(`cd ../../ && ./bin/setup-local-env ${version}`, {
            env: { DATABASE_PATH: testSeedPath, CHAIN_TIME: chainTime },
            failOnNonZeroExit: false,
            timeout: 180000,
          }).then((result) => {
            expect(result.code).to.eq(0);
            cy.wait(5000);
          });
        }
      });
  }
);

Cypress.Commands.add(
  "approveAndPurchase",
  (
    _amount,
    purchaseButtonAlias,
    purchaseLabel = "buy",
    doApproval = true,
    approveLabel = "approve usdc"
  ) => {
    // Wait for the button to update if any previous action is still completing
    cy.get(purchaseButtonAlias).should("not.contain.text", "loading");

    if (doApproval) {
      cy.get(purchaseButtonAlias)
        .invoke("text")
        .then((buttonText) => {
          const lowercaseButtonText = (buttonText || "").toLowerCase();
          if (!purchaseLabel.match(lowercaseButtonText)) {
            cy.get(purchaseButtonAlias).contains(approveLabel, {
              matchCase: false,
              timeout: 10000,
            });
            // APPROVE
            // {force: true} prevents the test from failing if a notification is displayed in front of the button
            cy.get(purchaseButtonAlias).trigger("click", { force: true });

            // TOAST NOTIFICATION
            cy.get("#toast-wrap > :nth-child(2) > .grid", { timeout: 10000 });

            cy.get(purchaseButtonAlias).should("not.be.disabled", {
              timeout: 20000,
            });
          }
        });
    }

    cy.get(purchaseButtonAlias)
      .should("not.be.disabled")
      .contains(purchaseLabel, { matchCase: false, timeout: 20000 });
    // PURCHASE
    // {force: true} prevents the test from failing if a notification is displayed in front of the button
    cy.get(purchaseButtonAlias).trigger("click", { force: true });

    // TOAST NOTIFICATION
    cy.get("#toast-wrap > :nth-child(2) > .grid", { timeout: 10000 });

    cy.get(purchaseButtonAlias)
      .should("not.be.disabled")
      .contains(purchaseLabel, { matchCase: false, timeout: 20000 });
  }
);
