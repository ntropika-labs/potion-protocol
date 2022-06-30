import PoolTemplateCard from "./PoolTemplateCard.vue";

describe("PoolTemplateCard.cy.ts", () => {
  const tokens = [
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
  ];

  const defProps = {
    creator: {
      label: "0xd34d...b33f",
      link: "/link-to-creator",
    },
    tokens: tokens,
    totalSize: "599000000",
    currencySymbol: "USDC",
    timesCloned: "10",
    totalPnl: "60",
    pnlTrend: "up",
    templateId: "1337",
    onClick: {},
  };
  it("renders correctly", () => {
    cy.mount(PoolTemplateCard, { props: defProps });
  });

  it("emits an event when clicked", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    defProps.onClick = onClickSpy;

    cy.mount(PoolTemplateCard, {
      props: defProps,
    });

    cy.get("[test-card-navigate-button]").click();
    cy.get("@onClickSpy");
  });
});
