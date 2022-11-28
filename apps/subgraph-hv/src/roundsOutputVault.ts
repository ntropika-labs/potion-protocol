import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  RedeemReceiptBatch,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
  RoundsOutputVault,
} from "../generated/RoundsOutputVault/RoundsOutputVault";
import { Round, WithdrawalTicket } from "../generated/schema";
import { getOrCreateRound, createRoundId, updateAssets } from "./rounds";
import { addInvestorVault } from "./investors";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  setCurrentRound,
  setLastShareToUnderlyingRate,
} from "./investmentVault";
import {
  getOrCreateWithdrawalTicket,
  getWithdrawalTicket,
  deleteWithdrawalTicket,
} from "./withdrawals";
import { createBlock } from "./blocks";

function handleNextRound(event: NextRound): void {
  // retrieve vault from the contract state
  const contract = RoundsOutputVault.bind(event.address);
  const vaultAddress = contract.vault();
  getOrCreateRound(event.params.newRoundNumber, vaultAddress);
  setCurrentRound(vaultAddress, event.params.newRoundNumber);
  if (event.params.newRoundNumber.gt(BigInt.fromString("0"))) {
    updateAssets(
      event.params.newRoundNumber.minus(BigInt.fromString("1")),
      vaultAddress,
      event.params.prevRoundExchangeRate
    );
    setLastShareToUnderlyingRate(
      vaultAddress,
      event.params.prevRoundExchangeRate
    );
  }
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
  // load the withdrawalTicket, if it doesn't exists it will be initialized to an empty one
  const withdrawalTicket = getOrCreateWithdrawalTicket(
    event.params.id,
    vaultAddress,
    roundId,
    event.params.receiver,
    event.params.caller,
    event.block.hash,
    event.transaction.hash
  );
  withdrawalTicket.amount = withdrawalTicket.amount.plus(event.params.assets);
  withdrawalTicket.amountRemaining = withdrawalTicket.amountRemaining.plus(
    event.params.assets
  );
  withdrawalTicket.save();
}

function handleRedeemReceipt(event: RedeemReceipt): void {
  // retrive vault and roundNumber from the contract state
  const contract = RoundsOutputVault.bind(event.address);
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
  const contract = RoundsOutputVault.bind(event.address);
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
  const withdrawalTicket = getWithdrawalTicket(
    receiptId,
    vaultAddress,
    receiver
  );
  if (withdrawalTicket == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    _redeem(
      withdrawalTicket,
      receiptId,
      roundId,
      roundNumber,
      amount,
      receiver
    );
  }
}

function _redeem(
  withdrawalTicket: WithdrawalTicket,
  receiptId: BigInt,
  roundId: Bytes,
  roundNumber: BigInt,
  amount: BigInt,
  receiver: Address
): void {
  // check if we are in the same round, same round means that we are updating the current request
  if (roundId == withdrawalTicket.round) {
    // if the amount in the event is the same that we have already put inside it means that we want to delete the withdrawalTicket
    if (withdrawalTicket.amount == amount) {
      deleteWithdrawalTicket(withdrawalTicket.id);
    } else {
      withdrawalTicket.amount = withdrawalTicket.amount.minus(amount);
      withdrawalTicket.amountRemaining =
        withdrawalTicket.amountRemaining.minus(amount);
      withdrawalTicket.save();
      log.info(
        "updated WithdrawalTicket of {} for round {}, the new amount is {}",
        [
          receiver.toHexString(),
          roundNumber.toString(),
          withdrawalTicket.amount.toString(),
        ]
      );
    }
    // different round means that we are redeeming underlyings
  } else {
    withdrawalTicket.amountRemaining =
      withdrawalTicket.amountRemaining.minus(amount);
    withdrawalTicket.amountRedeemed =
      withdrawalTicket.amountRedeemed.plus(amount);
    withdrawalTicket.save();
    log.info("redeemed {} for {} from withdrawalTicket {}", [
      amount.toString(),
      receiver.toHexString(),
      receiptId.toString(),
    ]);
  }
}

function handleWithdrawExchangeAsset(event: WithdrawExchangeAsset): void {
  const contract = RoundsOutputVault.bind(event.address);
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
  const contract = RoundsOutputVault.bind(event.address);
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
  const withdrawalTicket = getWithdrawalTicket(
    receiptId,
    vaultAddress,
    investor
  );
  if (withdrawalTicket == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      investor.toHexString(),
    ]);
  } else {
    const round = Round.load(withdrawalTicket.round)!;
    const exchangeRate = round.underlyingToShareRate || BigInt.fromI32(0);
    const exchangeAssetAmount = exchangeRate.times(receiptAmount);
    withdrawalTicket.amountRemaining =
      withdrawalTicket.amountRemaining.minus(receiptAmount);
    withdrawalTicket.amountRedeemed =
      withdrawalTicket.amountRedeemed.plus(receiptAmount);
    withdrawalTicket.underlyingsRemaining =
      withdrawalTicket.underlyingsRemaining.minus(exchangeAssetAmount);
    withdrawalTicket.underlyingsRedeemed =
      withdrawalTicket.underlyingsRedeemed.plus(exchangeAssetAmount);
    withdrawalTicket.save();
    log.info(
      "WithdrawalTicket {} now has {} amountRemaining, {} amountRedeemed, {} underlyingsRemaining and {} underlyingsRedeemed",
      [
        withdrawalTicket.id.toHexString(),
        withdrawalTicket.amountRemaining.toString(),
        withdrawalTicket.amountRedeemed.toString(),
        withdrawalTicket.underlyingsRemaining.toString(),
        withdrawalTicket.underlyingsRedeemed.toString(),
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
