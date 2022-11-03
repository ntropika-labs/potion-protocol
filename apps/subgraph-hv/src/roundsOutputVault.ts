import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  RedeemReceiptBatch,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
  RoundsOutputVault,
} from "../generated/RoundsOutputVault/RoundsOutputVault";
import { WithdrawalRequest } from "../generated/schema";
import { getOrCreateRound, createRoundId, updateAssets } from "./rounds";
import { addInvestorVault } from "./investors";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { setCurrentRound, setLastShareToAssetRate } from "./investmentVault";
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
  if (event.params.newRoundNumber.gt(BigInt.fromString("0"))) {
    updateAssets(
      event.params.newRoundNumber.minus(BigInt.fromString("1")),
      vaultAddress,
      event.params.prevRoundExchangeRate
    );
    setLastShareToAssetRate(vaultAddress, event.params.prevRoundExchangeRate);
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
  // load the withdrawalRequest, if it doesn't exists it will be initialized to an empty one
  const withdrawalRequest = getOrCreateWithdrawalRequest(
    event.params.id,
    vaultAddress,
    roundId,
    event.params.receiver,
    event.params.caller,
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
  const withdrawalRequest = getWithdrawalRequest(
    receiptId,
    vaultAddress,
    receiver
  );
  if (withdrawalRequest == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    _redeem(
      withdrawalRequest,
      receiptId,
      roundId,
      roundNumber,
      amount,
      receiver
    );
  }
}

function _redeem(
  withdrawalRequest: WithdrawalRequest,
  receiptId: BigInt,
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
    event.params.receiver,
    event.params.receiptAmount,
    event.params.exchangeAssetAmount
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
      event.params.receiver,
      event.params.receiptAmounts[i],
      event.params.exchangeAssetAmount
    );
  }
}

function withdraw(
  receiptId: BigInt,
  vaultAddress: Address,
  receiver: Address,
  receiptAmount: BigInt,
  exchangeAssetAmount: BigInt
): void {
  const withdrawalRequest = getWithdrawalRequest(
    receiptId,
    vaultAddress,
    receiver
  );
  if (withdrawalRequest == null) {
    log.error("receipt {} doesn't exist for {}", [
      receiptId.toString(),
      receiver.toHexString(),
    ]);
  } else {
    withdrawalRequest.amount = withdrawalRequest.amount.minus(receiptAmount);
    withdrawalRequest.amountRedeemed =
      withdrawalRequest.amountRedeemed.plus(exchangeAssetAmount);
    withdrawalRequest.remainingAssets =
      withdrawalRequest.assets.minus(exchangeAssetAmount);
    withdrawalRequest.save();
    log.info(
      "WithdrawalRequest {} now has {} amount, {} amountRedeemed and {} remainingAssets",
      [
        withdrawalRequest.id.toHexString(),
        withdrawalRequest.amount.toString(),
        withdrawalRequest.amountRedeemed.toString(),
        withdrawalRequest.remainingAssets.toString(),
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
