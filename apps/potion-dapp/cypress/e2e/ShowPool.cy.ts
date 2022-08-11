/// <reference types="cypress" />
/// <reference types="../support" />

import { aliasQuery, resetApproval } from "../support/utilities";

describe.skip("Show Pool Flow", () => {
  context("environment setup", () => {
    it("relods the blockchain with the correct database and date", () => {
      cy.seed("/opt/e2e-show-pool", "2022-02-01 09:00:00+00:00");
    });
    it("can reset the approval", async () => {
      await resetApproval();
    });
  });

  context("showPool test", () => {
    beforeEach(() => {
      cy.intercept(
        "POST",
        "http://localhost:8000/subgraphs/name/potion-subgraph",
        (req) => {
          aliasQuery(req, "getPoolById");
        }
      ).as("getDataFromSubgraph");
    });

    it("Can visit the pool page", () => {
      cy.viewport(1920, 1080);
      cy.visit(
        "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/1"
      );
      cy.wait("@getPoolById", {
        timeout: 20000,
      }).then((interceptor) => {
        const response = interceptor?.response.body;

        // assert that the subgraph send us the correct pool data
        expect(response).to.haveOwnProperty("data");
        expect(response.data).to.haveOwnProperty("pool");
        expect(response.data.pool.id).to.equal(
          "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660x1"
        );
      });
    });

    context("withdraw/deposit", () => {
      it("Can switch between tabs", () => {
        cy.get("[test-liquidity-card-header]>button").each(($el) => {
          cy.wrap($el).trigger("click");
        });
      });

      it("Can withdraw", () => {
        cy.get("[test-liquidity-card-header]>button").first().click();

        let expectedLiquidityNumber = -1;
        cy.get("[test-liquidity-card-total-liquidity]")
          .first()
          .then(($el) => {
            expectedLiquidityNumber = parseFloat($el.text().slice(1)) - 101;
          })
          .then(() => {
            cy.get("[test-liquidity-card-withdraw] input").clear().type("101");

            cy.get("[test-liquidity-card-footer-withdraw]>button")
              .first()
              .trigger("click");

            cy.get("[test-liquidity-card-total-liquidity]")
              .first()
              .contains("$" + expectedLiquidityNumber);
          });
        cy.get(":nth-child(2) > .grid > .col-span-3 > .text-sm");
      });

      it("Can set approval", () => {
        cy.get("[test-liquidity-card-header]>button").last().click();
        cy.wait(200);

        cy.get("[test-liquidity-card-footer-deposit]>button").click();
        //cy.wait(200);
        cy.get("[test-liquidity-card-footer-deposit]>button", {
          timeout: 10000,
        }).should("not.be.disabled");

        cy.get(":nth-child(2) > .grid");
      });

      it("Can deposit", () => {
        cy.get("[test-liquidity-card-header]>button").last().click();
        cy.wait(200);

        let expectedLiquidityNumber = -1;
        cy.get("[test-liquidity-card-total-liquidity]")
          .first()
          .then(($el) => {
            expectedLiquidityNumber = parseFloat($el.text().slice(1)) + 101;
          })
          .then(() => {
            cy.get("[test-liquidity-card-deposit] input").clear().type("101");
            cy.get("[test-liquidity-card-footer-deposit]>button")
              .first()
              .trigger("click");
            cy.wait(200);
            cy.get("#toast-wrap > :nth-child(2) > .grid");
            cy.wait(200);
            cy.get("[test-liquidity-card-total-liquidity]")
              .first()
              .contains("$" + expectedLiquidityNumber);
          });
      });
    });

    context("active put options", () => {
      it("Can switch to active options", () => {
        cy.get("[test-claim-table-active-tab-switch]").click();
      });
      it("Shows the put options table", () => {
        cy.get("[test-claim-table-active-options]").should("be.visible");
      });

      it("Shows the active option correctly", () => {
        cy.get("[test-claim-table-active-options]")
          .find("tbody > tr:nth-child(1)")
          .as("option");
        cy.get("@option")
          .find("td:nth-child(1)")
          .should("contain.text", "WETH");
        cy.get("@option")
          .find("td:nth-child(2)")
          .should("contain.text", "Feb 2, 2022");
        cy.get("@option")
          .find("td:nth-child(3)")
          .should("contain.text", "USDC 202.7");
        cy.get("@option")
          .find("td:nth-child(4)")
          .should("contain.text", "USDC 100.0");
        cy.get("@option")
          .find("td:nth-child(5)")
          .should("contain.text", "USDC 1.36K");
        cy.get("@option")
          .find("td:nth-child(6)")
          .should("contain.text", "+ 14.95%");
      });
    });

    context("expired put options", () => {
      it("Can switch to expired options", () => {
        cy.get("[test-claim-table-expired-tab-switch]").click();
      });

      context("Renders correctly", () => {
        it("Shows the put options table", () => {
          cy.get("[test-claim-table-expired-options]").should("be.visible");
        });
        it("Shows the correct filters", () => {
          cy.get("[test-claim-table-toggle-all-button]")
            .should("be.visible")
            .and("have.class", "bg-transparent");
          cy.get("[test-claim-table-toggle-asset-button]").should(
            "have.length",
            6
          );
        });

        it("Shows the not settled option correctly", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(1)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(1)")
            .should("contain.text", "WETH");
          cy.get("@option")
            .find("td:nth-child(2)")
            .should("contain.text", "Jan 2, 2021");
          cy.get("@option")
            .find("td:nth-child(3)")
            .should("contain.text", "USDC 10.01K");
          cy.get("@option")
            .find("td:nth-child(4)")
            .should("contain.text", "USDC 1.0K");
          cy.get("@option")
            .find("td:nth-child(5)")
            .should("contain.text", "USDC 100.0K");
          cy.get("@option").find("td:nth-child(6)").should("contain.text", "0");
          cy.get("@option")
            .find("td:nth-child(7)")
            .should("contain.text", "+ 10.01%");
          cy.get("@option")
            .find("td:nth-child(8) > [test-table-claim-button]")
            .should("be.visible")
            .and("contain.text", "claim");
        });

        it("Shows the settled option correctly", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(2)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(1)")
            .should("contain.text", "WETH");
          cy.get("@option")
            .find("td:nth-child(2)")
            .should("contain.text", "Jan 2, 2022");
          cy.get("@option")
            .find("td:nth-child(3)")
            .should("contain.text", "USDC 1.46K");
          cy.get("@option")
            .find("td:nth-child(4)")
            .should("contain.text", "USDC 1.1K");
          cy.get("@option")
            .find("td:nth-child(5)")
            .should("contain.text", "USDC 9.55K");
          cy.get("@option").find("td:nth-child(6)").should("contain.text", "0");
          cy.get("@option")
            .find("td:nth-child(7)")
            .should("contain.text", "+ 19.10%");
          cy.get("@option")
            .find("td:nth-child(8) > [test-table-claim-button]")
            .should("be.visible")
            .and("contain.text", "claim");
        });
      });

      context("Claiming options", () => {
        it("Can claim the not settled option", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(1)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(8) > [test-table-claim-button]")
            .as("button");
          cy.get("@button").click();
          cy.get("@option").find("td:nth-child(5)").should("contain.text", "0");
          cy.get("@option")
            .find("td:nth-child(6)")
            .should("contain.text", "USDC 100.0K");
          cy.get("@button").should("be.visible").and("contain.text", "Claimed");
        });

        it("Can claim the settled option", () => {
          cy.get("[test-claim-table-expired-options]")
            .find("tbody > tr:nth-child(2)")
            .as("option");
          cy.get("@option")
            .find("td:nth-child(8) > [test-table-claim-button]")
            .as("button");
          cy.get("@button").click();
          cy.get("@option").find("td:nth-child(5)").should("contain.text", "0");
          cy.get("@option")
            .find("td:nth-child(6)")
            .should("contain.text", "USDC 9.55K");
          cy.get("@button").should("be.visible").and("contain.text", "Claimed");
        });
      });
    });
  });
});
