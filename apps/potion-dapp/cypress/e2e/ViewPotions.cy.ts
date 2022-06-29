/// <reference types="cypress" />

import { aliasQuery } from "../support/utilities";

describe("Show Potions Flow", () => {
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

  it("Can visit the buyer page and load initial data", () => {
    cy.viewport(1920, 1080);

    cy.visit("/buyer/0xa0Ee7A142d267C1f36714E4a8F75612F20a79720");

    cy.wait(["@getUserPotions"], {
      timeout: 20000,
    }).then((interceptor) => {
      const response = Array.isArray(interceptor)
        ? interceptor[0]?.response?.body
        : (interceptor as any)?.response.body;

      console.info(response);
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

  it("Can load more active potions when allowed to", () => {
    const hasLoadMore = cy.$$("[test-potions-load-more-active]").length > 0;

    if (hasLoadMore) {
      cy.get("[test-potions-load-more-active]").first().click();

      cy.wait(["@getActivePotions"], {
        timeout: 20000,
      }).then((interceptor) => {
        const response = Array.isArray(interceptor)
          ? interceptor[0]?.response?.body
          : (interceptor as any)?.response.body;
        // assert that the subgraph send us the correct set of active potions
        expect(response).to.haveOwnProperty("data");
        const activePotionsData = response.data;
        expect(activePotionsData).to.haveOwnProperty("buyerRecords");
      });
    }
  });

  it("Can load more expired potions when allowed to", () => {
    const hasLoadMore = cy.$$("[test-potions-load-more-expired]").length > 0;
    if (hasLoadMore) {
      cy.get("[test-potions-load-more-expired]").first().click();
      cy.wait(["@getExpiredPotions"], {
        timeout: 20000,
      }).then((interceptor) => {
        const response = Array.isArray(interceptor)
          ? interceptor[0]?.response?.body
          : (interceptor as any)?.response.body;
        // assert that the subgraph send us the correct set of expired potions
        expect(response).to.haveOwnProperty("data");
        const expiredPotionsData = response.data;
        expect(expiredPotionsData).to.haveOwnProperty("buyerRecords");
      });
    }
  });

  it("Can withdraw expired potions", () => {
    cy.visit("/buyer/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

    cy.wait(["@getUserPotions"]).then((interceptor) => {
      const response = Array.isArray(interceptor)
        ? interceptor[0]?.response?.body
        : (interceptor as any)?.response.body;
      // assert that the subgraph send us the correct set of expired potions
      expect(response).to.haveOwnProperty("data");
      const buyerExpiredPotionsData = response.data.expired;

      if (buyerExpiredPotionsData && buyerExpiredPotionsData.length) {
        cy.get("[text-potions-expired-potion-card] [test-base-button]").click();
      }
    });
  });
});
