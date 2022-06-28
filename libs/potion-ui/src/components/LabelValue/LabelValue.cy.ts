/// <reference types="cypress" />

import LabelValue from "./LabelValue.vue";

describe("LabelValue", () => {
  context("valueType = number", () => {
    beforeEach(() => {
      const props = {
        value: "1000000",
        title: "Test title",
        symbol: "",
        valueType: "number",
      };
      cy.mount(LabelValue, { props });
    });

    it("renders properly", () => {
      cy.get("[test-label-value]").should("be.visible");
    });
    it("has the correct title", () => {
      cy.get("[test-label-value-title]")
        .should("be.visible")
        .and("contain.text", "Test title");
    });
    it("has the correct value", () => {
      cy.get("[test-label-value-value]")
        .should("be.visible")
        .and("contain.text", "1M");
    });
  });

  context("valueType = currency", () => {
    beforeEach(() => {
      const props = {
        value: "1000000",
        title: "Test title",
        symbol: "$",
        valueType: "currency",
      };
      cy.mount(LabelValue, { props });
    });

    it("renders properly", () => {
      cy.get("[test-label-value]").should("be.visible");
    });
    it("has the correct title", () => {
      cy.get("[test-label-value-title]")
        .should("be.visible")
        .and("contain.text", "Test title");
    });
    it("has the correct value", () => {
      cy.get("[test-label-value-value]")
        .should("be.visible")
        .and("contain.text", "$1M");
    });
  });

  context("valueType = pnl", () => {
    beforeEach(() => {
      const props = {
        value: 0,
        title: "Test title",
        symbol: "%",
        valueType: "pnl",
      };
      cy.mount(LabelValue, { props });
    });

    it("renders properly", () => {
      cy.get("[test-label-value]").should("be.visible");
    });
    it("has the correct title", () => {
      cy.get("[test-label-value-title]")
        .should("be.visible")
        .and("contain.text", "Test title");
    });
    it("has the correct value", () => {
      cy.get("[test-label-value-value]")
        .should("be.visible")
        .and("contain.text", "0%");
    });
  });

  context("valueType = timestamp", () => {
    beforeEach(() => {
      const props = {
        value: "1656032400",
        title: "Test title",
        symbol: "",
        valueType: "timestamp",
      };
      cy.mount(LabelValue, { props });
    });

    it("renders properly", () => {
      cy.get("[test-label-value]").should("be.visible");
    });
    it("has the correct title", () => {
      cy.get("[test-label-value-title]")
        .should("be.visible")
        .and("contain.text", "Test title");
    });
    it("has the correct value", () => {
      cy.get("[test-label-value-value]")
        .should("be.visible")
        .and("contain.text", "Jun 24, 2022");
    });
  });

  context("valueType = date", () => {
    beforeEach(() => {
      const props = {
        value: "2022-06-24",
        title: "Test title",
        symbol: "",
        valueType: "date",
      };
      cy.mount(LabelValue, { props });
    });

    it("renders properly", () => {
      cy.get("[test-label-value]").should("be.visible");
    });
    it("has the correct title", () => {
      cy.get("[test-label-value-title]")
        .should("be.visible")
        .and("contain.text", "Test title");
    });
    it("has the correct value", () => {
      cy.get("[test-label-value-value]")
        .should("be.visible")
        .and("contain.text", "Jun 24, 2022");
    });
  });
});
