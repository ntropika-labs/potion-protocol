import TokenSelection from "./TokenSelection.vue";

describe("TokenSelection.cy.ts", () => {
  const defProps = {
    tokens: [
      {
        name: "Hello Vitest",
        address: "0xMOCKED",
        symbol: "MOCKED",
        image: "https://mocked.com/placeholder.png",
        selected: false,
      },
      {
        name: "Hello Vitest 2",
        address: "0xMOCKED2",
        symbol: "MOCKED2",
        image: "https://mocked.com/placeholder.png",
        selected: true,
      },
    ],
    onTokenSelected: {},
  };
  it("renders an empty token selection properly", () => {
    cy.mount(TokenSelection);
  });
  it("renders with tokens", () => {
    cy.mount(TokenSelection, { props: defProps });
    cy.get("[test-token-card]").should("have.length", 2);
  });
  it("emits events when clicked", () => {
    const onTokenSelectedSpy = cy.spy().as("onTokenSelectedSpy");
    defProps.onTokenSelected = onTokenSelectedSpy;
    cy.mount(TokenSelection, { props: defProps });
    cy.get("[test-token-card]").each(($el, index) => {
      cy.wrap($el).click();
      cy.get("@onTokenSelectedSpy").should(
        "have.been.calledWith",
        defProps.tokens[index].address
      );
    });
  });
});
