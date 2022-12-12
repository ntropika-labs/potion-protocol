/// <reference types="cypress" />
/// <reference types="../support" />

function testGrid(title: string, identifier: string, templates: number) {
  context(title, () => {
    beforeEach(() => {
      cy.get(identifier).as("test-grid");
    });

    it("renders the grid correctly", () => {
      cy.get("@test-grid").should("be.visible");
    });

    it("renders the templates cards correctly", () => {
      cy.get("@test-grid")
        .find("[test-pool-template-card]")
        .should("have.length", templates);
    });

    it("shows the load more button", () => {
      cy.get("@test-grid").find("[test-load-more]").should("not.exist");
    });
  });
}

describe("DiscoverTemplates", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/base", "2021-01-01 09:00:00+00:00", false);
    });
  });
  context("DiscoverTemplates test", () => {
    it("Can visit the page", () => {
      cy.viewport(1920, 1080);
      cy.visit("/templates");
    });

    testGrid("Most cloned", "[test-most-cloned-grid]", 2);
    testGrid("Largest templates", "[test-largest-templates-grid]", 2);
    testGrid("Top gainers", "[test-top-gainers-grid]", 1);

    context("Can navigate to other pages", () => {
      afterEach(() => {
        cy.visit("/templates");
      });

      it("can go to custom pool creation", () => {
        cy.get("[test-discover-templates-header]")
          .find("[test-base-button]")
          .trigger("click");
        cy.location("pathname").should("eq", "/custom-pool-creation");
      });

      it("can go to 'liquidity-provider' page", () => {
        cy.get("[test-inner-nav]")
          .find("[test-route-link='liquidity-provider']")
          .trigger("click");
        cy.location("pathname").should(
          "eq",
          "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
        );
      });

      it("can go to a specific template page", () => {
        cy.get("[test-pool-template-card]")
          .first()
          .find("[test-card-navigate-button]")
          .trigger("click");
        cy.location("pathname").should(
          "eq",
          "/templates/0x0a34bd0b829d81135128d14a0b65358c8508c2023fb907ba019bf4c4a35dfe920x0d95b2829bc12ab0b1b387503653642784e8a316fda60f2200a8cf98c4f157ee"
        );
      });
    });
  });
});
