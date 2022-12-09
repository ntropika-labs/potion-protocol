/// <reference types="cypress" />
/// <reference types="../support" />

import { aliasQuery, resetApproval } from "../support/utilities";
import { shortCurrencyFormatter } from "potion-ui/src/helpers";

describe("Show Pool Flow", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-show-pool", "2022-01-01 09:00:00+00:00");
    });
    it("can reset the approval", async () => {
      await resetApproval();
    });
  });

  context("showPool test", () => {
    beforeEach(() => {
      cy.intercept(
        "POST",
        "http://localhost:8000/subgraphs/name/potion-subgraph",
        (req) => {
          aliasQuery(req, "getPoolById");
        }
      ).as("getDataFromSubgraph");
    });

    it("Can visit the pool page", () => {
      cy.viewport(1920, 1080);
      cy.visit(
        "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0"
      );
      cy.wait("@getPoolById", {
        timeout: 20000,
      }).then((interceptor) => {
        const response = interceptor?.response.body;

        // assert that the subgraph send us the correct pool data
        expect(response).to.haveOwnProperty("data");
        expect(response.data).to.haveOwnProperty("pool");
        expect(response.data.pool.id).to.equal(
          "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660x0"
        );
      });
    });

    context("withdraw/deposit", () => {
      const amountToExchange = 101;
      beforeEach(() => {
        cy.get("[test-liquidity-card-total-liquidity]")
          .first()
          .invoke("text")
          .invoke("slice", 1)
          .as("liquidityString"); // alias to access the value as this.originalLiquidityString
      });
      it("Can switch between tabs", () => {
        cy.get("[test-liquidity-card-header]>button").each(($el) => {
          cy.wrap($el).trigger("click");
        });
      });

      it("Can withdraw", () => {
        cy.get("[test-liquidity-card-header]>button").first().click();

        cy.get("[test-liquidity-card-withdraw] input")
          .clear()
          .type(amountToExchange.toString());

        cy.get("[test-liquidity-card-footer-withdraw]>button")
          .first()
          .trigger("click");

        cy.get("@liquidityString").then((liquidityString: unknown) => {
          const liquidity =
            parseFloat(liquidityString as string) - amountToExchange;

          cy.get("[test-liquidity-card-total-liquidity]")
            .first()
            .contains(liquidity.toString());
        });

        cy.get(":nth-child(2) > .grid > .col-span-3 > .text-sm");
      });
      it("Can approve and deposit", () => {
        cy.get("[test-liquidity-card-header]>button").last().click();
        cy.wait(200);

        cy.get("[test-liquidity-card-deposit] input")
          .clear()
          .type(amountToExchange.toString());

        cy.get("[test-liquidity-card-footer-deposit]>button")
          .first()
          .as("purchaseButton");

        cy.approveAndPurchase(
          amountToExchange,
          "@purchaseButton",
          "add liquidity"
        );

        cy.get("@liquidityString").then((liquidityString: unknown) => {
          const liquidity =
            parseFloat(liquidityString as string) + amountToExchange;

          cy.get("[test-liquidity-card-total-liquidity]")
            .first()
            .contains(liquidity.toString());
        });
      });
    });

    context("active put options", () => {
      it("Can switch to active options", () => {
        cy.get("[test-claim-table-active-tab-switch]").click();
      });
      it("Shows the put options table", () => {
        cy.get("[test-claim-table-active-options]").should("be.visible");
      });

      it("Shows the active option correctly", () => {
        cy.get("[test-claim-table-active-options]")
          .find("tbody > tr:nth-child(1)")
          .as("option");
        cy.get("@option")
          .find("td:nth-child(1)")
          .should("contain.text", "WETH"); // underlying asset
        cy.get("@option")
          .find("td:nth-child(2)")
          .should("contain.text", "Jan 2, 2022"); // expiration date
        cy.get("@option")
          .find("td:nth-child(3)")
          .should("contain.text", shortCurrencyFormatter(100.4, "USDC")); // premium
        cy.get("@option")
          .find("td:nth-child(4)")
          .should("contain.text", shortCurrencyFormatter(50, "USDC")); // strike price
        cy.get("@option")
          .find("td:nth-child(5)")
          .should("contain.text", shortCurrencyFormatter(1000, "USDC")); // collateral
        cy.get("@option")
          .find("td:nth-child(6)")
          .should("contain.text", "+ 10.04%"); // projected pnl
      });
    });

    context("expired put options", () => {
      it("Can switch to expired options", () => {
        cy.get("[test-claim-table-expired-tab-switch]").click();
      });

      context("Renders correctly", () => {
        it("Shows the put options table", () => {
          cy.get("[test-claim-table-expired-options]").should("be.visible");
        });
        it("Shows the correct filters", () => {
          cy.get("[test-claim-table-toggle-all-button]").should("not.exist");
          cy.get("[test-claim-table-toggle-asset-button]").should(
            "have.length",
            1
          );
        });

        it("Shows the claimed option correctly", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(1)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(1) > [test-table-claim-button]")
            .should("be.visible")
            .and("contain.text", "Claimed");
          cy.get("@option")
            .find("td:nth-child(2)")
            .should("contain.text", "WETH"); // underlying asset
          cy.get("@option")
            .find("td:nth-child(3)")
            .should("contain.text", "Jan 2, 2021"); //expiration date
          cy.get("@option")
            .find("td:nth-child(4)")
            .should("contain.text", shortCurrencyFormatter(1200, "USDC")); // strike price
          cy.get("@option")
            .find("td:nth-child(5)")
            .should("contain.text", "- 14.59%"); // pnl
          cy.get("@option")
            .find("td:nth-child(6)")
            .should("contain.text", shortCurrencyFormatter(1248.93, "USDC")); // strike price
          cy.get("@option").find("td:nth-child(7)").should("contain.text", "0"); //claimable liquidity
          cy.get("@option")
            .find("td:nth-child(8)")
            .should("contain.text", shortCurrencyFormatter(9000, "USDC")); //claimed liquidity
        });

        it("Shows the not claimed option correctly", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(2)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(1) > [test-table-claim-button]")
            .should("be.visible")
            .and("contain.text", "claim");
          cy.get("@option")
            .find("td:nth-child(2)")
            .should("contain.text", "WETH"); // underlying asset
          cy.get("@option")
            .find("td:nth-child(3)")
            .should("contain.text", "Mar 1, 2021"); // expiration date
          cy.get("@option")
            .find("td:nth-child(4)")
            .should("contain.text", shortCurrencyFormatter(100, "USDC")); // strike price
          cy.get("@option")
            .find("td:nth-child(5)")
            .should("contain.text", "+ 10.00%"); // pnl
          cy.get("@option")
            .find("td:nth-child(6)")
            .should("contain.text", shortCurrencyFormatter(10, "USDC")); // premium
          cy.get("@option")
            .find("td:nth-child(7)")
            .should("contain.text", shortCurrencyFormatter(100, "USDC")); // claimable liquidity
          cy.get("@option").find("td:nth-child(8)").should("contain.text", "0"); // claimed liquidity
        });
      });

      context("Claiming options", () => {
        it("Can claim", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(2)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(1) > [test-table-claim-button]")
            .as("button");
          cy.get("@button").click();
          cy.get("@option").find("td:nth-child(7)").should("contain.text", "0");
          cy.get("@option")
            .find("td:nth-child(8)")
            .should("contain.text", shortCurrencyFormatter(100, "USDC"));
          cy.get("@button").should("be.visible").and("contain.text", "Claimed");
        });
      });
    });
  });
});
