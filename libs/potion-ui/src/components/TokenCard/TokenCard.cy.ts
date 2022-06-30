/// <reference types="cypress" />

import TokenCard from "./TokenCard.vue";

describe("TokenCard", () => {
  const props = {
    name: "Hello Vitest",
    address: "0xMOCKED",
    symbol: "MOCKED",
    image: "https://mocked.com/placeholder.png",
  };

  it("renders properly", () => {
    cy.mount(TokenCard, { props: props });
    cy.get("[test-token-card]");
    cy.get("[test-token-icon]");
  });
});
