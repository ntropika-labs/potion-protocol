/// <reference types="cypress" />

import MinusPlusInput from "./MinusPlusInput.vue";

describe("MinusPlusInput", () => {
  const mountComponent = (value: number) => {
    const onUpdateSpy = cy.spy().as("onUpdateSpy");
    const props = {
      label: "component test",
      modelValue: value,
      min: 0,
      max: 100,
      step: 1,
      "onUpdate:modelValue": onUpdateSpy,
    };
    cy.mount(MinusPlusInput, { props });
  };

  context("it renders correctly", () => {
    beforeEach(() => {
      mountComponent(0);
    });

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
    it("can write in the input field", () => {
      cy.get("[test-unit='input']").clear().type("11");
      cy.get("@onUpdateSpy").should("have.been.calledWith", 11);
    });
  });

  context("it handles the increase button correctly", () => {
    it("disables the button if value = max", () => {
      mountComponent(100);
      cy.get("[test-unit='increase-button']")
        .should("be.visible")
        .and("be.disabled");
    });
    it("enables the button if value < max", () => {
      mountComponent(77);
      cy.get("[test-unit='increase-button']")
        .should("be.visible")
        .and("not.be.disabled");
    });
    it("increase the value when pressed", () => {
      mountComponent(77);
      cy.get("[test-unit='increase-button']").click();
      cy.get("@onUpdateSpy").should("have.been.calledWith", 78);
    });
  });

  context("it handles the decrease button correctly", () => {
    it("disables the button if value = min", () => {
      mountComponent(0);
      cy.get("[test-unit='decrease-button']")
        .should("be.visible")
        .and("be.disabled");
    });
    it("enables the button if value > min", () => {
      mountComponent(1);
      cy.get("[test-unit='decrease-button']")
        .should("be.visible")
        .and("not.be.disabled");
    });
    it("decrease the value when pressed", () => {
      mountComponent(77);
      cy.get("[test-unit='decrease-button']").click();
      cy.get("@onUpdateSpy").should("have.been.calledWith", 76);
    });
  });
});
