/// <reference types="cypress" />
/// <reference types="../support" />

// import localDeploymentAddresses from "../../../../contracts/core/deployments/localhost.json";
import { resetApproval } from "../support/utilities";

describe("Custom Pool Creation Flow", () => {
  context("environment setup", () => {
    it("reloads the blockchain with the correct database and date", () => {
      cy.seed("/opt/base", "2021-01-01 09:00:00+00:00", false);
    });
    it("can reset the approval", async () => {
      await resetApproval();
    });
  });
  context("customPoolCreation test", () => {
    let assetText = "";

    it("Can visit custom-pool-creation", () => {
      cy.viewport(1920, 1080);
      cy.visit("/custom-pool-creation");
    });

    it("Show an error if the liquidity is not valid", () => {
      cy.get("[test-base-input]").clear();
      cy.get(".py-3 > .flex-col > .p-4").should(
        "contain",
        "Please, enter a valid value"
      );
      cy.get("[test-base-input]").clear().type("0");
      cy.get(".py-3 > .flex-col > .p-4").should(
        "contain",
        "Please, enter a valid value"
      );
      cy.get("[test-base-input]").clear().type("1.1234567");
      cy.get(".py-3 > .flex-col > .p-4").should(
        "contain",
        "The max number of decimals is 6"
      );
    });
    it("Can input the liquidity", () => {
      cy.get("[test-base-input]").clear().type("100.123456");
    });
    it("Can select a token and show its strike and duration component", () => {
      cy.get("[test-token-card]").each(($el, index) => {
        cy.wrap($el)
          .click()
          .invoke("text")
          .then((text) => {
            if (index === 0) {
              assetText = text;
            }
            cy.get("[test-wrapper-card").should("contain", text);
          });
      });
    });
    it("Can deselect tokens", () => {
      cy.get("[test-token-card]").each(($el, index) => {
        if (index > 0) {
          cy.wrap($el).click();
        }
      });
      cy.get("[test-wrapper-card]").should("have.length", 1);
    });
    it("Can set the strike", () => {
      cy.get("[test-wrapper-strike]>[test-slider-input]")
        .as("range")
        .invoke("val", 120)
        .trigger("input")
        .should("have.value", 120);
    });
    it("Can set the duration", () => {
      cy.get("[test-wrapper-duration]>[test-slider-input]")
        .as("range")
        .invoke("val", 200)
        .trigger("input")
        .should("have.value", 200);
    });
    it("Can move to Curve Setup when the data is valid", () => {
      cy.get("[test-next]").click();
    });
    it("Shows the right data in the recap", () => {
      cy.get(".ring-white\\/10 > .flex-col > .grid > .flex").contains(
        assetText
      );
      cy.get(".ring-white\\/10 > .flex-col > .grid > :nth-child(2)").contains(
        "120%"
      );
      cy.get(".ring-white\\/10 > .flex-col > .grid > :nth-child(3)").contains(
        "200 days"
      );
    });
    it("Can set the curve", () => {
      cy.get(".h-full > .bg-radial-glass > :nth-child(1) > .w-full")
        .clear()
        .type("1");
      cy.get(":nth-child(2) > .w-full").clear().type("1");
      cy.get(":nth-child(3) > .w-full").clear().type("1");
      cy.get(":nth-child(4) > .w-full").clear().type("1");
    });
    it("Can move to Custom Pool Creation if all the values are correct", () => {
      cy.get(".p-4 > .before\\:content-none").click();
    });
    it("Shows the right data in the recap", () => {
      cy.get(".ring-white\\/10 > .flex-col > .grid > .flex").contains(
        assetText
      );
      cy.get(".ring-white\\/10 > .flex-col > .grid > :nth-child(2)").contains(
        "120%"
      );
      cy.get(".ring-white\\/10 > .flex-col > .grid > :nth-child(3)").contains(
        "200 days"
      );
      cy.get(".h-full > .flex-col > :nth-child(1) > .w-full").should(
        "have.value",
        "1"
      );
      cy.get(":nth-child(2) > .w-full").should("have.value", "1");
      cy.get(":nth-child(3) > .w-full").should("have.value", "1");
      cy.get(":nth-child(4) > .w-full").should("have.value", "1");
      cy.get(":nth-child(5) > .w-full").should("have.value", "1");
    });
    it("Can set the approval", () => {
      cy.get(".p-4 > .before\\:content-none").click();
      cy.wait(2000);
      cy.get(":nth-child(2) > .grid > .col-span-3 > .text-sm").contains(
        "approved"
      );
    });
    it("Can create the pool", () => {
      cy.get(".p-4 > .before\\:content-none").click();

      cy.get(":nth-child(4) > .grid > .col-span-3 > .text-sm");
    });
  });
});
