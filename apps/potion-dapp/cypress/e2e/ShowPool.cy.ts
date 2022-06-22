/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

describe("Show Pool Flow", () => {
  it("Can start the blockchain with the correct seed", () => {
    cy.seed("/opt/e2e-show-pool");
  });

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
        console.log(expectedLiquidityNumber);
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

    console.log(expectedLiquidityNumber);
  });

  it("Can deposit", () => {
    cy.get("[test-liquidity-card-header]>button").last().click();

    let expectedLiquidityNumber = -1;
    cy.get("[test-liquidity-card-total-liquidity]")
      .first()
      .then(($el) => {
        expectedLiquidityNumber = parseFloat($el.text().slice(1)) + 101;
        console.log(expectedLiquidityNumber);
      })
      .then(() => {
        console.log(expectedLiquidityNumber);
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
