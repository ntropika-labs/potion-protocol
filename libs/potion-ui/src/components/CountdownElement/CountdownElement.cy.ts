/// <reference types="cypress" />

import { CountdownElement } from "potion-ui";

describe("CountdownElement.cy.ts", () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(startDate.getHours() + 3);
  endDate.setMinutes(50);
  endDate.setSeconds(30);

  const startTimestampSeconds = startDate.getTime() / 1000;
  const endTimestampSeconds = endDate.getTime() / 1000;

  it("displays the correct countdown values", () => {
    cy.mount(CountdownElement, {
      props: {
        label: "test",
        startTimestampSeconds,
        endTimestampSeconds,
        expirationMessage: "",
      },
    });
    cy.get("[test-countdown-year]").should("not.exist");
    cy.get("[test-countdown-month]").should("not.exist");
    cy.get("[test-countdown-day]").should("be.visible");
    cy.get("[test-countdown-hour]").should("be.visible");
    cy.get("[test-countdown-minute]").should("be.visible");
    cy.get("[test-countdown-second]").should("be.visible");
  });

  it("displays the expiration message", () => {
    cy.mount(CountdownElement, {
      props: {
        label: "test",
        endTimestampSeconds: startTimestampSeconds,
        startTimestampSeconds: endTimestampSeconds,
        expirationMessage: "expired",
      },
    });
    cy.get("[test-countdown-year]").should("not.exist");
    cy.get("[test-countdown-month]").should("not.exist");
    cy.get("[test-countdown-day]").should("not.exist");
    cy.get("[test-countdown-hour]").should("not.exist");
    cy.get("[test-countdown-minute]").should("not.exist");
    cy.get("[test-countdown-second]").should("not.exist");
    cy.get("[test-countdown-expiration]").should("be.visible");
  });
});
