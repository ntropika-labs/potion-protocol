/// <reference types="cypress" />
/// <reference types="../support" />

import { resetApproval } from "../support/utilities";

describe("Pool template cloning Flow", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/base", "2021-01-01 09:00:00+00:00");
    });
    it("can reset the approval", async () => {
      await resetApproval();
    });
  });
  context("showPool test", () => {
    it("Can visit the template page", () => {
      cy.viewport(1920, 1080);
      cy.visit(
        "/templates/0x0a34bd0b829d81135128d14a0b65358c8508c2023fb907ba019bf4c4a35dfe920x0d95b2829bc12ab0b1b387503653642784e8a316fda60f2200a8cf98c4f157ee"
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
    it("Can set the approval", () => {
      cy.get(".gap-3 > .whitespace-nowrap").click();
      cy.wait(2000);
      cy.get(":nth-child(2) > .grid > .col-span-3 > .text-sm").contains(
        "approved"
      );
    });
    it("Can clone the pool", () => {
      cy.get("[test-clone-button]").click();
    });
  });
});
