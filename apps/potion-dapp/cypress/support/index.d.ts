/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to seed ganache with a specific database
     *
     * @param databasePath path to a directory on your local filesystem
     * @param chainTime Formatted string representing the date to start the blockchain with
     * @param startFresh When true (default) always start with a fresh copy of the db
     * @param persistData When true will not copy the database to the testing directory. Allows for persisting data generated from tests to your default db
     * @example cy.seed('/a/database/path')
     * Can also be called specifing a chainTime to start the blockchain at a specific date
     * @example cy.seed('/a/database/path', '2021-01-01 08:00:00+00:00')
     */
    seed(
      databasePath: string,
      chainTime?: string,
      startFresh = true,
      persistData = false
    ): Chainable<Element>;

    approveAndPurchase(
      amount: number,
      purchaseButtonAlias: string,
      purchaseLabel: string,
      doApproval?: boolean,
      approveLabel?: string
    ): Chainable<Element>;
  }
}
