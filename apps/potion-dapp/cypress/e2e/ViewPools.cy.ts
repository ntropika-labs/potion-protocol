/// <reference types="cypress" />
/// <reference types="../support" />

describe("ViewPools", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-view-pools", "2021-01-01 09:00:00+00:00", false);
    });
  });
  context("ViewPools test", () => {
    it("Can visit the page", () => {
      cy.viewport(1920, 1080);
      cy.visit(
        "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
      );
    });

    context("Header is rendered correctly", () => {
      it("shows the correct number of pools", () => {
        cy.get("[test-total-pools]")
          .should("be.visible")
          .and("contain.text", "1");
      });
      it("shows the correct average PnL", () => {
        cy.get("[test-average-pnl]")
          .should("be.visible")
          .and("contain.text", "45.213");
      });
      it("shows the correct total liquidity", () => {
        cy.get("[test-total-liquidity]")
          .should("be.visible")
          .and("contain.text", "917.3K");
      });
    });

    context("Pools grid is rendered correctly", () => {
      it("shows the 'to-custom-pool-creation' card", () => {
        cy.get("[test-to-custom-pool-creation-card]").should("be.visible");
      });

      it("shows the pools", () => {
        cy.get("[test-pool-card]").should("be.visible").and("have.length", 1);
      });
    });

    context("Can navigate to other pages", () => {
      afterEach(() => {
        cy.visit(
          "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
        );
      });

      it("go to the custom-pool-creation page pressing the card", () => {
        cy.get("[test-to-custom-pool-creation-card]").trigger("click");
        cy.location("pathname").should("eq", "/custom-pool-creation");
      });

      it("can go to 'discover-templates' page", () => {
        cy.get("[test-inner-nav]")
          .find("[test-route-link='discover-templates']")
          .trigger("click");
        cy.location("pathname").should("eq", "/templates");
      });

      it("can go to a specific pool page", () => {
        cy.get("[test-pool-card]")
          .find("[test-pool-card-button]")
          .trigger("click");
        cy.location("pathname").should(
          "eq",
          "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/0"
        );
      });
    });
  });
});
