import PutOptionsTable from "./PutOptionsTable.vue";

describe("PutOptionsTable.cy.ts", () => {
  const headings = ["Column1", "Column2", "Column3", "Column4"];
  const dataset = [
    [
      { value: "Value1" },
      { value: 7 },
      { value: "Value3" },
      { button: true, color: "primary", label: "claim", claimable: true },
    ],
    [
      { value: "Value2" },
      { value: 14 },
      { value: "Value7" },
      { button: true, color: "primary", label: "claim", claimable: false },
    ],
    [
      { value: "Value2" },
      { value: 21 },
      { value: "Value8" },
      { button: true, color: "primary", label: "claim", claimable: false },
    ],
    [
      { value: "Value4" },
      { value: 28 },
      { value: "Value9" },
      { button: true, color: "primary", label: "claim", claimable: true },
    ],
  ];
  it("renders", () => {
    cy.mount(PutOptionsTable, {
      props: {
        headings,
        dataset,
      },
    });
    cy.get("tr").should("have.length", dataset.length);
    cy.get("th").should("have.length", headings.length);
  });
  it("emit events", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(PutOptionsTable, {
      props: {
        headings,
        dataset,
        onClick: onClickSpy,
      },
    });
    cy.get("[test-table-claim-button]").each(($el) => {
      if ($el.is(":disabled")) {
        return;
      } else {
        cy.wrap($el).should("be.enabled").click();
        cy.get("@onClickSpy").should("have.been.called");
      }
    });
  });
});
