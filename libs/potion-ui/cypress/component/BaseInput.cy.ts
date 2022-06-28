/// <reference types="cypress" />

import { BaseInput } from "../../src/index";

describe("Test BaseInput. component", () => {
  it("is visible", () => {
    cy.mount(BaseInput).get("input").should("be.visible");
  });
});
