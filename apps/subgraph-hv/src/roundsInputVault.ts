import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
  RoundsInputVault,
} from "../generated/RoundsInputVault/RoundsInputVault";
import { getOrCreateRound, createRoundId } from "./rounds";
import { addInvestorVault } from "./investors";
import { BigInt, log } from "@graphprotocol/graph-ts";
import { setCurrentRound } from "./investmentVault";
import {
  getOrCreateDepositRequest,
  getDepositRequest,
  deleteDepositRequest,
} from "./deposits";
import { createBlock } from "./blocks";

function handleNextRound(event: NextRound): void {
  // retrieve vault from the contract state
  const contract = RoundsInputVault.bind(event.address);
  const vaultAddress = contract.vault();
  getOrCreateRound(event.params.newRoundNumber, vaultAddress);
  setCurrentRound(vaultAddress, event.params.newRoundNumber);
  log.info("NextRound {} for InputVault {}", [
    event.params.newRoundNumber.toString(),
    event.address.toHexString(),
  ]);
}

function handleDepositWithReceipt(event: DepositWithReceipt): void {
  createBlock(event.block.hash, event.block.number, event.block.timestamp);
  // retrive vault and roundNumber from the contract state
  const contract = RoundsInputVault.bind(event.address);
  const vaultAddress = contract.vault();
  const roundNumber = contract.getCurrentRound();
  const roundId = createRoundId(roundNumber, vaultAddress);
  // add the vault to the investor
  addInvestorVault(event.params.receiver, vaultAddress);
  // load the depositRequest, if it doesn't exists it will be initialized to an empty one
  const depositRequest = getOrCreateDepositRequest(
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
  depositRequest.amount = depositRequest.amount.plus(event.params.assets);
  depositRequest.save();
}

function handleRedeemReceipt(event: RedeemReceipt): void {
  const receiptToRedeem = getDepositRequest(
    event.params.id,
    event.params.receiver
  );
  if (receiptToRedeem) {
    // retrive vault and roundNumber from the contract state
    const contract = RoundsInputVault.bind(event.address);
    const vaultAddress = contract.vault();
    const roundNumber = contract.getCurrentRound();
    const roundId = createRoundId(roundNumber, vaultAddress);
    // check if we are in the same round, same round means that we are updating the current request
    if (roundId == receiptToRedeem.round) {
      // if the amount in the event is the same that we have already put inside it means that we want to delete the receipt
      if (receiptToRedeem.amount == event.params.amount) {
        deleteDepositRequest(receiptToRedeem.id);
      } else {
        receiptToRedeem.amount = receiptToRedeem.amount.minus(
          event.params.amount
        );
        receiptToRedeem.save();
        log.info(
          "updated DepositRequest of {} for round {}, the new amount is {}",
          [
            event.params.receiver.toHexString(),
            roundNumber.toString(),
            receiptToRedeem.amount.toString(),
          ]
        );
      }
      // different round means that we are redeeming assets
    } else {
      receiptToRedeem.amountRedeemed = event.params.amount;
      receiptToRedeem.save();
      log.info("redeemed {} for {} from receipt {}", [
        event.params.amount.toString(),
        event.params.receiver.toHexString(),
        event.params.id.toString(),
      ]);
    }
  } else {
    log.error("receipt {} doesn't exist for {}", [
      event.params.id.toString(),
      event.params.receiver.toHexString(),
    ]);
  }
}

function handleWithdrawExchangeAsset(event: WithdrawExchangeAsset): void {
  log.info(
    "caller {}, owner {}, receiver {}, receiptId {}, receiptAmount {}, exchangeAssetAmount {}",
    [
      event.params.caller.toHexString(),
      event.params.owner.toHexString(),
      event.params.receiver.toHexString(),
      event.params.receiptId.toString(),
      event.params.receiptAmount.toString(),
      event.params.exchangeAssetAmount.toString(),
    ]
  );
}
function handleWithdrawExchangeAssetBatch(
  event: WithdrawExchangeAssetBatch
): void {
  log.info(
    "caller {}, owner {}, receiver {}, receiptIds {}, shareAmounts {}, exchangeAssetAmount {}",
    [
      event.params.caller.toHexString(),
      event.params.owner.toHexString(),
      event.params.receiver.toHexString(),
      event.params.receiptIds.toString(),
      event.params.receiptAmounts.toString(),
      event.params.exchangeAssetAmount.toString(),
    ]
  );
}

export {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
  handleWithdrawExchangeAsset,
  handleWithdrawExchangeAssetBatch,
};
