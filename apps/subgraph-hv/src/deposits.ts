import { Address, BigInt, Bytes, store, log } from "@graphprotocol/graph-ts";
import { Deposit, DepositRequest } from "../generated/schema";
import { addDepositRequest, removeDepositRequest } from "./rounds";

const decimals = BigInt.fromI32(10).pow(18);

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
  block: Bytes,
  tx: Bytes
): DepositRequest {
  const id = createDepositRequestId(depositId, vaultAddress, investor);
  const depositRequest = new DepositRequest(id);
  depositRequest.round = round;
  depositRequest.investor = investor;
  depositRequest.sender = sender;
  depositRequest.amount = BigInt.fromString("0");
  depositRequest.amountRedeemed = BigInt.fromString("0");
  depositRequest.shares = BigInt.fromString("0");
  depositRequest.remainingShares = BigInt.fromString("0");
  depositRequest.block = block;
  depositRequest.tx = tx;
  depositRequest.save();
  addDepositRequest(round, id);
  return depositRequest;
}

function getOrCreateDepositRequest(
  depositId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
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
  const depositRequest = DepositRequest.load(id);
  if (depositRequest) {
    removeDepositRequest(depositRequest.round, id);
    store.remove("DepositRequest", id.toHexString());
  }
  log.info("DepositRequest {} has been removed", [id.toHexString()]);
}

function updateDepositRequestShares(id: Bytes, exchangeRate: BigInt): void {
  const depositRequest = DepositRequest.load(id);
  if (depositRequest == null) {
    log.error("depositRequest {} doesn't exists", [id.toHexString()]);
  } else {
    depositRequest.shares = depositRequest.amount
      .times(exchangeRate)
      .div(decimals);
    depositRequest.remainingShares = depositRequest.amount
      .times(exchangeRate)
      .div(decimals);
    depositRequest.save();
  }
}

export {
  createDeposit,
  createDepositRequest,
  getOrCreateDepositRequest,
  createDepositRequestId,
  getDepositRequest,
  deleteDepositRequest,
  updateDepositRequestShares,
};
