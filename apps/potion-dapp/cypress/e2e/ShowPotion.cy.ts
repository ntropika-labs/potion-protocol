/// <reference types="cypress" />
import { aliasQuery, resetApproval } from "../support/utilities";

describe("Show Potion Flow", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-show-potion", "2021-01-01 09:00:00+00:00");
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
        }
      ).as("getDataFromSubgraph");
    });

    context("Can visit the potion page", () => {
      beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit("/potions/0x128e3a22ac64263406d41f8941828b5597fe5879");
      });
      it("Loads the potion data", () => {
        cy.wait("@getPotionById", {
          timeout: 20000,
        }).then((interceptor) => {
          const response = Array.isArray(interceptor)
            ? interceptor[0]?.response?.body
            : (interceptor as any)?.response.body;

          expect(response).to.haveOwnProperty("data");
          expect(response.data).to.haveOwnProperty("otoken");
          expect(response.data.otoken.id).to.equal(
            "0x128e3a22ac64263406d41f8941828b5597fe5879"
          );
        });
      });

      it("Loads the order book", () => {
        cy.wait("@getOrderBookEntries", { timeout: 20000 }).then(
          (interceptor) => {
            const response = Array.isArray(interceptor)
              ? interceptor[0]?.response?.body
              : (interceptor as any)?.response.body;

            expect(response).to.haveOwnProperty("data");
            expect(response.data).to.haveOwnProperty("orderBookEntries");
            expect(response.data.orderBookEntries.length).to.be.greaterThan(0);
          }
        );
      });
    });

    context("Renders correctly", () => {
      it("Shows the correct strike price", () => {
        cy.get("[test-potion-strike-price]")
          .should("be.visible")
          .and("contain.text", "USDC1K");
      });
      it("Shows the correct expiration", () => {
        cy.get("[test-potion-expiration]")
          .should("be.visible")
          .and("contain.text", "Jan 2, 2021");
      });
      it("Shows the correct market size", () => {
        cy.get("[test-potion-market-size]")
          .should("be.visible")
          .and("contain.text", "USDC 2.05M");
      });
      it("Shows the correct price per potion", () => {
        cy.get("[test-potion-price-per-potion]")
          .should("be.visible")
          .and("contain.text", "USDC 12.08");
      });
      it("Shows the correct number of potions", () => {
        cy.get("[test-potion-number-of-potions]")
          .should("be.visible")
          .and("contain.text", "0.001");
      });
      it("Shows the correct number of transactions", () => {
        cy.get("[test-potion-number-of-transactions]")
          .should("be.visible")
          .and("contain.text", "1");
      });
      it("Shows the correct total", () => {
        cy.get("[test-potion-total-price]")
          .should("be.visible")
          .and("contain.text", "USDC 12.14");
      });
      it("Shows the buy/approval button", () => {
        cy.get("[test-potion-buy-button]")
          .should("be.visible")
          .and("contain.text", "approve");
      });
      it("Shows the slippage options", () => {
        cy.get("[test-potion-slippage-button]")
          .should("be.visible")
          .and("have.length", 3);
        cy.get("[test-potion-slippage-button].bg-primary-500").should(
          "contain.text",
          "0.5%"
        );
      });
    });

    context.skip("User inputs", () => {
      it("Can change the number of potions", () => {
        cy.get("[test-potion-number-of-potions-input] input").clear().type("1");
        cy.get("[test-potion-number-of-potions]")
          .should("be.visible")
          .and("contain.text", "1");
        cy.get("[test-potion-number-of-transactions]")
          .should("be.visible")
          .and("contain.text", "5");
        cy.get("[test-potion-total-price]")
          .should("be.visible")
          .and("contain.text", "USDC 12.14K");
      });

      it("Can change the selected slippage", () => {
        cy.get("[test-potion-slippage-button]").last().click();
        cy.get("[test-potion-slippage-button].bg-primary-500").should(
          "contain.text",
          "5%"
        );
      });
    });

    context("Buy more potions", () => {
      it("Can set approval", () => {
        cy.get("[test-potion-buy-button]").click();
        cy.wait(200);

        cy.get(":nth-child(2) > .grid");
        cy.get("[test-potion-buy-button]")
          .should("be.visible")
          .and("contain.text", "buy potion");
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
          cy.get("[test-potion-buy-button]").click();
          cy.get(":nth-child(2) > .grid");
        });

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
          cy.get("[test-potion-buy-button]").click();
          cy.get(":nth-child(2) > .grid");
        });
      });
    });
  });
});
