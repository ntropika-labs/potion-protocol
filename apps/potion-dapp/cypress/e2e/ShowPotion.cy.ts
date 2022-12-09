/// <reference types="cypress" />
/// <reference types="../support" />

import { aliasQuery, resetApproval } from "../support/utilities";
import { currencyFormatter, shortDigitFormatter } from "potion-ui/src/helpers";

describe("Show Potion Flow", () => {
  context.skip("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-show-potion", "2021-01-01 09:00:00+00:00", false);
    });
    it("can reset the approval", async () => {
      await resetApproval();
    });
  });

  context("showPotion test", () => {
    beforeEach(() => {
      cy.intercept(
        "POST",
        "http://localhost:8000/subgraphs/name/potion-subgraph",
        (req) => {
          aliasQuery(req, "getPotionById");
          aliasQuery(req, "getOrderBookEntries");
          aliasQuery(req, "getPoolsFromCriteria");
        }
      ).as("getDataFromSubgraph");
    });

    it("Can visit the potion page and load required data", () => {
      cy.viewport(1920, 1080);

      cy.visit("/potions/0xc4ce0963626822f2c3f8c166968346a8bf46af26");

      cy.wait(
        ["@getPotionById", "@getOrderBookEntries", "@getPoolsFromCriteria"],
        {
          timeout: 20000,
        }
      ).then((interceptor) => {
        // Loads potion data correctly
        const potionResponse = interceptor[0].response?.body;
        expect(potionResponse).to.haveOwnProperty("data");
        expect(potionResponse.data).to.haveOwnProperty("otoken");
        expect(potionResponse.data.otoken.id).to.equal(
          "0xc4ce0963626822f2c3f8c166968346a8bf46af26"
        );

        // loads order book correctly
        const orderBookResponse = interceptor[1].response?.body;
        expect(orderBookResponse).to.haveOwnProperty("data");
        expect(orderBookResponse.data).to.haveOwnProperty("orderBookEntries");
        expect(
          orderBookResponse.data.orderBookEntries.length
        ).to.be.greaterThan(0);

        // loads criterias to calculate the market-size correctly
        const marketSizeResponse = interceptor[2].response?.body;
        expect(marketSizeResponse).to.haveOwnProperty("data");
        expect(marketSizeResponse.data).to.haveOwnProperty("criterias");
        expect(marketSizeResponse.data.criterias.length).to.be.greaterThan(0);
      });
    });

    context("Renders correctly", () => {
      it("Shows the correct strike price", () => {
        cy.wait(15000);
        cy.get("[test-potion-strike-price]")
          .should("be.visible")
          .and("contain.text", shortDigitFormatter(1100));
      });
      it("Shows the correct expiration", () => {
        cy.get("[test-potion-expiration]")
          .should("be.visible")
          .and("contain.text", "Feb 1, 2021");
      });
      it("Shows the correct number of potions", () => {
        cy.get("[test-potion-number-of-potions]")
          .should("be.visible")
          .and("contain.text", "0.001");
      });
      it.skip("Shows the buy/approval button", () => {
        cy.get("[test-potion-buy-button]")
          .should("be.visible")
          .and("contain.text", "approve");
      });
      it("Shows the slippage options", () => {
        cy.get("[test-potion-slippage-button]")
          .should("be.visible")
          .and("have.length", 3);
        cy.get("[test-potion-slippage-button] > .bg-primary-500").should(
          "contain.text",
          "0.5%"
        );
      });

      it("Shows the correct market size", () => {
        cy.get("[test-potion-market-size]")
          .should("be.visible")
          .and("contain.text", currencyFormatter(195265.154365, "USDC"));
      });
      context("depth router based data", () => {
        it("Shows the correct price per potion", () => {
          cy.get("[test-potion-price-per-potion]")
            .should("be.visible")
            .and("contain.text", currencyFormatter(0.11, "USDC"));
        });
        it("Shows the correct number of transactions", () => {
          cy.get("[test-potion-number-of-transactions]")
            .should("be.visible")
            .and("contain.text", "1");
        });
        it("Shows the correct total", () => {
          cy.get("[test-potion-total-price]")
            .should("be.visible")
            .and("contain.text", currencyFormatter(0.11, "USDC"));
        });
      });
    });

    context("User inputs", () => {
      it("Can change the number of potions", () => {
        cy.get("[test-potion-number-of-potions-input] input").clear().type("1");
        cy.get("[test-potion-number-of-potions]")
          .should("be.visible")
          .and("contain.text", "1");
      });
      it("Updates the number of transactions and the total price", () => {
        cy.get("[test-potion-number-of-transactions]")
          .should("be.visible")
          .and("contain.text", "2");
        cy.get("[test-potion-total-price]")
          .should("be.visible")
          .and("contain.text", currencyFormatter(117.22, "USDC"));
      });

      it("Can change the selected slippage", () => {
        cy.get("[test-potion-slippage-button]").last().click();
        cy.get("[test-potion-slippage-button] > .bg-primary-500").should(
          "contain.text",
          "5%"
        );
      });
    });

    context.skip("Buy more potions", () => {
      beforeEach(() => {
        cy.get("[test-potion-buy-button]").first().as("purchaseButton");
      });

      context("Buy potions", () => {
        it("Can buy more potions in one transaction", () => {
          cy.get("[test-potion-number-of-potions-input] input")
            .clear()
            .type("0.001");
          cy.get("[test-potion-slippage-button]").first().click();
          cy.get("[test-potion-number-of-potions]")
            .should("be.visible")
            .and("contain.text", "0.001");
          cy.get("[test-potion-number-of-transactions]")
            .should("be.visible")
            .and("contain.text", "1");

          cy.approveAndPurchase(
            0,
            "@purchaseButton",
            "buy potion",
            true,
            "approve"
          );
        });

        it("Can reset approval", async () => await resetApproval());

        it("Can buy more potions in multiple transactions", () => {
          cy.get("[test-potion-number-of-potions-input] input")
            .clear()
            .type("1");
          cy.get("[test-potion-slippage-button]").first().click();
          cy.get("[test-potion-number-of-potions]")
            .should("be.visible")
            .and("contain.text", "1");
          cy.get("[test-potion-number-of-transactions]")
            .should("be.visible")
            .and("contain.text", "5");

          cy.approveAndPurchase(
            0,
            "@purchaseButton",
            "buy potion",
            false,
            "approve"
          );
        });
      });
    });
  });
});
