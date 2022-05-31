/// <reference types="cypress" />

describe("Edit Pool Flow", () => {
  const alreadySelected: string[] = [];
  it("Can visit the edit page", () => {
    cy.viewport(1920, 1080);
    cy.visit(
      "/liquidity-provider/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/2/edit"
    );
  });

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
    cy.get("[test-token-card]")
      .then(($els) => {
        return $els.filter((index, element) => {
          console.log(index);
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
  });
  it("Can change the curve", () => {
    cy.get(".bg-radial-glass > :nth-child(1) > .w-full").clear().type("1");
    cy.get(".bg-radial-glass > :nth-child(2) > .w-full").clear().type("1.2");
    cy.get(".bg-radial-glass > :nth-child(3) > .w-full").clear().type("1.3");
    cy.get(".bg-radial-glass > :nth-child(4) > .w-full").clear().type("1.4");
    cy.get(":nth-child(5) > .w-full").clear().type("1");
  });
  it("Can edit the pool", () => {
    cy.get(".gap-3 > .before\\:content-none").click();
  });
});
