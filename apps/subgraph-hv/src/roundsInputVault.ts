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
import { getOrCreateRound, createRoundId, updateShares } from "./rounds";
import { addInvestorVault } from "./investors";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  getAssetDecimals,
  setCurrentRound,
  setLastAssetToShareRate,
} from "./investmentVault";
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
  if (event.params.newRoundNumber.gt(BigInt.fromString("0"))) {
    updateShares(
      event.params.newRoundNumber.minus(BigInt.fromString("1")),
      vaultAddress,
      event.params.prevRoundExchangeRate,
      getAssetDecimals(vaultAddress)
    );
    setLastAssetToShareRate(vaultAddress, event.params.prevRoundExchangeRate);
  }
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
    vaultAddress,
    roundId,
    event.params.receiver,
    event.params.caller,
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
    vaultAddress,
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
      vaultAddress,
      roundId,
      roundNumber,
      event.params.amounts[i],
      event.params.receiver
    );
  }
}

function redeem(
  receiptId: BigInt,
  vaultAddress: Address,
  roundId: Bytes,
  roundNumber: BigInt,
  amount: BigInt,
  receiver: Address
): void {
  const depositRequest = getDepositRequest(receiptId, vaultAddress, receiver);
  if (depositRequest == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    _redeem(depositRequest, receiptId, roundId, roundNumber, amount, receiver);
  }
}

function _redeem(
  depositRequest: DepositRequest,
  receiptId: BigInt,
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
      receiptId.toString(),
    ]);
  }
}

function handleWithdrawExchangeAsset(event: WithdrawExchangeAsset): void {
  const contract = RoundsInputVault.bind(event.address);
  const vaultAddress = contract.vault();
  withdraw(
    event.params.receiptId,
    vaultAddress,
    event.params.owner,
    event.params.receiptAmount,
    event.params.exchangeAssetAmount
  );
}

function handleWithdrawExchangeAssetBatch(
  event: WithdrawExchangeAssetBatch
): void {
  const contract = RoundsInputVault.bind(event.address);
  const vaultAddress = contract.vault();
  for (let i = 0; i < event.params.receiptIds.length; i += 1) {
    withdraw(
      event.params.receiptIds[i],
      vaultAddress,
      event.params.owner,
      event.params.receiptAmounts[i],
      event.params.exchangeAssetAmount
    );
  }
}

function withdraw(
  receiptId: BigInt,
  vaultAddress: Address,
  investor: Address,
  receiptAmount: BigInt,
  exchangeAssetAmount: BigInt
): void {
  const depositRequest = getDepositRequest(receiptId, vaultAddress, investor);
  if (depositRequest == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      investor.toHexString(),
    ]);
  } else {
    depositRequest.amount = depositRequest.amount.minus(receiptAmount);
    depositRequest.amountRedeemed =
      depositRequest.amountRedeemed.plus(exchangeAssetAmount);
    depositRequest.remainingShares =
      depositRequest.shares.minus(exchangeAssetAmount);
    depositRequest.save();
    log.info(
      "DepositRequest {} now has {} amount, {} amountRedeemed and {} remainingShares",
      [
        depositRequest.id.toHexString(),
        depositRequest.amount.toString(),
        depositRequest.amountRedeemed.toString(),
        depositRequest.remainingShares.toString(),
      ]
    );
  }
}

export {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
  handleRedeemReceiptBatch,
  handleWithdrawExchangeAsset,
  handleWithdrawExchangeAssetBatch,
};
