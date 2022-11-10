import multivault from "../../multivault.json";

function getContractsFromVault(vault: string) {
  const data = multivault.find(
    (mv) => mv.InvestmentVault.toLowerCase() === vault.toLowerCase()
  );
  if (data) {
    return data;
  }
  throw `${vault} isn't a recognized vault`;
}
function getPotionBuyActionFromVault(vault: string) {
  const data = getContractsFromVault(vault);
  return data.PotionBuyAction;
}

function getRoundsInputFromVault(vault: string) {
  const data = getContractsFromVault(vault);
  return data.RoundsInputVault;
}

function getRoundsExchangerFromVault(vault: string) {
  const data = getContractsFromVault(vault);
  return data.RoundsVaultExchanger;
}

function getRoundsOutputFromVault(vault: string) {
  const data = getContractsFromVault(vault);
  return data.RoundsOutputVault;
}

export {
  getPotionBuyActionFromVault,
  getRoundsExchangerFromVault,
  getRoundsInputFromVault,
  getRoundsOutputFromVault,
  getContractsFromVault,
};
