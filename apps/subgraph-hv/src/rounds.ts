import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Round } from "../generated/schema";

function createRoundId(roundNumber: BigInt, vault: Bytes): string {
  return vault.toHexString().concat(roundNumber.toString());
}

function createRound(roundNumber: BigInt, vault: Bytes): Round {
  const id = createRoundId(roundNumber, vault);
  const round = new Round(id);
  round.vault = vault;
  round.roundNumber = roundNumber;
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

export { getOrCreateRound };
