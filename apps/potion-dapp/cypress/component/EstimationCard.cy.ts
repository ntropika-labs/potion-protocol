import EstimationCard from "../../src/components/HedgingVault/EstimationCard.vue";

describe("EstimationCard.cy.ts", () => {
  const underlyingSymbol = "WETH";
  const totalUnderlyingsAtRoundEnd = 100;
  const usdcBalanceActionContract = 100;
  const underlyingBalanceActionContract = 100;
  const underlyingPrice = 1;
  const strikePrice = 100;
  const potionsQuantity = 1;
  const investmentVaultContractShares = 1000;
  const depositTickets = [
    {
      id: 1,
      amount: 100,
      amountRedeemed: 50,
      shares: 100,
      remainingShares: 50,
    },
    {
      id: 2,
      amount: 10,
      amountRedeemed: 0,
      shares: 50,
      remainingShares: 13,
    },
    {
      id: 3,
      amount: 15,
      amountRedeemed: 0,
      shares: 35,
      remainingShares: 35,
    },
  ];
  it("renders correctly", () => {
    cy.mount(EstimationCard, {
      props: {
        underlyingSymbol: underlyingSymbol,
        totalUnderlyingsAtRoundEnd: totalUnderlyingsAtRoundEnd,
        usdcBalanceActionContract: usdcBalanceActionContract,
        underlyingBalanceActionContract: underlyingBalanceActionContract,
        underlyingPrice: underlyingPrice,
        strikePrice: strikePrice,
        potionsQuantity: potionsQuantity,
        investmentVaultContractShares: investmentVaultContractShares,
        depositTickets: depositTickets,
      },
    });
  });
});
