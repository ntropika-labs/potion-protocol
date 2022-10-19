/// <reference types="cypress" />

import VaultCard from "./VaultCard.vue";

describe("VaultCard.cy.ts", () => {
  const props = {
    asset: {
      name: "Hello",
      symbol: "AST",
      address: "0x123",
    },
    hedgingRate: 100,
    size: 3000,
    strike: 10,
    currency: "TST",
    onSelected: {},
  };

  it("Renders correctly", () => {
    cy.mount(VaultCard, { props });
    cy.get("[test-vault-card]").should("be.visible");
    cy.get("[test-asset]").should("be.visible");
    cy.get("[test-strike-percentage]").should("be.visible");
    cy.get("[test-hedging-rate]").should("be.visible");
    cy.get("[test-vault-size]").should("be.visible");
    cy.get("[test-button]").should("be.visible");
  });

  it("Emits an event when clicked", () => {
    const onSelectedSpy = cy.spy().as("onSelectedSpy");
    props.onSelected = onSelectedSpy;
    cy.mount(VaultCard, { props: props });
    cy.get("[test-button]").click();
    cy.get("@onSelectedSpy").should("have.been.called");
  });
});
