/// <reference types="cypress" />
/// <reference types="../support" />

import { aliasQuery } from "../support/utilities";
import { shortDigitFormatter } from "potion-ui/src/helpers";

describe("Show Potions Flow", () => {
  context("environment setup", () => {
    it("reloads the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-view-potions", "2022-01-01 09:00:00+00:00");
    });
  });

  context("test ViewPotions", () => {
    beforeEach(() => {
      cy.intercept(
        "POST",
        "http://localhost:8000/subgraphs/name/potion-subgraph",
        (req) => {
          aliasQuery(req, "getUserPotions");
          aliasQuery(req, "getActivePotions");
          aliasQuery(req, "getExpiredPotions");
        }
      ).as("getDataFromSubgraph");
    });

    context("renders", () => {
      it("Can visit the buyer page", () => {
        cy.viewport(1920, 1080);
        cy.visit("/buyer/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
      });

      it("Can load initial data", () => {
        cy.wait("@getUserPotions", {
          timeout: 20000,
        }).then((interceptor) => {
          const response = Array.isArray(interceptor)
            ? interceptor[0]?.response?.body
            : interceptor?.response.body;

          // assert that the subgraph send us the correct sets of buyer potions
          expect(response).to.haveOwnProperty("data");
          const buyerPotionsData = response.data;
          expect(buyerPotionsData).to.haveOwnProperty("expired");
          expect(buyerPotionsData).to.haveOwnProperty("active");

          const responseTotalActive = buyerPotionsData.active.length;
          const responseTotalExpired = buyerPotionsData.expired.length;

          cy.get("[test-potions-total-active]").contains(responseTotalActive);
          cy.get("[test-potions-total-expired]").contains(responseTotalExpired);
        });
      });

      it("Renders the active potions", () => {
        cy.get("[test-active-potions-grid] [test-my-potion-card]").should(
          "have.length",
          1
        );
        cy.get("[test-active-potions-grid] [test-my-potion-card]")
          .first()
          .as("card");

        cy.get("@card")
          .find("[test-strike-price]")
          .should("contain.text", shortDigitFormatter(500));
        cy.get("@card")
          .find("[test-expiration]")
          .should("contain.text", "Jan 2, 2022");
        cy.get("@card").find("[test-quantity]").should("contain.text", "1");
        cy.get("@card")
          .find("[test-current-payout]")
          .should("contain.text", shortDigitFormatter(500));
        cy.get("@card").find("[test-withdraw-button]").should("not.exist");
      });

      it("Renders the expired potions", () => {
        cy.get("[test-expired-potions-grid] [test-my-potion-card]").should(
          "have.length",
          1
        );
        cy.get("[test-expired-potions-grid] [test-my-potion-card]")
          .first()
          .as("card");

        cy.get("@card")
          .find("[test-strike-price]")
          .should("contain.text", shortDigitFormatter(1100));
        cy.get("@card")
          .find("[test-expiration]")
          .should("contain.text", "Jan 2, 2021");
        cy.get("@card").find("[test-quantity]").should("contain.text", "10");
        cy.get("@card")
          .find("[test-current-payout]")
          .should("contain.text", shortDigitFormatter(1000));
        cy.get("@card").find("[test-withdraw-button]").should("be.visible");
      });
    });

    context("Can load more when allowed to", () => {
      it("Can load more active potions", () => {
        const hasLoadMore = cy.$$("[test-potions-load-more-active]").length > 0;
        if (hasLoadMore) {
          cy.get("[test-potions-load-more-active]").first().click();
          cy.wait("@getActivePotions", {
            timeout: 20000,
          }).then((interceptor) => {
            const response = interceptor?.response.body;
            // assert that the subgraph send us the correct set of active potions
            expect(response).to.haveOwnProperty("data");
            const activePotionsData = response.data;
            expect(activePotionsData).to.haveOwnProperty("buyerRecords");
          });
        }
      });

      it("Can load more expired potions", () => {
        const hasLoadMore =
          cy.$$("[test-potions-load-more-expired]").length > 0;
        if (hasLoadMore) {
          cy.get("[test-potions-load-more-expired]").first().click();
          cy.wait("@getExpiredPotions", {
            timeout: 20000,
          }).then((interceptor) => {
            const response = interceptor?.response.body;
            // assert that the subgraph send us the correct set of expired potions
            expect(response).to.haveOwnProperty("data");
            const expiredPotionsData = response.data;
            expect(expiredPotionsData).to.haveOwnProperty("buyerRecords");
          });
        }
      });
    });

    context("Handles user actions", () => {
      it("Can withdraw expired potions", () => {
        cy.get("[test-expired-potions-grid] [test-my-potion-card]")
          .first()
          .as("card");
        cy.get("@card").find("[test-withdraw-button]").should("be.visible");
        cy.get("@card").find("[test-withdraw-button]").click();

        cy.get("#toast-wrap :nth-child(1) > .grid > .col-span-3 > .text-sm", {
          timeout: 10000,
        });
        cy.get("@card")
          .find("[test-current-payout]")
          .should("contain.text", "USDC0");
        cy.get("@card").find("[test-withdraw-button]").should("not.exist");
      });
    });
  });
});
