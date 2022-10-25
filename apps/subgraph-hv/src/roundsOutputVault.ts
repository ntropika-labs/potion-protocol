import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  RedeemReceiptBatch,
  RoundsOutputVault,
} from "../generated/RoundsOutputVault/RoundsOutputVault";
import { WithdrawalRequest } from "../generated/schema";
import { getOrCreateRound, createRoundId } from "./rounds";
import { addInvestorVault } from "./investors";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { setCurrentRound } from "./investmentVault";
import {
  getOrCreateWithdrawalRequest,
  getWithdrawalRequest,
  deleteWithdrawalRequest,
} from "./withdrawals";
import { createBlock } from "./blocks";

function handleNextRound(event: NextRound): void {
  // retrieve vault from the contract state
  const contract = RoundsOutputVault.bind(event.address);
  const vaultAddress = contract.vault();
  getOrCreateRound(event.params.newRoundNumber, vaultAddress);
  setCurrentRound(vaultAddress, event.params.newRoundNumber);
  log.info("NextRound {} for OutputVault {}", [
    event.params.newRoundNumber.toString(),
    event.address.toHexString(),
  ]);
}

function handleDepositWithReceipt(event: DepositWithReceipt): void {
  createBlock(event.block.hash, event.block.number, event.block.timestamp);
  // retrive vault and roundNumber from the contract state
  const contract = RoundsOutputVault.bind(event.address);
  const vaultAddress = contract.vault();
  const roundNumber = contract.getCurrentRound();
  const roundId = createRoundId(roundNumber, vaultAddress);
  // add the vault to the investor
  addInvestorVault(event.params.receiver, vaultAddress);
  // load the withdrawalRequest, if it doesn't exists it will be initialized to an empty one
  const withdrawalRequest = getOrCreateWithdrawalRequest(
    event.params.id,
    roundId,
    event.params.receiver,
    event.params.caller,
    BigInt.fromString("0"),
    BigInt.fromString("0"),
    BigInt.fromString("0"),
    event.block.hash,
    event.transaction.hash
  );
  withdrawalRequest.amount = withdrawalRequest.amount.plus(event.params.assets);
  withdrawalRequest.save();
}

function handleRedeemReceipt(event: RedeemReceipt): void {
  // retrive vault and roundNumber from the contract state
  const contract = RoundsOutputVault.bind(event.address);
  const vaultAddress = contract.vault();
  const roundNumber = contract.getCurrentRound();
  const roundId = createRoundId(roundNumber, vaultAddress);
  redeem(
    event.params.id,
    roundId,
    roundNumber,
    event.params.amount,
    event.params.receiver
  );
}

function handleRedeemReceiptBatch(event: RedeemReceiptBatch): void {
  // retrive vault and roundNumber from the contract state
  const contract = RoundsOutputVault.bind(event.address);
  const vaultAddress = contract.vault();
  const roundNumber = contract.getCurrentRound();
  const roundId = createRoundId(roundNumber, vaultAddress);
  for (let i = 0; i < event.params.ids.length; i += 1) {
    redeem(
      event.params.ids[i],
      roundId,
      roundNumber,
      event.params.amounts[i],
      event.params.receiver
    );
  }
}

function redeem(
  recipeId: BigInt,
  roundId: Bytes,
  roundNumber: BigInt,
  amount: BigInt,
  receiver: Address
): void {
  const withdrawalRequest = getWithdrawalRequest(recipeId, receiver);
  if (withdrawalRequest == null) {
    log.error("receipt {} doesn't exist for {}", [
      recipeId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    _redeem(
      withdrawalRequest,
      recipeId,
      roundId,
      roundNumber,
      amount,
      receiver
    );
  }
}

function _redeem(
  withdrawalRequest: WithdrawalRequest,
  recipeId: BigInt,
  roundId: Bytes,
  roundNumber: BigInt,
  amount: BigInt,
  receiver: Address
): void {
  // check if we are in the same round, same round means that we are updating the current request
  if (roundId == withdrawalRequest.round) {
    // if the amount in the event is the same that we have already put inside it means that we want to delete the withdrawalRequest
    if (withdrawalRequest.amount == amount) {
      deleteWithdrawalRequest(withdrawalRequest.id);
    } else {
      withdrawalRequest.amount = withdrawalRequest.amount.minus(amount);
      withdrawalRequest.save();
      log.info(
        "updated WithdrawalRequest of {} for round {}, the new amount is {}",
        [
          receiver.toHexString(),
          roundNumber.toString(),
          withdrawalRequest.amount.toString(),
        ]
      );
    }
    // different round means that we are redeeming assets
  } else {
    withdrawalRequest.amountRedeemed = amount;
    withdrawalRequest.save();
    log.info("redeemed {} for {} from withdrawalRequest {}", [
      amount.toString(),
      receiver.toHexString(),
      recipeId.toString(),
    ]);
  }
}

export {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
  handleRedeemReceiptBatch,
};
