import TabItem from "./TabItem.vue";

describe("TabItem.cy.ts", () => {
  it("is visible", () => {
    cy.mount(TabItem);
    cy.get("[test-tab-item]").should("be.visible");
  });
  it.skip("renders the default slot", () => {
    const slots = {
      default: () => "Slot text",
    };
    cy.mount(TabItem, { slots });
    cy.get("[test-tab-item]")
      .should("be.visible")
      .and("contain.text", "Slot text");
  });
  it("emits an event when clicked", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    const props = { onClick: onClickSpy };

    cy.mount(TabItem, { props });
    cy.get("[test-tab-item]").click();
    cy.get("@onClickSpy");
  });
});
