/// <reference types="cypress" />

import { BaseInput } from "potion-ui";

describe("BaseInput.cy.ts", () => {
  it("is visible", () => {
    cy.mount(BaseInput);
    cy.get("[test-base-input]").should("be.visible");
  });
  it("disables itself if it is not valid", () => {
    cy.mount(BaseInput, {
      props: {
        disabled: true,
      },
    });
    cy.get("[test-base-input]").should("be.visible").and("be.disabled");
  });
  it("updates the value when an user type", () => {
    const onUpdateSpy = cy.spy().as("onUpdateSpy");
    cy.mount(BaseInput, {
      props: {
        "onUpdate:modelValue": onUpdateSpy,
      },
    });
    cy.get("[test-base-input]").clear().type("1001");
    cy.get("@onUpdateSpy").should("have.been.calledWith", 1001);
  });
});
