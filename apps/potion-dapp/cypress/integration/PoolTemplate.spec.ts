/// <reference types="cypress" />

describe("Pool template cloning Flow", () => {
  it("Can visit the edit page", () => {
    cy.viewport(1920, 1080);
    cy.visit(
      "/templates/0x7ecf82181db81c934125618d2b066c1eedc0dcefc4bc45de27f4af3efa7e6b030xa816700e14212b1fbeb4d2c0571015b641324047082c5f4174a3259215d19a20"
    );
  });

  it("Show an error if the liquidity is not valid", () => {
    cy.get(".selection\\:bg-accent-500").clear();
    cy.get(".py-3 > .flex-col > .p-4").should(
      "contain",
      "Please, enter a valid value"
    );
    cy.get(".selection\\:bg-accent-500").clear().type("0");
    cy.get(".py-3 > .flex-col > .p-4").should(
      "contain",
      "Please, enter a valid value"
    );
    cy.get(".selection\\:bg-accent-500").clear().type("1.1234567");
    cy.get(".py-3 > .flex-col > .p-4").should(
      "contain",
      "The max number of decimals is 6"
    );
  });
  it("Can input the liquidity", () => {
    cy.get(".selection\\:bg-accent-500").clear().type("100.123456");
  });

  it("Can clone the pool", () => {
    cy.get("[test-clone-button]").click();
  });
});
