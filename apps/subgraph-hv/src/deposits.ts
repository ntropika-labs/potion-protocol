import { Address, BigInt, Bytes, store, log } from "@graphprotocol/graph-ts";
import { Deposit, DepositTicket } from "../generated/schema";
import { addDepositTicket, removeDepositTicket } from "./rounds";

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

function createDepositTicketId(
  depositId: BigInt,
  vaultAddress: Address,
  investor: Address
): Bytes {
  return vaultAddress.concat(investor).concatI32(depositId.toI32());
}

function createDepositTicket(
  depositId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  block: Bytes,
  tx: Bytes
): DepositTicket {
  const id = createDepositTicketId(depositId, vaultAddress, investor);
  const depositTicket = new DepositTicket(id);
  depositTicket.round = round;
  depositTicket.investor = investor;
  depositTicket.sender = sender;
  depositTicket.amount = BigInt.fromString("0");
  depositTicket.amountRemaining = BigInt.fromString("0");
  depositTicket.amountRedeemed = BigInt.fromString("0");
  depositTicket.shares = BigInt.fromString("0");
  depositTicket.sharesRemaining = BigInt.fromString("0");
  depositTicket.sharesRedeemed = BigInt.fromString("0");
  depositTicket.block = block;
  depositTicket.tx = tx;
  depositTicket.save();
  addDepositTicket(round, id);
  return depositTicket;
}

function getOrCreateDepositTicket(
  depositId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  block: Bytes,
  tx: Bytes
): DepositTicket {
  const id = createDepositTicketId(depositId, vaultAddress, investor);
  const depositTicket = DepositTicket.load(id);
  if (depositTicket == null) {
    return createDepositTicket(
      depositId,
      vaultAddress,
      round,
      investor,
      sender,
      block,
      tx
    );
  }
  return depositTicket;
}

function getDepositTicket(
  depositId: BigInt,
  vaultAddress: Address,
  investor: Address
): DepositTicket | null {
  const id = createDepositTicketId(depositId, vaultAddress, investor);
  return DepositTicket.load(id);
}

function deleteDepositTicket(id: Bytes): void {
  const depositTicket = DepositTicket.load(id);
  if (depositTicket) {
    removeDepositTicket(depositTicket.round, id);
    store.remove("DepositTicket", id.toHexString());
  }
  log.info("DepositTicket {} has been removed", [id.toHexString()]);
}

function updateDepositTicketShares(
  id: Bytes,
  exchangeRate: BigInt,
  decimals: BigInt
): void {
  const depositTicket = DepositTicket.load(id);
  if (depositTicket == null) {
    log.error("depositTicket {} doesn't exists", [id.toHexString()]);
  } else {
    const shares = depositTicket.amount.times(exchangeRate).div(decimals);
    depositTicket.shares = shares;
    depositTicket.sharesRemaining = shares;
    depositTicket.save();
    log.info("Updated depositTicket {}, shares are {}", [
      id.toHexString(),
      shares.toString(),
    ]);
  }
}

export {
  createDeposit,
  createDepositTicket,
  getOrCreateDepositTicket,
  createDepositTicketId,
  getDepositTicket,
  deleteDepositTicket,
  updateDepositTicketShares,
};
