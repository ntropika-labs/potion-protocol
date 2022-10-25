import { Address, BigInt, Bytes, store, log } from "@graphprotocol/graph-ts";
import { Deposit, DepositRequest } from "../generated/schema";

function createDeposit(
  round: Bytes,
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

function createDepositRequestId(
  depositId: BigInt,
  vaultAddress: Address,
  investor: Address
): Bytes {
  return vaultAddress.concat(investor).concatI32(depositId.toI32());
}

function createDepositRequest(
  depositId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  amount: BigInt,
  amountRedeemed: BigInt,
  remainingShares: BigInt,
  block: Bytes,
  tx: Bytes
): DepositRequest {
  const id = createDepositRequestId(depositId, vaultAddress, investor);
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

function getOrCreateDepositRequest(
  depositId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  amount: BigInt,
  amountRedeemed: BigInt,
  remainingShares: BigInt,
  block: Bytes,
  tx: Bytes
): DepositRequest {
  const id = createDepositRequestId(depositId, vaultAddress, investor);
  const depositRequest = DepositRequest.load(id);
  if (depositRequest == null) {
    return createDepositRequest(
      depositId,
      vaultAddress,
      round,
      investor,
      sender,
      amount,
      amountRedeemed,
      remainingShares,
      block,
      tx
    );
  }
  return depositRequest;
}

function getDepositRequest(
  depositId: BigInt,
  vaultAddress: Address,
  investor: Address
): DepositRequest | null {
  const id = createDepositRequestId(depositId, vaultAddress, investor);
  return DepositRequest.load(id);
}

function deleteDepositRequest(id: Bytes): void {
  store.remove("DepositRequest", id.toHexString());
  log.info("DepositRequest {} has been removed", [id.toHexString()]);
}

export {
  createDeposit,
  createDepositRequest,
  getOrCreateDepositRequest,
  createDepositRequestId,
  getDepositRequest,
  deleteDepositRequest,
};
