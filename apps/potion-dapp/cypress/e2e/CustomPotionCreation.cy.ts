/// <reference types="cypress" />
import { aliasQuery } from "../support/utilities";

describe("Custom Potion Creation Flow", () => {
  // let assetText = "";
  beforeEach(() => {
    cy.intercept(
      "POST",
      "http://localhost:8000/subgraphs/name/potion-subgraph",
      (req) => {
        aliasQuery(req, "poolsWithLiquidity");
        aliasQuery(req, "getMaxStrikeForUnderlying");
        aliasQuery(req, "getSimilarPotionByAsset");
        aliasQuery(req, "getPoolsFromCriteria");
      }
    ).as("getDataFromSubgraph");
  });
  it("Can visit custom-potion-creation and load the initial data", () => {
    cy.viewport(1920, 1080);
    cy.visit("/custom-potion-creation");

    cy.wait(["@poolsWithLiquidity"]);
  });
  it("Can select an asset", () => {
    console.log("here");
  });
});
