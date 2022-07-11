import BaseButton from "./BaseButton.vue";

describe("BaseButton.cy.ts", () => {
  it("renders correctly", () => {
    cy.mount(BaseButton, { props: { label: "Hello Vitest" } });
  });
  it("disables itself if prop is passed", () => {
    cy.mount(BaseButton, { props: { label: "disablooor", disabled: true } });
    cy.get("button").should("be.visible").and("be.disabled");
  });
  it("emits an event when clicked", () => {
    const onClickSpy = cy.spy().as("onClickSpy");

    cy.mount(BaseButton, {
      props: { label: "clickooor", onClick: onClickSpy },
    });

    cy.get("button").click();
    cy.get("@onClickSpy");
  });
});
