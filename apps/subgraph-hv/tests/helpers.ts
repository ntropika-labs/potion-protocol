import { Address, BigInt } from "@graphprotocol/graph-ts";
import { assert } from "matchstick-as/assembly/index";
import { HedgingVault, PotionBuyAction } from "../generated/schema";

class FieldValuePair {
  field: string;
  value: string;
}

export function assertEntity(
  entity: string,
  id: string,
  values: FieldValuePair[]
): void {
  for (let i = 0; i < values.length; i += 1) {
    assert.fieldEquals(entity, id, values[i].field, values[i].value);
  }
}

export function mockHedgingVault(
  id: Address,
  action: Address,
  asset: Address,
  totalAssets: BigInt
): HedgingVault {
  const vault = new HedgingVault(id);
  vault.shareToken = id;
  vault.asset = asset;
  vault.action = action;
  vault.totalAssets = totalAssets;
  vault.save();
  return vault;
}

export function mockPotionBuyAction(
  id: Address,
  nextCycleStartTimestamp: BigInt,
  swapSlippage: BigInt,
  premiumSlippage: BigInt,
  maxPremiumPercentage: BigInt,
  maxSwapDurationSecs: BigInt,
  strikePercentage: BigInt,
  cycleDurationSecs: BigInt
): PotionBuyAction {
  const action = new PotionBuyAction(id);
  action.nextCycleStartTimestamp = nextCycleStartTimestamp;
  action.swapSlippage = swapSlippage;
  action.premiumSlippage = premiumSlippage;
  action.maxPremiumPercentage = maxPremiumPercentage;
  action.maxSwapDurationSecs = maxSwapDurationSecs;
  action.strikePercentage = strikePercentage;
  action.cycleDurationSecs = cycleDurationSecs;
  action.save();
  return action;
}
