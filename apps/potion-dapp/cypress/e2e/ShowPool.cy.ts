/// <reference types="cypress" />

describe("Show Pool Flow", () => {
  it("Can visit the edit page", () => {
    cy.viewport(1920, 1080);
    cy.visit(
      "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0"
    );
  });

  it("Can switch between tabs", () => {
    cy.get("[test-liquidity-card-header]>button").each(($el) => {
      cy.wrap($el).trigger("click");
    });
  });

  it("Can withdraw", () => {
    cy.get("[test-liquidity-card-header]>button").first().click();

    let expectedLiquidityNumber = -1;
    cy.get("[test-liquidity-card-total-liquidity]")
      .first()
      .then(($el) => {
        expectedLiquidityNumber = parseFloat($el.text().slice(1)) - 101;
        console.info(expectedLiquidityNumber);
      })
      .then(() => {
        cy.get("[test-liquidity-card-withdraw] input").clear().type("101");

        cy.get("[test-liquidity-card-footer-withdraw]>button")
          .first()
          .trigger("click");

        cy.get("[test-liquidity-card-total-liquidity]")
          .first()
          .contains("$" + expectedLiquidityNumber);
      });

    console.info(expectedLiquidityNumber);
  });

  it("Can deposit", () => {
    cy.get("[test-liquidity-card-header]>button").last().click();

    let expectedLiquidityNumber = -1;
    cy.get("[test-liquidity-card-total-liquidity]")
      .first()
      .then(($el) => {
        expectedLiquidityNumber = parseFloat($el.text().slice(1)) + 101;
        console.info(expectedLiquidityNumber);
      })
      .then(() => {
        console.info(expectedLiquidityNumber);
        cy.get("[test-liquidity-card-deposit] input").clear().type("101");

        cy.get("[test-liquidity-card-footer-deposit]>button")
          .first()
          .trigger("click");

        cy.get("[test-liquidity-card-total-liquidity]")
          .first()
          .contains("$" + expectedLiquidityNumber);
      });
  });
});
