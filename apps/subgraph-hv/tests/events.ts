// utilities to generate mocked events for the unit tests

import {
  VaultPositionEntered,
  VaultPositionExited,
  ActionsAdded,
  Deposit,
  Withdraw,
} from "../generated/InvestmentVault/InvestmentVault";
import {
  CycleDurationChanged,
  MaxPremiumPercentageChanged,
  MaxSwapDurationChanged,
  PremiumSlippageChanged,
  StrikePercentageChanged,
  SwapSlippageChanged,
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

export function createCycleDurationChanged(
  maxPremiumPercentage: BigInt
): CycleDurationChanged {
  const event = changetype<CycleDurationChanged>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "maxPremiumPercentage",
      ethereum.Value.fromUnsignedBigInt(maxPremiumPercentage)
    ),
  ];

  return event;
}

export function createMaxSwapDurationChanged(
  maxPremiumPercentage: BigInt
): MaxSwapDurationChanged {
  const event = changetype<MaxSwapDurationChanged>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "maxPremiumPercentage",
      ethereum.Value.fromUnsignedBigInt(maxPremiumPercentage)
    ),
  ];

  return event;
}

export function createPremiumSlippageChanged(
  maxPremiumPercentage: BigInt
): PremiumSlippageChanged {
  const event = changetype<PremiumSlippageChanged>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "maxPremiumPercentage",
      ethereum.Value.fromUnsignedBigInt(maxPremiumPercentage)
    ),
  ];

  return event;
}

export function createStrikePercentageChanged(
  maxPremiumPercentage: BigInt
): StrikePercentageChanged {
  const event = changetype<StrikePercentageChanged>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam(
      "maxPremiumPercentage",
      ethereum.Value.fromUnsignedBigInt(maxPremiumPercentage)
    ),
  ];

  return event;
}

export function createSwapSlippageChanged(
  maxPremiumPercentage: BigInt
): SwapSlippageChanged {
  const event = changetype<SwapSlippageChanged>(newMockEvent());

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
  receiver: Address,
  id: BigInt,
  assets: BigInt
): DepositWithReceipt {
  const event = changetype<DepositWithReceipt>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
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
  exchangeAssetAmount: BigInt,
  recipeId: BigInt,
  recipeAmount: BigInt
): WithdrawExchangeAsset {
  const event = changetype<WithdrawExchangeAsset>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam(
      "exchangeAssetAmount",
      ethereum.Value.fromUnsignedBigInt(exchangeAssetAmount)
    ),
    new ethereum.EventParam(
      "recipeId",
      ethereum.Value.fromUnsignedBigInt(recipeId)
    ),
    new ethereum.EventParam(
      "recipeAmount",
      ethereum.Value.fromUnsignedBigInt(recipeAmount)
    ),
  ];

  return event;
}

export function createWithdrawExchangeAssetBatch(
  caller: Address,
  receiver: Address,
  owner: Address,
  exchangeAssetAmount: BigInt,
  recipeIds: Array<BigInt>,
  recipeAmounts: Array<BigInt>
): WithdrawExchangeAssetBatch {
  const event = changetype<WithdrawExchangeAssetBatch>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)),
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
    new ethereum.EventParam(
      "exchangeAssetAmount",
      ethereum.Value.fromUnsignedBigInt(exchangeAssetAmount)
    ),
    new ethereum.EventParam(
      "recipeId",
      ethereum.Value.fromUnsignedBigIntArray(recipeIds)
    ),
    new ethereum.EventParam(
      "recipeAmount",
      ethereum.Value.fromUnsignedBigIntArray(recipeAmounts)
    ),
  ];

  return event;
}
