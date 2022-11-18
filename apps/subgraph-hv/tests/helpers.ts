import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { assert } from "matchstick-as/assembly/index";
import {
  DepositTicket,
  HedgingVault,
  PotionBuyAction,
  Round,
  Token,
  WithdrawalTicket,
} from "../generated/schema";
import { createRoundId } from "../src/rounds";
import { createDepositTicketId } from "../src/deposits";
import { createWithdrawalTicketId } from "../src/withdrawals";

class FieldValuePair {
  field: string;
  value: string;
}

class DepositTicketParams {
  depositId: BigInt;
  amount: BigInt;
  amountRemaining: BigInt;
  amountRedeemed: BigInt;
  sharesRemaining: BigInt;
  sharesRedeemed: BigInt;
  shares: BigInt;
}

class WithdrawalTicketParams {
  depositId: BigInt;
  amount: BigInt;
  amountRemaining: BigInt;
  amountRedeemed: BigInt;
  underlyingsRemaining: BigInt;
  underlyingsRedeemed: BigInt;
  underlyings: BigInt;
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
  underlying: Address,
  totalShares: BigInt,
  currentRound: BigInt
): HedgingVault {
  const vault = new HedgingVault(id);
  vault.shareToken = id;
  vault.underlying = underlying;
  vault.action = action;
  vault.totalShares = totalShares;
  vault.currentRound = currentRound;
  vault.save();
  return vault;
}

function mockToken(
  id: Address,
  name: string,
  symbol: string,
  decimals: BigInt
): Token {
  const token = new Token(id);
  token.name = name;
  token.symbol = symbol;
  token.decimals = decimals;
  token.save();
  return token;
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
  depositTickets: Bytes[] = [],
  withdrawalTickets: Bytes[] = [],
  exchangeRate: BigInt = BigInt.fromString("0")
): Round {
  const id = createRoundId(roundNumber, vault);
  const round = new Round(id);
  round.vault = vault;
  round.roundNumber = roundNumber;
  round.depositTickets = depositTickets;
  round.withdrawalTickets = withdrawalTickets;
  round.underlyingToShareRate = exchangeRate;
  round.shareToUnderlyingRate = exchangeRate;
  round.save();
  return round;
}

function mockDepositTicket(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: DepositTicketParams,
  block: Bytes,
  tx: Bytes
): DepositTicket {
  const id = createDepositTicketId(params.depositId, vaultAddress, investor);
  const depositTicket = new DepositTicket(id);
  depositTicket.round = round;
  depositTicket.investor = investor;
  depositTicket.sender = sender;
  depositTicket.amount = params.amount;
  depositTicket.amountRemaining = params.amountRemaining;
  depositTicket.amountRedeemed = params.amountRedeemed;
  depositTicket.shares = params.shares;
  depositTicket.sharesRemaining = params.sharesRemaining;
  depositTicket.sharesRedeemed = params.sharesRedeemed;
  depositTicket.block = block;
  depositTicket.tx = tx;
  depositTicket.save();
  return depositTicket;
}

function mockDepositTickets(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: DepositTicketParams[],
  block: Bytes,
  tx: Bytes
): DepositTicket[] {
  const result: DepositTicket[] = [];
  for (let i = 0; i < params.length; i += 1) {
    const depositTicket = mockDepositTicket(
      round,
      vaultAddress,
      investor,
      sender,
      params[i],
      block,
      tx
    );
    result.push(depositTicket);
  }
  return result;
}

function mockWithdrawalTicket(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: WithdrawalTicketParams,
  block: Bytes,
  tx: Bytes
): WithdrawalTicket {
  const id = createWithdrawalTicketId(params.depositId, vaultAddress, investor);
  const withdrawalTicket = new WithdrawalTicket(id);
  withdrawalTicket.round = round;
  withdrawalTicket.investor = investor;
  withdrawalTicket.sender = sender;
  withdrawalTicket.amount = params.amount;
  withdrawalTicket.amountRemaining = params.amountRemaining;
  withdrawalTicket.amountRedeemed = params.amountRedeemed;
  withdrawalTicket.underlyings = params.underlyings;
  withdrawalTicket.underlyingsRemaining = params.underlyingsRemaining;
  withdrawalTicket.underlyingsRedeemed = params.underlyingsRedeemed;
  withdrawalTicket.block = block;
  withdrawalTicket.tx = tx;
  withdrawalTicket.save();
  return withdrawalTicket;
}

function mockWithdrawalTickets(
  round: Bytes,
  vaultAddress: Address,
  investor: Address,
  sender: Address,
  params: WithdrawalTicketParams[],
  block: Bytes,
  tx: Bytes
): WithdrawalTicket[] {
  const result: WithdrawalTicket[] = [];
  for (let i = 0; i < params.length; i += 1) {
    const withdrawalTicket = mockWithdrawalTicket(
      round,
      vaultAddress,
      investor,
      sender,
      params[i],
      block,
      tx
    );
    result.push(withdrawalTicket);
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
  mockDepositTicket,
  mockDepositTickets,
  DepositTicketParams,
  mockWithdrawalTicket,
  mockWithdrawalTickets,
  WithdrawalTicketParams,
  arrayToString,
  mockToken,
};
