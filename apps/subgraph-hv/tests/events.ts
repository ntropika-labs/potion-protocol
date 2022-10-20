// utilities to generate mocked events for the unit tests

import {
  VaultPositionEntered,
  VaultPositionExited,
  ActionsAdded,
  Deposit,
  Withdraw,
} from "../generated/InvestmentVault/InvestmentVault";
import {
  ActionPositionEntered,
  ActionPositionExited,
  MaxPremiumPercentageChanged,
} from "../generated/PotionBuyAction/PotionBuyAction";
import {
  DepositWithReceipt,
  NextRound,
  RedeemReceipt,
  RedeemReceiptBatch,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
} from "../generated/RoundsInputVault/RoundsInputVault";
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";

// InvestmentVault events
export function createVaultPositionEntered(
  totalPrincipalAmount: BigInt,
  principalAmountInvested: BigInt
): VaultPositionEntered {
  const event = changetype<VaultPositionEntered>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "totalPrincipalAmount",
      ethereum.Value.fromUnsignedBigInt(totalPrincipalAmount)
    ),
    new ethereum.EventParam(
      "principalAmountInvested",
      ethereum.Value.fromUnsignedBigInt(principalAmountInvested)
    ),
  ];

  return event;
}

export function createVaultPositionExited(
  newPrincipalAmount: BigInt
): VaultPositionExited {
  const event = changetype<VaultPositionExited>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "newPrincipalAmount",
      ethereum.Value.fromUnsignedBigInt(newPrincipalAmount)
    ),
  ];

  return event;
}

export function createActionsAdded(actions: Array<Address>): ActionsAdded {
  const event = changetype<ActionsAdded>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "actions",
      ethereum.Value.fromAddressArray(actions)
    ),
  ];

  return event;
}
export function createDeposit(
  caller: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Deposit {
  const event = changetype<Deposit>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam(
      "assets",
      ethereum.Value.fromUnsignedBigInt(assets)
    ),
    new ethereum.EventParam(
      "shares",
      ethereum.Value.fromUnsignedBigInt(shares)
    ),
  ];

  return event;
}

export function createWithdraw(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Withdraw {
  const event = changetype<Withdraw>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam(
      "assets",
      ethereum.Value.fromUnsignedBigInt(assets)
    ),
    new ethereum.EventParam(
      "shares",
      ethereum.Value.fromUnsignedBigInt(shares)
    ),
  ];

  return event;
}

// PotionBuyAction events
export function createActionPositionEntered(
  investmentAsset: Address,
  amountToInvest: BigInt
): ActionPositionEntered {
  const event = changetype<ActionPositionEntered>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "investmentAsset",
      ethereum.Value.fromAddress(investmentAsset)
    ),
    new ethereum.EventParam(
      "amountToInvest",
      ethereum.Value.fromUnsignedBigInt(amountToInvest)
    ),
  ];

  return event;
}

export function createActionPositionExited(
  investmentAsset: Address,
  amountReturned: BigInt
): ActionPositionExited {
  const event = changetype<ActionPositionExited>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "investmentAsset",
      ethereum.Value.fromAddress(investmentAsset)
    ),
    new ethereum.EventParam(
      "amountReturned",
      ethereum.Value.fromUnsignedBigInt(amountReturned)
    ),
  ];

  return event;
}

export function createMaxPremiumPercentageChanged(
  maxPremiumPercentage: BigInt
): MaxPremiumPercentageChanged {
  const event = changetype<MaxPremiumPercentageChanged>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "maxPremiumPercentage",
      ethereum.Value.fromUnsignedBigInt(maxPremiumPercentage)
    ),
  ];

  return event;
}

// RoundsInputVault/RoundsOutputVault events
export function createNextRound(newRoundNumber: BigInt): NextRound {
  const event = changetype<NextRound>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "newRoundNumber",
      ethereum.Value.fromUnsignedBigInt(newRoundNumber)
    ),
  ];

  return event;
}

export function createDepositWithReceipt(
  caller: Address,
  owner: Address,
  id: BigInt,
  assets: BigInt
): DepositWithReceipt {
  const event = changetype<DepositWithReceipt>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id)),
    new ethereum.EventParam(
      "assets",
      ethereum.Value.fromUnsignedBigInt(assets)
    ),
  ];

  return event;
}

export function createRedeemReceipt(
  caller: Address,
  receiver: Address,
  owner: Address,
  id: BigInt,
  amount: BigInt
): RedeemReceipt {
  const event = changetype<RedeemReceipt>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id)),
    new ethereum.EventParam(
      "amount",
      ethereum.Value.fromUnsignedBigInt(amount)
    ),
  ];

  return event;
}

export function createRedeemReceiptBatch(
  caller: Address,
  receiver: Address,
  owner: Address,
  ids: Array<BigInt>,
  amounts: Array<BigInt>
): RedeemReceiptBatch {
  const event = changetype<RedeemReceiptBatch>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigIntArray(ids)),
    new ethereum.EventParam(
      "amount",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    ),
  ];

  return event;
}

export function createWithdrawExchangeAsset(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  sharesId: BigInt,
  sharesAmount: BigInt
): WithdrawExchangeAsset {
  const event = changetype<WithdrawExchangeAsset>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam(
      "assets",
      ethereum.Value.fromUnsignedBigInt(assets)
    ),
    new ethereum.EventParam(
      "sharesId",
      ethereum.Value.fromUnsignedBigInt(sharesId)
    ),
    new ethereum.EventParam(
      "sharesAmount",
      ethereum.Value.fromUnsignedBigInt(sharesAmount)
    ),
  ];

  return event;
}

export function createWithdrawExchangeAssetBatch(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  sharesIds: Array<BigInt>,
  sharesAmounts: Array<BigInt>
): WithdrawExchangeAssetBatch {
  const event = changetype<WithdrawExchangeAssetBatch>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam(
      "assets",
      ethereum.Value.fromUnsignedBigInt(assets)
    ),
    new ethereum.EventParam(
      "sharesId",
      ethereum.Value.fromUnsignedBigIntArray(sharesIds)
    ),
    new ethereum.EventParam(
      "sharesAmount",
      ethereum.Value.fromUnsignedBigIntArray(sharesAmounts)
    ),
  ];

  return event;
}
