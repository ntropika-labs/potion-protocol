import { Address, BigInt, Bytes, store, log } from "@graphprotocol/graph-ts";
import { Withdrawal, WithdrawalTicket } from "../generated/schema";
import { addWithdrawalTicket, removeWithdrawalTicket } from "./rounds";

const decimals = BigInt.fromI32(10).pow(18);

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

function createWithdrawalTicketId(
  withdrawalId: BigInt,
  vaultAddress: Address,
  investor: Address
): Bytes {
  return vaultAddress.concat(investor).concatI32(withdrawalId.toI32());
}

function createWithdrawalTicket(
  withdrawalId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  block: Bytes,
  tx: Bytes
): WithdrawalTicket {
  const id = createWithdrawalTicketId(withdrawalId, vaultAddress, investor);
  const withdrawalTicket = new WithdrawalTicket(id);
  withdrawalTicket.round = round;
  withdrawalTicket.investor = investor;
  withdrawalTicket.sender = sender;
  withdrawalTicket.amount = BigInt.fromString("0");
  withdrawalTicket.amountRemaining = BigInt.fromString("0");
  withdrawalTicket.amountRedeemed = BigInt.fromString("0");
  withdrawalTicket.underlyings = BigInt.fromString("0");
  withdrawalTicket.underlyingsRemaining = BigInt.fromString("0");
  withdrawalTicket.underlyingsRedeemed = BigInt.fromString("0");
  withdrawalTicket.block = block;
  withdrawalTicket.tx = tx;
  withdrawalTicket.save();
  addWithdrawalTicket(round, id);
  return withdrawalTicket;
}

function getOrCreateWithdrawalTicket(
  withdrawalId: BigInt,
  vaultAddress: Address,
  round: Bytes,
  investor: Address,
  sender: Address,
  block: Bytes,
  tx: Bytes
): WithdrawalTicket {
  const id = createWithdrawalTicketId(withdrawalId, vaultAddress, investor);
  const withdrawalTicket = WithdrawalTicket.load(id);
  if (withdrawalTicket == null) {
    return createWithdrawalTicket(
      withdrawalId,
      vaultAddress,
      round,
      investor,
      sender,
      block,
      tx
    );
  }
  return withdrawalTicket;
}

function getWithdrawalTicket(
  withdrawalId: BigInt,
  vaultAddress: Address,
  investor: Address
): WithdrawalTicket | null {
  const id = createWithdrawalTicketId(withdrawalId, vaultAddress, investor);
  return WithdrawalTicket.load(id);
}

function deleteWithdrawalTicket(id: Bytes): void {
  const withdrawalTicket = WithdrawalTicket.load(id);
  if (withdrawalTicket) {
    removeWithdrawalTicket(withdrawalTicket.round, id);
    store.remove("WithdrawalTicket", id.toHexString());
  }
  log.info("WithdrawalTicket {} has been removed", [id.toHexString()]);
}

function updateWithdrawalTicketAssets(id: Bytes, exchangeRate: BigInt): void {
  const withdrawalTicket = WithdrawalTicket.load(id);
  if (withdrawalTicket == null) {
    log.error("withdrawalTicket {} doesn't exists", [id.toHexString()]);
  } else {
    const underlyings = withdrawalTicket.amount
      .times(exchangeRate)
      .div(decimals);
    withdrawalTicket.underlyings = underlyings;
    withdrawalTicket.underlyingsRemaining = underlyings;
    withdrawalTicket.save();
    log.info("updated WithdrawalTicket {}, underlyings are {}", [
      id.toHexString(),
      underlyings.toString(),
    ]);
  }
}

export {
  createWithdrawal,
  createWithdrawalTicket,
  getOrCreateWithdrawalTicket,
  createWithdrawalTicketId,
  getWithdrawalTicket,
  deleteWithdrawalTicket,
  updateWithdrawalTicketAssets,
};
