import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { assert } from "matchstick-as/assembly/index";
import {
  DepositRequest,
  HedgingVault,
  PotionBuyAction,
  Round,
  WithdrawalRequest,
} from "../generated/schema";
import { createRoundId } from "../src/rounds";
import { createDepositRequestId } from "../src/deposits";
import { createWithdrawalRequestId } from "../src/withdrawals";

class FieldValuePair {
  field: string;
  value: string;
}

class DepositRequestParams {
  depositId: BigInt;
  amount: BigInt;
  amountRedeemed: BigInt;
  remainingShares: BigInt;
  shares: BigInt;
}

class WithdrawalRequestParams {
  depositId: BigInt;
  amount: BigInt;
  amountRedeemed: BigInt;
  remainingAssets: BigInt;
  assets: BigInt;
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
  cycleDurationSecs: BigInt,
  hedgingRate: BigInt
): PotionBuyAction {
  const action = new PotionBuyAction(id);
  action.nextCycleStartTimestamp = nextCycleStartTimestamp;
  action.swapSlippage = swapSlippage;
  action.premiumSlippage = premiumSlippage;
  action.maxPremiumPercentage = maxPremiumPercentage;
  action.maxSwapDurationSecs = maxSwapDurationSecs;
  action.strikePercentage = strikePercentage;
  action.cycleDurationSecs = cycleDurationSecs;
  action.hedgingRate = hedgingRate;
  action.save();
  return action;
}

function mockRound(
  roundNumber: BigInt,
  vault: Bytes,
  depositRequests: Bytes[] = [],
  withdrawalRequests: Bytes[] = [],
  exchangeRate: BigInt = BigInt.fromString("0")
): Round {
  const id = createRoundId(roundNumber, vault);
  const round = new Round(id);
  round.vault = vault;
  round.roundNumber = roundNumber;
  round.depositRequests = depositRequests;
  round.withdrawalRequests = withdrawalRequests;
  round.exchangeRate = exchangeRate;
  round.save();
  return round;
}

function mockDepositRequest(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: DepositRequestParams,
  block: Bytes,
  tx: Bytes
): DepositRequest {
  const id = createDepositRequestId(params.depositId, vaultAddress, investor);
  const depositRequest = new DepositRequest(id);
  depositRequest.round = round;
  depositRequest.investor = investor;
  depositRequest.sender = sender;
  depositRequest.amount = params.amount;
  depositRequest.amountRedeemed = params.amountRedeemed;
  depositRequest.shares = params.shares;
  depositRequest.remainingShares = params.remainingShares;
  depositRequest.block = block;
  depositRequest.tx = tx;
  depositRequest.save();
  return depositRequest;
}

function mockDepositRequests(
  round: Bytes,
  vaultAddress: Address,
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
      vaultAddress,
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

function mockWithdrawalRequest(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: WithdrawalRequestParams,
  block: Bytes,
  tx: Bytes
): WithdrawalRequest {
  const id = createWithdrawalRequestId(
    params.depositId,
    vaultAddress,
    investor
  );
  const withdrawalRequest = new WithdrawalRequest(id);
  withdrawalRequest.round = round;
  withdrawalRequest.investor = investor;
  withdrawalRequest.sender = sender;
  withdrawalRequest.amount = params.amount;
  withdrawalRequest.amountRedeemed = params.amountRedeemed;
  withdrawalRequest.assets = params.assets;
  withdrawalRequest.remainingAssets = params.remainingAssets;
  withdrawalRequest.block = block;
  withdrawalRequest.tx = tx;
  withdrawalRequest.save();
  return withdrawalRequest;
}

function mockWithdrawalRequests(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: WithdrawalRequestParams[],
  block: Bytes,
  tx: Bytes
): WithdrawalRequest[] {
  const result: WithdrawalRequest[] = [];
  for (let i = 0; i < params.length; i += 1) {
    const withdrawalRequest = mockWithdrawalRequest(
      round,
      vaultAddress,
      investor,
      sender,
      params[i],
      block,
      tx
    );
    result.push(withdrawalRequest);
  }
  return result;
}

function arrayToString(array: string[]): string {
  return "[" + array.join(", ") + "]";
}

export {
  assertEntity,
  mockHedgingVault,
  mockPotionBuyAction,
  mockRound,
  mockDepositRequest,
  mockDepositRequests,
  DepositRequestParams,
  mockWithdrawalRequest,
  mockWithdrawalRequests,
  WithdrawalRequestParams,
  arrayToString,
};