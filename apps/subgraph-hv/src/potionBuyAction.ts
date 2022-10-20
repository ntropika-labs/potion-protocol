import { Address, log } from "@graphprotocol/graph-ts";
import {
  PotionBuyAction as ActionContract,
  MaxPremiumPercentageChanged,
} from "../generated/PotionBuyAction/PotionBuyAction";
import { PotionBuyAction } from "../generated/schema";

function createAction(id: Address): PotionBuyAction {
  const contract = ActionContract.bind(id);
  const action = new PotionBuyAction(id);
  action.cycleDurationSecs = contract.cycleDurationSecs();
  action.maxPremiumPercentage = contract.maxPremiumPercentage();
  action.maxSwapDurationSecs = contract.maxSwapDurationSecs();
  action.nextCycleStartTimestamp = contract.nextCycleStartTimestamp();
  action.premiumSlippage = contract.premiumSlippage();
  action.strikePercentage = contract.strikePercentage();
  action.swapSlippage = contract.swapSlippage();
  action.save();
  return action;
}

function getOrCreateAction(id: Address): PotionBuyAction {
  const action = PotionBuyAction.load(id);
  if (action == null) {
    return createAction(id);
  }
  return action;
}

export function setVault(id: Address, vault: Address): void {
  const action = getOrCreateAction(id);
  action.vault = vault;
  action.save();
  log.info("set the vault of action {} to {}", [
    id.toHexString(),
    vault.toHexString(),
  ]);
}

export function handleMaxPremiumPercentageChanged(
  event: MaxPremiumPercentageChanged
): void {
  const action = getOrCreateAction(event.address);
  action.maxPremiumPercentage = event.params.maxPremiumPercentage;
  action.save();
  log.info("changed maxPremiumPercentage of action {} to {}", [
    event.address.toHexString(),
    event.params.maxPremiumPercentage.toString(),
  ]);
}
