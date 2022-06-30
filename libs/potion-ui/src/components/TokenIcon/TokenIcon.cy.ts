/// <reference types="cypress" />

import TokenIcon from "./TokenIcon.vue";

describe("TokenIcon.cy.ts", () => {
  it("Is visible and has alt text", () => {
    cy.mount(TokenIcon, {
      props: {
        name: "Hello Vitest",
      },
    });
    cy.get("[test-token-icon]")
      .should("have.attr", "alt")
      .then((alt) => {
        expect(alt).to.be.equal("Hello Vitest");
      });
  });
});
