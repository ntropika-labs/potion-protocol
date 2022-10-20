import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Withdrawal, WithdrawalRequest } from "../generated/schema";

function createWithdrawal(
  round: string,
  amount: BigInt,
  shareAmount: BigInt,
  block: Bytes,
  tx: Bytes
): Withdrawal {
  const deposit = new Withdrawal(round);
  deposit.round = round;
  deposit.amount = amount;
  deposit.shareAmount = shareAmount;
  deposit.block = block;
  deposit.tx = tx;
  deposit.save();
  return deposit;
}

function createWithdrawalRequest(
  round: string,
  investor: Address,
  sender: Address,
  amount: BigInt,
  amountRedeemed: BigInt,
  remainingAssets: BigInt,
  block: Bytes,
  tx: Bytes
): WithdrawalRequest {
  const id = investor.toHexString().concat(round);
  const depositRequest = new WithdrawalRequest(id);
  depositRequest.round = round;
  depositRequest.investor = investor;
  depositRequest.sender = sender;
  depositRequest.amount = amount;
  depositRequest.amountRedeemed = amountRedeemed;
  depositRequest.remainingAssets = remainingAssets;
  depositRequest.block = block;
  depositRequest.tx = tx;
  depositRequest.save();
  return depositRequest;
}

export { createWithdrawal, createWithdrawalRequest };
