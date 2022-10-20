import { Address, log } from "@graphprotocol/graph-ts";
import {
  ActionsAdded,
  VaultPositionEntered,
  VaultPositionExited,
  InvestmentVault,
} from "../generated/InvestmentVault/InvestmentVault";
import { HedgingVault } from "../generated/schema";
import { getOrCreateToken } from "./token";
import { setVault } from "./potionBuyAction";

function createHedgingVault(id: Address): HedgingVault {
  const contract = InvestmentVault.bind(id);
  const vault = new HedgingVault(id);
  getOrCreateToken(contract.asset());
  getOrCreateToken(id);
  vault.asset = contract.asset();
  vault.totalAssets = contract.totalAssets();
  vault.shareToken = id;
  vault.save();
  return vault;
}

function getHedgingVault(id: Address): HedgingVault {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    log.error("vault address {} doesn't exists", [id.toHexString()]);
  }
  return vault as HedgingVault;
}

function getOrCreateHedgingVault(id: Address): HedgingVault {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    return createHedgingVault(id);
  }
  return vault;
}

function setAction(id: Address, action: Address): void {
  const vault = getOrCreateHedgingVault(id);
  vault.action = action;
  vault.save();
}

export function handleActionsAdded(event: ActionsAdded): void {
  setAction(event.address, event.params.actions[0]);
  setVault(event.params.actions[0], event.address);
  log.info("PotionBuyAction {} added to vault {}", [
    event.params.actions[0].toHexString(),
    event.address.toHexString(),
  ]);
}

export function handleVaultPositionEntered(event: VaultPositionEntered): void {
  const vault = getHedgingVault(event.address);
  log.info("address(), principalAmountInvested {}, totalPrincipalAmount {}", [
    vault.id.toHexString(),
    event.params.principalAmountInvested.toString(),
    event.params.totalPrincipalAmount.toString(),
  ]);
}
export function handleVaultPositionExited(event: VaultPositionExited): void {
  const vault = getHedgingVault(event.address);
  log.info("address {}, newPrincipalAmount {}", [
    vault.id.toHexString(),
    event.params.newPrincipalAmount.toString(),
  ]);
}
