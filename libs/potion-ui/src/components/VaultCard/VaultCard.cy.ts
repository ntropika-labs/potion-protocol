/// <reference types="cypress" />

import VaultCard from "./VaultCard.vue";

describe("VaultCard.cy.ts", () => {
  const props = {
    address: "0x1234",
    asset: {
      name: "Hello",
      symbol: "AST",
      address: "0x123",
    },
    cycleDurationSecs: "86400",
    strike: "10",
    maxPremium: "10",
    currency: "TST",
    strategy: "PROTECTIVE_PUT",
    onSelected: {},
  };

  it("Renders correctly", () => {
    cy.mount(VaultCard, { props });
    cy.get("[test-vault-card]").should("be.visible");
    cy.get("[test-strategy]").should("be.visible");
    cy.get("[test-address]").should("be.visible");
    cy.get("[test-asset]").should("be.visible");
    cy.get("[test-strike-percentage]").should("be.visible");
    cy.get("[test-round-length]").should("be.visible");
    cy.get("[test-max-premium]").should("be.visible");
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
