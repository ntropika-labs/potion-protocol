import { Address, BigInt, Bytes, store, log } from "@graphprotocol/graph-ts";
import { Withdrawal, WithdrawalRequest } from "../generated/schema";
import { addWithdrawalRequest, removeWithdrawalRequest } from "./rounds";

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
  vaultAddress: Address,
  investor: Address
): Bytes {
  return vaultAddress.concat(investor).concatI32(withdrawalId.toI32());
}

function createWithdrawalRequest(
  withdrawalId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  block: Bytes,
  tx: Bytes
): WithdrawalRequest {
  const id = createWithdrawalRequestId(withdrawalId, vaultAddress, investor);
  const withdrawalRequest = new WithdrawalRequest(id);
  withdrawalRequest.round = round;
  withdrawalRequest.investor = investor;
  withdrawalRequest.sender = sender;
  withdrawalRequest.amount = BigInt.fromString("0");
  withdrawalRequest.amountRedeemed = BigInt.fromString("0");
  withdrawalRequest.assets = BigInt.fromString("0");
  withdrawalRequest.remainingAssets = BigInt.fromString("0");
  withdrawalRequest.block = block;
  withdrawalRequest.tx = tx;
  withdrawalRequest.save();
  addWithdrawalRequest(round, id);
  return withdrawalRequest;
}

function getOrCreateWithdrawalRequest(
  withdrawalId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  block: Bytes,
  tx: Bytes
): WithdrawalRequest {
  const id = createWithdrawalRequestId(withdrawalId, vaultAddress, investor);
  const withdrawalRequest = WithdrawalRequest.load(id);
  if (withdrawalRequest == null) {
    return createWithdrawalRequest(
      withdrawalId,
      vaultAddress,
      round,
      investor,
      sender,
      block,
      tx
    );
  }
  return withdrawalRequest;
}

function getWithdrawalRequest(
  withdrawalId: BigInt,
  vaultAddress: Address,
  investor: Address
): WithdrawalRequest | null {
  const id = createWithdrawalRequestId(withdrawalId, vaultAddress, investor);
  return WithdrawalRequest.load(id);
}

function deleteWithdrawalRequest(id: Bytes): void {
  const withdrawalRequest = WithdrawalRequest.load(id);
  if (withdrawalRequest) {
    removeWithdrawalRequest(withdrawalRequest.round, id);
    store.remove("WithdrawalRequest", id.toHexString());
  }
  log.info("WithdrawalRequest {} has been removed", [id.toHexString()]);
}

function updateWithdrawalRequestAssets(id: Bytes, exchangeRate: BigInt): void {
  const withdrawalRequest = WithdrawalRequest.load(id);
  if (withdrawalRequest == null) {
    log.error("withdrawalRequest {} doesn't exists", [id.toHexString()]);
  } else {
    log.info("updated WithdrawalRequest {}", [id.toHexString()]);
    withdrawalRequest.assets = withdrawalRequest.amount.times(exchangeRate);
    withdrawalRequest.save();
  }
}

export {
  createWithdrawal,
  createWithdrawalRequest,
  getOrCreateWithdrawalRequest,
  createWithdrawalRequestId,
  getWithdrawalRequest,
  deleteWithdrawalRequest,
  updateWithdrawalRequestAssets,
};
