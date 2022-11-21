/// <reference types="cypress" />

import { CountdownElement } from "potion-ui";

describe("CountdownElement.cy.ts", () => {
  it("is visible", () => {
    cy.mount(CountdownElement);
    cy.get("[test-base-input]").should("be.visible");
  });
  it("disables itself if it is not valid", () => {
    cy.mount(CountdownElement, {
      props: {
        disabled: true,
      },
    });
    cy.get("[test-base-input]").should("be.visible").and("be.disabled");
  });
  it("updates the value when an user type", () => {
    const onUpdateSpy = cy.spy().as("onUpdateSpy");
    cy.mount(CountdownElement, {
      props: {
        "onUpdate:modelValue": onUpdateSpy,
      },
    });
    cy.get("[test-base-input]").clear().type("1001");
    cy.get("@onUpdateSpy").should("have.been.calledWith", 1001);
  });
});
