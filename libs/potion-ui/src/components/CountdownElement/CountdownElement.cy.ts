/// <reference types="cypress" />

import { CountdownElement } from "potion-ui";

describe("CountdownElement.cy.ts", () => {
  it("displays the correct countdown values", () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(startDate.getHours() + 3);
    endDate.setMinutes(50);
    endDate.setSeconds(30);
    console.log(startDate, endDate);
    cy.mount(CountdownElement, {
      props: {
        label: "test",
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
      },
    });
    cy.get("[test-countdown-year]").should("not.exist");
    cy.get("[test-countdown-month]").should("not.exist");
    cy.get("[test-countdown-day]").should("be.visible");
    cy.get("[test-countdown-hour]").should("be.visible");
    cy.get("[test-countdown-minute]").should("be.visible");
    cy.get("[test-countdown-second]").should("be.visible");
  });
});
