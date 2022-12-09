/// <reference types="cypress" />
/// <reference types="../support" />

function testGrid(title: string, identifier: string, potions: number) {
  context(title, () => {
    beforeEach(() => {
      cy.get(identifier).as("test-grid");
    });

    it("renders the grid correctly", () => {
      cy.get("@test-grid").should("be.visible");
    });

    it("renders the potions cards correctly", () => {
      cy.get("@test-grid")
        .find("[test-potion-card]")
        .should("have.length", potions);
    });

    it("shows the load more button", () => {
      cy.get("@test-grid").find("[test-load-more]").should("not.exist");
    });
  });
}

describe("DiscoverPotions", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-show-potion", "2021-01-01 09:00:00+00:00", false);
    });
  });

  context("DiscoverTemplates test", () => {
    it("Can visit the page", () => {
      cy.viewport(1920, 1080);
      cy.visit("/potions");
    });

    testGrid("Most Purchased", "[test-most-purchased-grid]", 1);
    testGrid("Most Collateralized", "[test-most-collateralized-grid]", 1);

    context("Can navigate to other pages", () => {
      afterEach(() => {
        cy.visit("/potions");
      });

      it("can go to custom potion creation", () => {
        cy.get("[test-discover-potions-header]")
          .find("[test-base-button]")
          .trigger("click");
        cy.location("pathname").should("eq", "/custom-potion-creation");
      });

      it("can go to 'buyer' page", () => {
        cy.get("[test-inner-nav]")
          .find("[test-route-link='buyer']")
          .trigger("click");
        cy.location("pathname").should(
          "eq",
          "/buyer/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
        );
      });

      it("can go to a specific potion page", () => {
        cy.get("[test-potion-card]")
          .first()
          .find("[test-card-navigate-button]")
          .trigger("click", { force: true });
        cy.location("pathname").should(
          "eq",
          "/potions/0xc4ce0963626822f2c3f8c166968346a8bf46af26"
        );
      });
    });
  });
});
