/// <reference types="cypress" />

import TokenCard from "./TokenCard.vue";

describe("TokenCard", () => {
  const props = {
    name: "Hello Vitest",
    address: "0xMOCKED",
    symbol: "MOCKED",
    image: "https://mocked.com/placeholder.png",
    onTokenSelected: {},
  };

  it("renders properly", () => {
    cy.mount(TokenCard, { props: props });
    cy.get("[test-token-card]");
    cy.get("[test-token-icon]");
  });
  it("Emits an event when clicked", () => {
    const onTokenSelectedSpy = cy.spy().as("onTokenSelectedSpy");
    props.onTokenSelected = onTokenSelectedSpy;
    cy.mount(TokenCard, { props: props });
    cy.get("[test-token-card]").click();
    cy.get("@onTokenSelectedSpy").should("have.been.calledWith", props.address);
  });
});
