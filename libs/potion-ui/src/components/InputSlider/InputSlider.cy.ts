/// <reference types="cypress" />

import InputSplider from "./InputSlider.vue";

describe("InputSplider.cy.ts", () => {
  beforeEach(() => {
    const onUpdateSpy = cy.spy().as("onUpdateSpy");
    const props = {
      min: 1,
      max: 100,
      step: 1,
      modelValue: 50,
      disabled: false,
      symbol: "%",
      "onUpdate:modelValue": onUpdateSpy,
    };
    cy.mount(InputSplider, { props });
  });

  context("renders correctly", () => {
    it("is visible", () => {
      cy.get("[test-slider-wrapper]").should("be.visible");
    });

    it("has a range input", () => {
      cy.get("[test-slider-input]")
        .should("be.visible")
        .and("contain.value", 50);
    });

    it("renders a custom thumb", () => {
      cy.get("[test-slider-thumb]")
        .should("be.visible")
        .and("contain.text", "50%");
    });

    it("renders a custom progressbar", () => {
      cy.get("[test-slider-progress]").should("be.visible");
    });
  });

  context("Handles user inputs correctly", () => {
    it("returns the value", () => {
      cy.get("[test-slider-input]").invoke("val", 88).trigger("input");
      cy.get("@onUpdateSpy").should("have.been.calledWith", 88);
    });

    it("returns max if a value > max has been selected", () => {
      cy.get("[test-slider-input]").invoke("val", 101).trigger("input");
      cy.get("@onUpdateSpy").should("have.been.calledWith", 100);
    });

    it("returns min if a value < min has been selected", () => {
      cy.get("[test-slider-input]").invoke("val", -1).trigger("input");
      cy.get("@onUpdateSpy").should("have.been.calledWith", 1);
    });
  });
});
