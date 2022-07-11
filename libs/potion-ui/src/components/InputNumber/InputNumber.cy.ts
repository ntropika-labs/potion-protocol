/// <reference types="cypress" />

import { InputNumber } from "potion-ui";

describe("InputNumber.cy.ts", () => {
  const mountComponent = (value: number) => {
    const onUpdateSpy = cy.spy().as("onUpdateSpy");
    const onValidInputSpy = cy.spy().as("onValidInputSpy");

    const props = {
      label: "component test",
      modelValue: value,
      min: 0,
      max: 100,
      step: 1,
      onValidInput: onValidInputSpy,
      "onUpdate:modelValue": onUpdateSpy,
    };
    cy.mount(InputNumber, { props });
  };
  it("Is visible", () => {
    mountComponent(1);
    cy.get("[test-input-number]").should("be.visible");
  });
  it("Disables itself if it is not valid", () => {
    cy.mount(InputNumber, {
      props: {
        disabled: true,
      },
    });
    cy.get(".flex > .text-dwhite-300").should("be.visible").and("be.disabled");
  });
  it("Updates the value when an user type", () => {
    mountComponent(1);

    cy.get(".flex > .text-dwhite-300").clear().type("1001");
    cy.get("@onUpdateSpy").should("have.been.calledWith", 1001);
  });
  it("Emits the event validInput with true as a payload when input is valid", () => {
    mountComponent(10);

    cy.get("@onValidInputSpy").should("have.been.calledWith", true);
  });
  it("Emits the event validInput with false as a payload when input is not valid", () => {
    mountComponent(101);

    cy.get("@onValidInputSpy").should("have.been.calledWith", false);
  });
  it("Renders the right footer text when input is correct", () => {
    mountComponent(1);
    cy.get(".font-semibold > .capitalize").contains("Balance: USDC 100.0");
  });
  it("Renders the right footer text when input is incorrect", () => {
    mountComponent(101);
    cy.get(".font-semibold > .capitalize").contains(
      "Please, enter a valid value - Your Balance is USDC 100.0 - Minimum is USDC 0.0."
    );
  });
  it("Emits an event when clicking the MAX button, passing the max value", () => {
    mountComponent(1);
    cy.get("button > .max-w-full").click();
    cy.get("@onUpdateSpy").should("have.been.calledWith", 100);
  });
  it("Shows the correct state when the input is valid", () => {
    mountComponent(1);
    cy.get("[test-input-number]")
      .click()
      .should(
        "have.class",
        "focus-within:ring-primary-500 last-children:focus-within:bg-primary-500"
      );
  });
  it("Shows the correct state when the input is not valid", () => {
    mountComponent(101);
    cy.get("[test-input-number]")
      .click()
      .should("have.class", "!ring-error last-children:bg-error");
  });
});
