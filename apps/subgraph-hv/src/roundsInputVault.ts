import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  RedeemReceiptBatch,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
  RoundsInputVault,
} from "../generated/RoundsInputVault/RoundsInputVault";
import { DepositRequest } from "../generated/schema";
import { getOrCreateRound, createRoundId } from "./rounds";
import { addInvestorVault } from "./investors";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
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
  // retrive vault and roundNumber from the contract state
  const contract = RoundsInputVault.bind(event.address);
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
  const contract = RoundsInputVault.bind(event.address);
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
  const depositRequest = getDepositRequest(recipeId, receiver);
  if (depositRequest == null) {
    log.error("receipt {} doesn't exist for {}", [
      recipeId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    _redeem(depositRequest, recipeId, roundId, roundNumber, amount, receiver);
  }
}

function _redeem(
  depositRequest: DepositRequest,
  recipeId: BigInt,
  roundId: Bytes,
  roundNumber: BigInt,
  amount: BigInt,
  receiver: Address
): void {
  // check if we are in the same round, same round means that we are updating the current request
  if (roundId == depositRequest.round) {
    // if the amount in the event is the same that we have already put inside it means that we want to delete the depositRequest
    if (depositRequest.amount == amount) {
      deleteDepositRequest(depositRequest.id);
    } else {
      depositRequest.amount = depositRequest.amount.minus(amount);
      depositRequest.save();
      log.info(
        "updated DepositRequest of {} for round {}, the new amount is {}",
        [
          receiver.toHexString(),
          roundNumber.toString(),
          depositRequest.amount.toString(),
        ]
      );
    }
    // different round means that we are redeeming assets
  } else {
    depositRequest.amountRedeemed = amount;
    depositRequest.save();
    log.info("redeemed {} for {} from depositRequest {}", [
      amount.toString(),
      receiver.toHexString(),
      recipeId.toString(),
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
  handleRedeemReceiptBatch,
  handleWithdrawExchangeAsset,
  handleWithdrawExchangeAssetBatch,
};
