/// <reference types="cypress" />

import JumboHeader from "./JumboHeader.vue";
import { SrcsetEnum } from "dapp-types";

describe("JumboHeader", () => {
  context("renders properly", () => {
    beforeEach(() => {
      const props = {
        title: "Hello World",
        subtitle: "Lorem Ipsum",
        ctaLabel: "Dolor sit amet",
        iconSrcset: new Map([
          [SrcsetEnum["AVIF"], "/icons/atom.avif"],
          [SrcsetEnum["WEBP"], "/icons/atom.webp"],
          [SrcsetEnum["PNG"], "/icons/atom.png"],
        ]),
      };
      const slots = {
        default: () => "Slot text",
      };
      cy.mount(JumboHeader, { props, slots });
    });

    it("has the correct title", () => {
      cy.get("[test-jumbo-header-title]")
        .should("be.visible")
        .and("contain.text", "Hello World");
    });

    it("has the correct subtitle", () => {
      cy.get("[test-jumbo-header-subtitle]")
        .should("be.visible")
        .and("contain.text", "Lorem Ipsum");
    });

    it("has the cta button", () => {
      cy.get("[test-card-cta]")
        .should("be.visible")
        .and("contain.text", "Dolor sit amet");
    });

    it("has the icon", () => {
      cy.get("[test-jumbo-header-icon]").should("be.visible");
      cy.get("[test-jumbo-header-icon] img").should(
        "have.attr",
        "src",
        "/icons/atom.png"
      );
    });

    // There seems to be a bug with vue-test-utils so the slots are not loaded correctly
    it.skip("renders slots correctly", () => {
      cy.get("[test-jumbo-header-slot]")
        .should("be.visible")
        .and("contain.text", "Slot text");
    });
  });
});
