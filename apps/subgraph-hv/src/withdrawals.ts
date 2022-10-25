import { Address, BigInt, Bytes, store, log } from "@graphprotocol/graph-ts";
import { Withdrawal, WithdrawalRequest } from "../generated/schema";

function createWithdrawal(
  round: Bytes,
  amount: BigInt,
  shareAmount: BigInt,
  block: Bytes,
  tx: Bytes
): Withdrawal {
  const withdrawal = new Withdrawal(round);
  withdrawal.round = round;
  withdrawal.amount = amount;
  withdrawal.shareAmount = shareAmount;
  withdrawal.block = block;
  withdrawal.tx = tx;
  withdrawal.save();
  return withdrawal;
}

function createWithdrawalRequestId(
  withdrawalId: BigInt,
  investor: Address
): Bytes {
  return investor.concatI32(withdrawalId.toI32());
}

function createWithdrawalRequest(
  withdrawalId: BigInt,
  round: Bytes,
  investor: Address,
  sender: Address,
  amount: BigInt,
  amountRedeemed: BigInt,
  remainingAssets: BigInt,
  block: Bytes,
  tx: Bytes
): WithdrawalRequest {
  const id = createWithdrawalRequestId(withdrawalId, investor);
  const withdrawalRequest = new WithdrawalRequest(id);
  withdrawalRequest.round = round;
  withdrawalRequest.investor = investor;
  withdrawalRequest.sender = sender;
  withdrawalRequest.amount = amount;
  withdrawalRequest.amountRedeemed = amountRedeemed;
  withdrawalRequest.remainingAssets = remainingAssets;
  withdrawalRequest.block = block;
  withdrawalRequest.tx = tx;
  withdrawalRequest.save();
  return withdrawalRequest;
}

function getOrCreateWithdrawalRequest(
  withdrawalId: BigInt,
  round: Bytes,
  investor: Address,
  sender: Address,
  amount: BigInt,
  amountRedeemed: BigInt,
  remainingAssets: BigInt,
  block: Bytes,
  tx: Bytes
): WithdrawalRequest {
  const id = createWithdrawalRequestId(withdrawalId, investor);
  const withdrawalRequest = WithdrawalRequest.load(id);
  if (withdrawalRequest == null) {
    return createWithdrawalRequest(
      withdrawalId,
      round,
      investor,
      sender,
      amount,
      amountRedeemed,
      remainingAssets,
      block,
      tx
    );
  }
  return withdrawalRequest;
}

function getWithdrawalRequest(
  withdrawalId: BigInt,
  investor: Address
): WithdrawalRequest | null {
  const id = createWithdrawalRequestId(withdrawalId, investor);
  return WithdrawalRequest.load(id);
}

function deleteWithdrawalRequest(id: Bytes): void {
  store.remove("WithdrawalRequest", id.toHexString());
  log.info("WithdrawalRequest {} has been removed", [id.toHexString()]);
}

export {
  createWithdrawal,
  createWithdrawalRequest,
  getOrCreateWithdrawalRequest,
  createWithdrawalRequestId,
  getWithdrawalRequest,
  deleteWithdrawalRequest,
};
