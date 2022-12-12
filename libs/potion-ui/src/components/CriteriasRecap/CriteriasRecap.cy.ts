/// <reference types="cypress" />

import CriteriasRecap from "./CriteriasRecap.vue";

describe("CriteriasRecap.cy.ts", () => {
  it("Is renders empty component", () => {
    cy.mount(CriteriasRecap);
    cy.get("[test-criterias-recap-empty]");
  });
  it("renders with one token", () => {
    cy.mount(CriteriasRecap, {
      props: {
        criterias: [
          {
            token: {
              name: "Hello Vitest",
              address: "0xMOCKED",
              symbol: "MOCKED",
              image: "https://mocked.com/placeholder.png",
            },
            maxStrike: 100,
            maxDuration: 30,
          },
        ],
      },
    });
    cy.get("[test-criterias-recap-header]");
    cy.get("[test-criterias-recap-container]");
    cy.get("[test-criterias-recap-row]");
    cy.get("[test-token-icon]");
  });
  it("renders with multiple tokens", () => {
    cy.mount(CriteriasRecap, {
      props: {
        criterias: [
          {
            token: {
              name: "Hello Vitest",
              address: "0xMOCKED",
              symbol: "MOCKED",
              image: "https://mocked.com/placeholder.png",
            },
            maxStrike: 100,
            maxDuration: 30,
          },
          {
            token: {
              name: "Hello Vitest 2",
              address: "0xMOCKED2",
              symbol: "MOCKED2",
              image: "https://mocked.com/placeholder.png",
            },
            maxStrike: 200,
            maxDuration: 30,
          },
        ],
      },
    });
    cy.get("[test-criterias-recap-header]");
    cy.get("[test-criterias-recap-container]");
    cy.get("[test-criterias-recap-row]");
    cy.get("[test-token-icon]");
  });
});
