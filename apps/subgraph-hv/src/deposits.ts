import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Deposit, DepositRequest } from "../generated/schema";

function createDeposit(
  round: string,
  amount: BigInt,
  shareAmount: BigInt,
  block: Bytes,
  tx: Bytes
): Deposit {
  const deposit = new Deposit(round);
  deposit.round = round;
  deposit.amount = amount;
  deposit.shareAmount = shareAmount;
  deposit.block = block;
  deposit.tx = tx;
  deposit.save();
  return deposit;
}

function createDepositRequest(
  round: string,
  investor: Address,
  sender: Address,
  amount: BigInt,
  amountRedeemed: BigInt,
  remainingShares: BigInt,
  block: Bytes,
  tx: Bytes
): DepositRequest {
  const id = investor.toHexString().concat(round);
  const depositRequest = new DepositRequest(id);
  depositRequest.round = round;
  depositRequest.investor = investor;
  depositRequest.sender = sender;
  depositRequest.amount = amount;
  depositRequest.amountRedeemed = amountRedeemed;
  depositRequest.remainingShares = remainingShares;
  depositRequest.block = block;
  depositRequest.tx = tx;
  depositRequest.save();
  return depositRequest;
}

export { createDeposit, createDepositRequest };
