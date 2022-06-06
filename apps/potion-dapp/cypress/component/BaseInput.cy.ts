/// <reference types="cypress" />

import { BaseInput } from "potion-ui";

describe("BaseInput.cy.ts", () => {
  it("is visible", () => {
    cy.mount(BaseInput).get("input").should("be.visible");
  });
});
