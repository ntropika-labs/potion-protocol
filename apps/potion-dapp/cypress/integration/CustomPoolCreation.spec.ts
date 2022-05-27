/// <reference types="cypress" />

describe("Custom Pool Creation Flow", () => {
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
    // cy.get("[test=token-card]").click();
    cy.get("[test-token-card]").each(($el) => {
      cy.wrap($el)
        .click()
        .invoke("text")
        .then((text) => {
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
  it("Can create the pool", () => {
    cy.get(".p-4 > .before\\:content-none").click();
  });
});
