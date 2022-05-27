/// <reference types="cypress" />

describe("Custom Pool Creation Flow", () => {
  it("Can visit custom-pool-creation", () => {
    cy.viewport(1920, 1080);
    cy.visit("/custom-pool-creation");
  });
  it("Can input the liquidity", () => {
    cy.get("[test-base-input]").clear().type("100.123456");
  });
  it("Can select a token", () => {
    cy.get("[test=token-card-0]").click();
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
