/// <reference types="cypress" />
/// <reference types="../support" />

import { aliasQuery, resetApproval } from "../support/utilities";

describe("Custom Potion Creation Flow", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/base", "2021-01-01 09:00:00+00:00", false);
    });
    it("can reset the approval", async () => {
      await resetApproval();
    });
  });
  context("customPotionCreation test", () => {
    // let assetText = "";
    let minStrike = 0;
    let maxStrike = 0;
    let minDuration = 0;
    let maxDuration = 0;
    let minQuantity = 0;
    let maxQuantity = 0;
    beforeEach(() => {
      cy.intercept(
        "POST",
        "http://localhost:8000/subgraphs/name/potion-subgraph",
        (req) => {
          aliasQuery(req, "poolsWithLiquidity");
          aliasQuery(req, "getMaxStrikeForUnderlying");
          aliasQuery(req, "getSimilarPotionByAsset");
          aliasQuery(req, "getSimilarPotionByStrike");
          aliasQuery(req, "getSimilarPotionByDuration");
          aliasQuery(req, "getPoolsFromCriteria");
        }
      ).as("getDataFromSubgraph");
    });
    it("Can visit custom-potion-creation and load the initial data", () => {
      cy.viewport(1920, 1080);
      cy.visit("/custom-potion-creation");

      cy.wait(["@poolsWithLiquidity"]);
    });
    it("Cannot navigate to the next step when an asset is not selected", () => {
      cy.contains("next").should("be.disabled");
    });
    it("Can select an asset and load the similar potions", () => {
      console.log("here");
      cy.contains("WETH").click();
      cy.wait("@getSimilarPotionByAsset").then((interceptor) => {
        expect(interceptor.response?.body).to.haveOwnProperty("data");
        const similarPotionsByAsset = interceptor.response?.body.data;
        expect(similarPotionsByAsset).to.haveOwnProperty("otokens");
        if (similarPotionsByAsset.otokens.length > 0) {
          cy.get(":nth-child(2) > .grid-cols-1")
            .children()
            .should("have.length", similarPotionsByAsset.otokens.length);
        }
      });
    });
    it("Can navigate to the next step and load data from the subgraph", () => {
      cy.contains("next").should("not.be.disabled").click();
      cy.wait("@getSimilarPotionByStrike");
    });
    it("Strike Input has minimum and maximum values", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .invoke("attr", "min")
        .then((min) => {
          minStrike = parseFloat(min ?? "0");
          expect(minStrike).to.be.greaterThan(0);
        });
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .invoke("attr", "max")
        .then((max) => {
          maxStrike = parseFloat(max ?? "0");
          expect(maxStrike).to.be.greaterThan(minStrike);
        });
    });
    it("Informs the user to set a valid number if the number is lower than the minimum allowed number", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type((minStrike - 1).toString());
      cy.contains("next").should("be.disabled");
      cy.get(".font-semibold > .capitalize")
        .invoke("text")
        .should("include", "Please, enter a valid value");
    });
    it("Informs the user to set a valid number if the number is higher than the maximum allowed number", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type((maxStrike + 1).toString());
      cy.contains("next").should("be.disabled");
      cy.get(".font-semibold > .capitalize")
        .invoke("text")
        .should("include", "Please, enter a valid value");
    });
    it("Can change the strike to a valid number", () => {
      const validNumber = Math.floor(
        Math.random() * (maxStrike - minStrike + 1) + minStrike
      );
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type(validNumber.toString());
    });
    it("Can go to the next step and load data from the subgraph", () => {
      cy.contains("next").should("not.be.disabled").click();
      cy.wait("@getSimilarPotionByDuration");
    });
    it("Duration Input has minimum and maximum values", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .invoke("attr", "min")
        .then((min) => {
          minDuration = parseFloat(min ?? "0");
          expect(minDuration).to.be.greaterThan(0);
        });
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .invoke("attr", "max")
        .then((max) => {
          maxDuration = parseFloat(max ?? "0");
          expect(maxDuration).to.be.greaterThan(minDuration);
        });
    });
    it("Informs the user to set a valid number if the number is lower than the minimum allowed number", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type((minDuration - 1).toString());
      cy.contains("next").should("be.disabled");
      cy.get(".font-semibold > .capitalize")
        .invoke("text")
        .should("include", "Please, enter a valid value");
    });
    it("Informs the user to set a valid number if the number is higher than the maximum allowed number", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type((maxDuration + 1).toString());
      cy.contains("next").should("be.disabled");
      cy.get(".font-semibold > .capitalize")
        .invoke("text")
        .should("include", "Please, enter a valid value");
    });
    it("Can change the duration to a valid number", () => {
      const validNumber = Math.floor(
        Math.random() * (maxDuration - minDuration + 1) + minDuration
      );
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type(validNumber.toString());
    });
    it("Can go to the review step", () => {
      cy.contains("next").should("not.be.disabled").click();
    });
    it("Quantity Input has minimum and maximum values", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .invoke("attr", "min")
        .then((min) => {
          minQuantity = parseFloat(min ?? "0");
          expect(minQuantity).to.be.greaterThan(0);
        });
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .invoke("attr", "max")
        .then((max) => {
          maxQuantity = parseFloat(max ?? "0");
          expect(maxQuantity).to.be.greaterThan(minQuantity);
        });
    });
    it("Informs the user to set a valid number if the number is lower than the minimum allowed number", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300").clear().type((0).toString());
      cy.contains("invalid potion").should("be.disabled");
      cy.get(".font-semibold > .capitalize")
        .invoke("text")
        .should("include", "Please, enter a valid value");
    });
    it("Informs the user to set a valid number if the number is higher than the maximum allowed number", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type((maxQuantity + 1).toString());
      cy.contains("invalid potion").should("be.disabled");
      cy.get(".font-semibold > .capitalize")
        .invoke("text")
        .should("include", "Please, enter a valid value");
    });
    it("Can change the quantity to a valid value and get a new premium", () => {
      const validNumber = Math.floor(
        Math.random() * (maxQuantity - minQuantity + 1) + minQuantity
      );
      cy.get(".p-3 > .flex > .text-dwhite-300")
        .clear()
        .type(validNumber.toString());
      cy.wait("@getPoolsFromCriteria");
    });
    it("Can approve and buy", () => {
      cy.get(".p-3 > .flex > .text-dwhite-300").clear().type("0.001");
      cy.get("[test-buy-potion]").first().as("purchaseButton");

      cy.approveAndPurchase(0, "@purchaseButton", "buy potion", "approve");
    });
  });
});
