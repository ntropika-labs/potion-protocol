/// <reference types="cypress" />

import { aliasQuery, resetApproval } from "../support/utilities";

describe("Edit Pool Flow", () => {
  const alreadySelected: string[] = [];
  before(async () => {
    await resetApproval();
  });
  beforeEach(() => {
    cy.intercept(
      "POST",
      "http://localhost:8000/subgraphs/name/potion-subgraph",
      (req) => {
        aliasQuery(req, "getPoolById");
        aliasQuery(req, "allCollateralizedProductsUnderlying");
        aliasQuery(req, "getPoolsFromCriteria");
      }
    ).as("getDataFromSubgraph");
  });

  it("Can visit the edit page and load initial data", () => {
    cy.viewport(1920, 1080);

    cy.visit(
      "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0/edit"
    );

    cy.wait(
      [
        "@getPoolById",
        "@allCollateralizedProductsUnderlying",
        "@getPoolsFromCriteria",
      ],
      { timeout: 20000 }
    ).then((interceptor) => {
      // assert that the subgraph send us the correct pool
      expect(interceptor[0].response?.body).to.haveOwnProperty("data");
      const poolData = interceptor[0].response?.body.data;
      expect(poolData).to.haveOwnProperty("pool");
      const pool = interceptor[0].response?.body.data.pool;
      expect(pool).to.not.be.empty;
      expect(pool.id).to.be.equal(
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660x0"
      );
      // assert that the subgraph send us the correct pool
      expect(interceptor[1].response?.body).to.haveOwnProperty("data");
      const productData = interceptor[1].response?.body.data;
      expect(productData).to.haveOwnProperty("products");
      const products = interceptor[1].response?.body.data.products;
      expect(products).to.have.length.above(0);
    });
  });
  // it("Load pool data from the subgraph", () => {

  // });

  it("Show an error if the liquidity is not valid", () => {
    cy.get(".selection\\:bg-accent-500").clear();
    cy.get(".py-3 > .flex-col > .p-4").should(
      "contain",
      "Please, enter a valid value"
    );
    cy.get(".selection\\:bg-accent-500").clear().type("0");
    cy.get(".py-3 > .flex-col > .p-4").should(
      "contain",
      "Please, enter a valid value"
    );
    cy.get(".selection\\:bg-accent-500").clear().type("1.1234567");
    cy.get(".py-3 > .flex-col > .p-4").should(
      "contain",
      "The max number of decimals is 6"
    );
  });
  it("Can input the liquidity", () => {
    cy.get(".selection\\:bg-accent-500").clear().type("100.123456");
  });
  it("Some tokens are already selected", () => {
    cy.get("[test-wrapper-card]")
      .should("have.length.gte", 1)
      .each(($el, index) => {
        cy.wrap($el)
          .get(
            `:nth-child(${index + 1}) > .justify-between > .gap-2 > .text-2xl`
          )
          .invoke("text")
          .then((text) => {
            alreadySelected.push(text);
          });
      });
  });
  it("TokenCard is selected", () => {
    alreadySelected.forEach((token) => {
      cy.get("[test-token-card]")
        .contains(token)
        .parent()
        .should("have.class", "bg-radial-primary");
    });
  });
  it("Can change the max strike of selected assets", () => {
    cy.get("[test-wrapper-strike]>[test-slider-input]").each(($el) => {
      cy.wrap($el)
        .as("range")
        .invoke("val", 10)
        .trigger("input")
        .should("have.value", 10);
    });
  });
  it("Can change the max duration of selected assets", () => {
    cy.get("[test-wrapper-duration]>[test-slider-input]").each(($el) => {
      cy.wrap($el)
        .as("range")
        .invoke("val", 10)
        .trigger("input")
        .should("have.value", 10);
    });
  });
  it("Can select non selected assets", () => {
    let numberOfAssets = 0;
    cy.get("[test-token-card]")
      .its("length")
      .then((length) => (numberOfAssets = length));
    console.info(numberOfAssets, alreadySelected.length);
    if (numberOfAssets > alreadySelected.length) {
      cy.get("[test-token-card]")
        .then(($els) => {
          return $els.filter((index, element) => {
            console.info(index, $els.length);
            const textContent = Cypress.$(element).text();
            const result = alreadySelected.filter((str) => str === textContent);
            return !result.length;
          });
        })
        .then(($el) => {
          cy.wrap($el).each(($el) => {
            cy.wrap($el).click();
          });
        });
    }
  });
  it("Can change the curve", () => {
    cy.get(".bg-radial-glass > :nth-child(1) > .w-full").clear().type("1");
    cy.get(".bg-radial-glass > :nth-child(2) > .w-full").clear().type("1.2");
    cy.get(".bg-radial-glass > :nth-child(3) > .w-full").clear().type("1.3");
    cy.get(".bg-radial-glass > :nth-child(4) > .w-full").clear().type("1.4");
    cy.get(":nth-child(5) > .w-full").clear().type("1");
  });
  it("Can set the approval", () => {
    cy.get(".gap-3 > .before\\:content-none").click();

    cy.wait(1000);
    cy.get(":nth-child(2) > .grid > .col-span-3 > .text-sm").contains(
      "approved"
    );
  });
  it("Can edit the pool", () => {
    cy.get(".gap-3 > .before\\:content-none").click();

    cy.wait(1000);
    cy.get(":nth-child(4) > .grid > .col-span-3 > .text-sm");
  });
});
