import { Deployments } from "@potion-protocol/hedging-vault";
import multivault from "../../multivault.json";
import { ethereumNetwork } from "./";

//@ts-expect-error iterator is not defined
export const contractsAddresses = Deployments[ethereumNetwork].contracts;

export function getPotionBuyActionFromVault(vault: string) {
  const data = multivault.find(
    (mv) => mv.InvestmentVault.toLowerCase() === vault.toLowerCase()
  );
  if (data) {
    return data.PotionBuyAction;
  }
  throw `${vault} isn't a recognized vault`;
}
