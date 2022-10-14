import { Deployments } from "@potion-protocol/hedging-vault";
import multivault from "@potion-protocol/hedging-vault/multivault.json";
import { ethereumNetwork } from "./";

//@ts-expect-error iterator is not defined
export const contractsAddresses = Deployments[ethereumNetwork].contracts;

// TODO: we will need to change the format to include also the contracts for deferred deposit and withdraw
export const multiVaultAddresses = [
  {
    vault: contractsAddresses.InvestmentVault.address.toLowerCase(),
    potionBuyAction: contractsAddresses.PotionBuyAction.address.toLowerCase(),
  },
].concat(multivault);

export function getPotionBuyActionFromVault(vault: string) {
  const data = multiVaultAddresses.find((mv) => mv.vault === vault);
  if (data) {
    return data.potionBuyAction;
  }
  throw `${vault} isn't a recognized vault`;
}
