import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Round } from "../generated/schema";
import { addItemToArray, removeItemFromArray } from "./helpers";

function createRoundId(roundNumber: BigInt, vault: Bytes): Bytes {
  return vault.concatI32(roundNumber.toI32());
}

function createRound(roundNumber: BigInt, vault: Bytes): Round {
  const id = createRoundId(roundNumber, vault);
  const round = new Round(id);
  round.vault = vault;
  round.roundNumber = roundNumber;
  round.depositRequests = [];
  round.withdrawalRequests = [];
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

function addDepositRequest(id: Bytes, depositRequest: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error("Tried to add a depositRequest to round {} that doesn't exists", [
      id.toHexString(),
    ]);
  } else {
    if (round.depositRequests.indexOf(depositRequest) == -1) {
      round.depositRequests = addItemToArray(
        round.depositRequests,
        depositRequest
      );
      round.save();
    }
    return true;
  }
  return false;
}

function addWithdrawalRequest(id: Bytes, withdrawalRequest: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to add a withdrawalRequest to round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    if (round.withdrawalRequests.indexOf(withdrawalRequest) == -1) {
      round.withdrawalRequests = addItemToArray(
        round.withdrawalRequests,
        withdrawalRequest
      );
      round.save();
    }
    return true;
  }
  return false;
}

function removeDepositRequest(id: Bytes, depositRequest: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to remove a depositRequest from round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    round.depositRequests = removeItemFromArray(
      round.depositRequests,
      depositRequest
    );
    round.save();
    return true;
  }
  return false;
}

function removeWithdrawalRequest(id: Bytes, withdrawalRequest: Bytes): boolean {
  const round = Round.load(id);
  if (round == null) {
    log.error(
      "Tried to remove a withdrawalRequest from round {} that doesn't exists",
      [id.toHexString()]
    );
  } else {
    round.withdrawalRequests = removeItemFromArray(
      round.withdrawalRequests,
      withdrawalRequest
    );
    round.save();
    return true;
  }
  return false;
}

export {
  createRoundId,
  getOrCreateRound,
  addDepositRequest,
  addWithdrawalRequest,
  removeDepositRequest,
  removeWithdrawalRequest,
};
