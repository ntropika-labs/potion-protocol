import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Round } from "../generated/schema";
import { updateDepositTicketShares } from "./deposits";
import { addItemToArray, removeItemFromArray, BigIntPow } from "./helpers";
import { updateWithdrawalTicketAssets } from "./withdrawals";

function createRoundId(roundNumber: BigInt, vault: Bytes): Bytes {
  return vault.concatI32(roundNumber.toI32());
}

function createRound(roundNumber: BigInt, vault: Bytes): Round {
  const id = createRoundId(roundNumber, vault);
  const round = new Round(id);
  round.vault = vault;
  round.roundNumber = roundNumber;
  round.depositTickets = [];
  round.withdrawalTickets = [];
  round.save();
  return round;
}

function getOrCreateRound(roundNumber: BigInt, vault: Bytes): Round {
  const id = createRoundId(roundNumber, vault);
  const round = Round.load(id);
  if (round == null) {
    return createRound(roundNumber, vault);
  }
  return round;
}

function addDepositTicket(id: Bytes, depositTicket: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error("Tried to add a depositTicket to round {} that doesn't exists", [
      id.toHexString(),
    ]);
  } else {
    if (round.depositTickets.indexOf(depositTicket) == -1) {
      round.depositTickets = addItemToArray(
        round.depositTickets,
        depositTicket
      );
      round.save();
    }
    return true;
  }
  return false;
}

function addWithdrawalTicket(id: Bytes, withdrawalTicket: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to add a withdrawalTicket to round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    if (round.withdrawalTickets.indexOf(withdrawalTicket) == -1) {
      round.withdrawalTickets = addItemToArray(
        round.withdrawalTickets,
        withdrawalTicket
      );
      round.save();
    }
    return true;
  }
  return false;
}

function removeDepositTicket(id: Bytes, depositTicket: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to remove a depositTicket from round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    round.depositTickets = removeItemFromArray(
      round.depositTickets,
      depositTicket
    );
    round.save();
    return true;
  }
  return false;
}

function removeWithdrawalTicket(id: Bytes, withdrawalTicket: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to remove a withdrawalTicket from round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    round.withdrawalTickets = removeItemFromArray(
      round.withdrawalTickets,
      withdrawalTicket
    );
    round.save();
    return true;
  }
  return false;
}

function updateShares(
  roundNumber: BigInt,
  vault: Bytes,
  exchangeRate: BigInt,
  amountDecimals: BigInt
): void {
  const id = createRoundId(roundNumber, vault);
  const round = Round.load(id);
  if (round == null) {
    log.error("Tried to update the shares of round {} that doesn't exists", [
      id.toHexString(),
    ]);
  } else {
    const decimals = BigIntPow(BigInt.fromI32(10), amountDecimals);
    for (let i = 0; i < round.depositTickets.length; i += 1) {
      updateDepositTicketShares(
        round.depositTickets[i],
        exchangeRate,
        decimals
      );
    }
    round.underlyingToShareRate = exchangeRate;
    round.save();
  }
}

function updateAssets(
  roundNumber: BigInt,
  vault: Bytes,
  exchangeRate: BigInt
): void {
  const id = createRoundId(roundNumber, vault);
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to update the underlyings of round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    for (let i = 0; i < round.withdrawalTickets.length; i += 1) {
      updateWithdrawalTicketAssets(round.withdrawalTickets[i], exchangeRate);
    }
    round.shareToUnderlyingRate = exchangeRate;
    round.save();
  }
}

export {
  createRoundId,
  getOrCreateRound,
  addDepositTicket,
  addWithdrawalTicket,
  removeDepositTicket,
  removeWithdrawalTicket,
  updateShares,
  updateAssets,
};
