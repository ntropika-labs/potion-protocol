/// <reference types="cypress" />

import AddLiquidityCard from "../../src/components/CustomPool/AddLiquidityCard.vue";

describe("InputNumber.cy.ts", () => {
  it("is visible", () => {
    cy.mount(AddLiquidityCard, {
      props: {
        title: "Test Title",
        hint: "Test Hint",
        userBalance: 100,
        modelValue: 1,
        size: "1000",
      },
    })
      .get("div")
      .should("be.visible");
  });
});
