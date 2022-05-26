/// <reference types="cypress" />

describe("Custom Pool Creation Flow", () => {
  it("Can visit custom-pool-creation", () => {
    cy.viewport(1280, 720);
    cy.visit("http://localhost:5050/custom-pool-creation");
  });
});
