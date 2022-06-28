/// <reference types="cypress" />

import MinusPlusInput from "./MinusPlusInput.vue";

describe("MinusPlusInput", () => {
  beforeEach(() => {
    const props = {
      label: "component test",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    };
    cy.mount(MinusPlusInput, { props });
  });

  context("it renders correctly", () => {
    it("has the label", () => {
      cy.get("[test-unit='label']")
        .should("be.visible")
        .and("contain.text", "component test");
    });
    it("has the input field", () => {
      cy.get("[test-unit='input']")
        .should("be.visible")
        .and("contain.value", 0);
    });
    it("has the plus button", () => {
      cy.get("[test-unit='increase-button']").should("be.visible");
    });
    it("has the minus button", () => {
      cy.get("[test-unit='decrease-button']").should("be.visible");
    });
  });

  context.skip("it handles the increase button correctly", () => {
    it("disables the button if value = max", () => {
      cy.get("[test-unit='input']").clear().type("100");
      cy.get("[test-unit='increase-button']")
        .should("be.visible")
        .and("be.disabled");
    });
    it("enables the button if value < max", () => {
      cy.get("[test-unit='input']").clear().type("77");
      cy.get("[test-unit='increase-button']")
        .should("be.visible")
        .and("not.be.disabled");
    });
    it("increase the value when pressed", () => {
      cy.get("[test-unit='input']").clear().type("77");
      cy.get("[test-unit='increase-button']").click();
      cy.get("[test-unit='input']")
        .should("be.visible")
        .and("contain.value", 78);
    });
  });

  context.skip("it handles the decrease button correctly", () => {
    it("disables the button if value = min", () => {
      cy.get("[test-unit='input']").clear().type("0");
      cy.get("[test-unit='decrease-button']")
        .should("be.visible")
        .and("be.disabled");
    });
    it("enables the button if value > min", () => {
      cy.get("[test-unit='input']").clear().type("1");
      cy.get("[test-unit='decrease-button']")
        .should("be.visible")
        .and("not.be.disabled");
    });
    it("decrease the value when pressed", () => {
      cy.get("[test-unit='input']").clear().type("77");
      cy.get("[test-unit='decrease-button']").click();
      cy.get("[test-unit='input']")
        .should("be.visible")
        .and("contain.value", 76);
    });
  });
});
