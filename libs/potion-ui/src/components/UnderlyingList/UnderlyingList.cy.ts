import UnderlyingList from "./UnderlyingList.vue";

describe("UnderlyingList.cy.ts", () => {
  const defProps = {
    assetsFlat: [
      {
        name: "Hello Vitest",
        address: "0xMOCKED",
        symbol: "MOCKED",
        image: "https://mocked.com/placeholder.png",
        id: "1",
        isPut: false,
        duration: "101",
        strike: "46",
      },
      {
        name: "Hello Vitest 2",
        address: "0xMOCKED2",
        symbol: "MOCKED2",
        image: "https://mocked.com/placeholder.png",
        id: "2",
        isPut: false,
        duration: "102",
        strike: "47",
      },
    ],
    priceMap: new Map([
      ["0xMOCKED", "1001"],
      ["0xMOCKED2", "1002"],
    ]),
    stableCoinCollateral: "COLLATERAL",
  };
  it("renders with proper data", () => {
    cy.mount(UnderlyingList, { props: defProps });

    cy.get(
      ":nth-child(1) > :nth-child(1) > .grid > :nth-child(1) > .flex > .text-dwhite-300"
    ).contains("MOCKED");
    cy.get(
      ":nth-child(1) > :nth-child(1) > .grid > :nth-child(2) > .flex > .font-bold > :nth-child(1)"
    ).contains("1.001K");
    cy.get(
      ":nth-child(1) > :nth-child(1) > .grid > :nth-child(3) > .flex > .font-bold > :nth-child(1)"
    ).contains("46");
    cy.get(
      ":nth-child(1) > :nth-child(1) > .grid > :nth-child(4) > .flex > .font-bold > :nth-child(1)"
    ).contains("101");

    cy.get(
      ":nth-child(2) > :nth-child(1) > .grid > :nth-child(1) > .flex > .text-dwhite-300"
    ).contains("MOCKED2");
    cy.get(
      ":nth-child(2) > :nth-child(1) > .grid > :nth-child(2) > .flex > .font-bold > :nth-child(1)"
    ).contains("1.002K");
    cy.get(
      ":nth-child(2) > :nth-child(1) > .grid > :nth-child(3) > .flex > .font-bold > :nth-child(1)"
    ).contains("47");
    cy.get(
      ":nth-child(2) > :nth-child(1) > .grid > :nth-child(4) > .flex > .font-bold > :nth-child(1)"
    ).contains("102");
  });
});
