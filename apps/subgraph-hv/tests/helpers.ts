import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { assert } from "matchstick-as/assembly/index";
import {
  DepositRequest,
  HedgingVault,
  PotionBuyAction,
  Round,
} from "../generated/schema";
import { createRoundId } from "../src/rounds";
import { createDepositRequestId } from "../src/deposits";

class FieldValuePair {
  field: string;
  value: string;
}

class DepositRequestParams {
  depositId: BigInt;
  amount: BigInt;
  amountRedeemed: BigInt;
  remainingShares: BigInt;
}

function assertEntity(
  entity: string,
  id: string,
  values: FieldValuePair[]
): void {
  for (let i = 0; i < values.length; i += 1) {
    assert.fieldEquals(entity, id, values[i].field, values[i].value);
  }
}

function mockHedgingVault(
  id: Address,
  action: Address,
  asset: Address,
  totalAssets: BigInt,
  currentRound: BigInt
): HedgingVault {
  const vault = new HedgingVault(id);
  vault.shareToken = id;
  vault.asset = asset;
  vault.action = action;
  vault.totalAssets = totalAssets;
  vault.currentRound = currentRound;
  vault.save();
  return vault;
}

function mockPotionBuyAction(
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

function mockRound(roundNumber: BigInt, vault: Bytes): Round {
  const id = createRoundId(roundNumber, vault);
  const round = new Round(id);
  round.vault = vault;
  round.roundNumber = roundNumber;
  round.save();
  return round;
}

function mockDepositRequest(
  round: Bytes,
  investor: Address,
  sender: Address,
  params: DepositRequestParams,
  block: Bytes,
  tx: Bytes
): DepositRequest {
  const id = createDepositRequestId(params.depositId, investor);
  const depositRequest = new DepositRequest(id);
  depositRequest.round = round;
  depositRequest.investor = investor;
  depositRequest.sender = sender;
  depositRequest.amount = params.amount;
  depositRequest.amountRedeemed = params.amountRedeemed;
  depositRequest.remainingShares = params.remainingShares;
  depositRequest.block = block;
  depositRequest.tx = tx;
  depositRequest.save();
  return depositRequest;
}

function mockDepositRequests(
  round: Bytes,
  investor: Address,
  sender: Address,
  params: DepositRequestParams[],
  block: Bytes,
  tx: Bytes
): DepositRequest[] {
  const result: DepositRequest[] = [];
  for (let i = 0; i < params.length; i += 1) {
    const depositRequest = mockDepositRequest(
      round,
      investor,
      sender,
      params[i],
      block,
      tx
    );
    result.push(depositRequest);
  }
  return result;
}

export {
  assertEntity,
  mockHedgingVault,
  mockPotionBuyAction,
  mockRound,
  mockDepositRequest,
  mockDepositRequests,
  DepositRequestParams,
};
