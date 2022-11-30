import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  RedeemReceiptBatch,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
  RoundsInputVault,
} from "../generated/RoundsInputVault/RoundsInputVault";
import { DepositTicket } from "../generated/schema";
import {
  getOrCreateRound,
  createRoundId,
  updateShares,
  getUnderlyingToShareRate,
  getExchangeAmount,
} from "./rounds";
import { addInvestorVault } from "./investors";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  getUnderlyingDecimals,
  setCurrentRound,
  setLastUnderlyingToShareRate,
} from "./investmentVault";
import {
  getOrCreateDepositTicket,
  getDepositTicket,
  deleteDepositTicket,
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
      getUnderlyingDecimals(vaultAddress)
    );
    setLastUnderlyingToShareRate(
      vaultAddress,
      event.params.prevRoundExchangeRate
    );
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
  const round = getOrCreateRound(roundNumber, vaultAddress);
  // add the vault to the investor
  addInvestorVault(event.params.receiver, vaultAddress);
  // load the depositTicket, if it doesn't exists it will be initialized to an empty one
  const depositTicket = getOrCreateDepositTicket(
    event.params.id,
    vaultAddress,
    round.id,
    event.params.receiver,
    event.params.caller,
    event.block.hash,
    event.transaction.hash
  );
  depositTicket.amount = depositTicket.amount.plus(event.params.assets);
  depositTicket.amountRemaining = depositTicket.amountRemaining.plus(
    event.params.assets
  );
  depositTicket.save();
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
  const depositTicket = getDepositTicket(receiptId, vaultAddress, receiver);
  if (depositTicket == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    _redeem(depositTicket, receiptId, roundId, roundNumber, amount, receiver);
  }
}

function _redeem(
  depositTicket: DepositTicket,
  receiptId: BigInt,
  roundId: Bytes,
  roundNumber: BigInt,
  amount: BigInt,
  receiver: Address
): void {
  // check if we are in the same round, same round means that we are updating the current request
  if (roundId == depositTicket.round) {
    // if the amount in the event is the same that we have already put inside it means that we want to delete the depositTicket
    if (depositTicket.amount == amount) {
      deleteDepositTicket(depositTicket.id);
    } else {
      depositTicket.amount = depositTicket.amount.minus(amount);
      depositTicket.amountRemaining =
        depositTicket.amountRemaining.minus(amount);
      depositTicket.save();
      log.info(
        "updated DepositTicket of {} for round {}, amountRemaining is {}",
        [
          receiver.toHexString(),
          roundNumber.toString(),
          depositTicket.amountRemaining.toString(),
        ]
      );
    }
    // different round means that we are redeeming underlyings
  } else {
    depositTicket.amountRemaining = depositTicket.amountRemaining.minus(amount);
    depositTicket.amountRedeemed = depositTicket.amountRedeemed.plus(amount);
    depositTicket.save();
    log.info("redeemed {} for {} from depositTicket {}", [
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
    event.params.receiptAmount
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
      event.params.receiptAmounts[i]
    );
  }
}

function withdraw(
  receiptId: BigInt,
  vaultAddress: Address,
  investor: Address,
  receiptAmount: BigInt
): void {
  const depositTicket = getDepositTicket(receiptId, vaultAddress, investor);
  if (depositTicket == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      investor.toHexString(),
    ]);
  } else {
    const exchangeRate = getUnderlyingToShareRate(depositTicket.round);
    const exchangeAssetAmount = getExchangeAmount(exchangeRate, receiptAmount);
    depositTicket.amountRemaining =
      depositTicket.amountRemaining.minus(receiptAmount);
    depositTicket.amountRedeemed =
      depositTicket.amountRedeemed.plus(receiptAmount);
    depositTicket.sharesRemaining =
      depositTicket.sharesRemaining.minus(exchangeAssetAmount);
    depositTicket.sharesRedeemed =
      depositTicket.sharesRedeemed.plus(exchangeAssetAmount);
    depositTicket.save();
    log.info(
      "DepositTicket {} now has {} amountRemaining, {} amountRedeemed, {} sharesRemaining and {} sharesRedeemed",
      [
        depositTicket.id.toHexString(),
        depositTicket.amountRemaining.toString(),
        depositTicket.amountRedeemed.toString(),
        depositTicket.sharesRemaining.toString(),
        depositTicket.sharesRedeemed.toString(),
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
