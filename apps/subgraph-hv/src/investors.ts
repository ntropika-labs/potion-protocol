import { Address } from "@graphprotocol/graph-ts";
import { Investor } from "../generated/schema";
import { addItemToArray } from "./helpers";

function createInvestor(id: Address): Investor {
  const investor = new Investor(id);
  investor.vaults = [];
  investor.user = id;
  investor.save();
  return investor;
}

function getOrCreateInvestor(id: Address): Investor {
  const investor = Investor.load(id);
  if (investor == null) {
    return createInvestor(id);
  }
  return investor;
}

function addInvestorVault(id: Address, vault: Address): void {
  const investor = getOrCreateInvestor(id);
  if (investor.vaults.indexOf(vault) == -1) {
    investor.vaults = addItemToArray(investor.vaults, vault);
    investor.save();
  }
}

export { addInvestorVault, getOrCreateInvestor };
