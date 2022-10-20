import { Address, log } from "@graphprotocol/graph-ts";
import {
  PotionBuyAction as ActionContract,
  CycleDurationChanged,
  MaxPremiumPercentageChanged,
  MaxSwapDurationChanged,
  PremiumSlippageChanged,
  StrikePercentageChanged,
  SwapSlippageChanged,
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

function handleMaxPremiumPercentageChanged(
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

function handleCycleDurationChanged(event: CycleDurationChanged): void {
  const action = getOrCreateAction(event.address);
  action.cycleDurationSecs = event.params.cycleDurationSecs;
  action.save();
  log.info("changed cycleDurationSecs of action {} to {}", [
    event.address.toHexString(),
    event.params.cycleDurationSecs.toString(),
  ]);
}

function handleMaxSwapDurationChanged(event: MaxSwapDurationChanged): void {
  const action = getOrCreateAction(event.address);
  action.maxSwapDurationSecs = event.params.maxSwapDurationSecs;
  action.save();
  log.info("changed maxSwapDurationSecs of action {} to {}", [
    event.address.toHexString(),
    event.params.maxSwapDurationSecs.toString(),
  ]);
}

function handlePremiumSlippageChanged(event: PremiumSlippageChanged): void {
  const action = getOrCreateAction(event.address);
  action.premiumSlippage = event.params.premiumSlippage;
  action.save();
  log.info("changed premiumSlippage of action {} to {}", [
    event.address.toHexString(),
    event.params.premiumSlippage.toString(),
  ]);
}

function handleStrikePercentageChanged(event: StrikePercentageChanged): void {
  const action = getOrCreateAction(event.address);
  action.strikePercentage = event.params.strikePercentage;
  action.save();
  log.info("changed strikePercentage of action {} to {}", [
    event.address.toHexString(),
    event.params.strikePercentage.toString(),
  ]);
}

function handleSwapSlippageChanged(event: SwapSlippageChanged): void {
  const action = getOrCreateAction(event.address);
  action.swapSlippage = event.params.swapSlippage;
  action.save();
  log.info("changed swapSlippage of action {} to {}", [
    event.address.toHexString(),
    event.params.swapSlippage.toString(),
  ]);
}

export {
  handleCycleDurationChanged,
  handleMaxPremiumPercentageChanged,
  handleMaxSwapDurationChanged,
  handlePremiumSlippageChanged,
  handleStrikePercentageChanged,
  handleSwapSlippageChanged,
};
