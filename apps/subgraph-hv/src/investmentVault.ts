import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  ActionsAdded,
  VaultPositionEntered,
  VaultPositionExited,
  InvestmentVault,
  Deposit,
  Withdraw,
} from "../generated/InvestmentVault/InvestmentVault";
import { HedgingVault } from "../generated/schema";
import { getOrCreateToken } from "./token";
import { setVault } from "./potionBuyAction";
import { getOrCreateRound, createRoundId } from "./rounds";
import { createBlock } from "./blocks";
import { createDeposit } from "./deposits";
import { createWithdrawal } from "./withdrawals";

const BIGINT_MINUS_ONE = BigInt.fromString("-1");

function createHedgingVault(id: Address): HedgingVault {
  const contract = InvestmentVault.bind(id);
  const vault = new HedgingVault(id);
  getOrCreateToken(contract.asset());
  getOrCreateToken(id);
  vault.asset = contract.asset();
  vault.totalAssets = contract.totalAssets();
  vault.shareToken = id;
  vault.save();
  return vault;
}

function getOrCreateHedgingVault(id: Address): HedgingVault {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    return createHedgingVault(id);
  }
  return vault;
}

function setAction(id: Address, action: Address): void {
  const vault = getOrCreateHedgingVault(id);
  vault.action = action;
  vault.save();
}

function setLastShareToAssetRate(id: Address, exchangeRate: BigInt): void {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    log.error("vault {} doesn't exists", [id.toHexString()]);
  } else {
    vault.lastShareToAssetRate = exchangeRate;
    vault.save();
  }
}

function setLastAssetToShareRate(id: Address, exchangeRate: BigInt): void {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    log.error("vault {} doesn't exists", [id.toHexString()]);
  } else {
    vault.lastAssetToShareRate = exchangeRate;
    vault.save();
  }
}

function getCurrentRound(vault: HedgingVault): BigInt {
  if (vault.currentRound) {
    return vault.currentRound as BigInt;
  }
  log.error("vault {} doesn't have a round set", [vault.id.toHexString()]);
  return BIGINT_MINUS_ONE;
}

function setCurrentRound(id: Address, currentRound: BigInt): void {
  const vault = getOrCreateHedgingVault(id);
  vault.currentRound = currentRound;
  vault.save();
}

function handleActionsAdded(event: ActionsAdded): void {
  setAction(event.address, event.params.actions[0]);
  setVault(event.params.actions[0], event.address);
  log.info("PotionBuyAction {} added to vault {}", [
    event.params.actions[0].toHexString(),
    event.address.toHexString(),
  ]);
}

function handleVaultPositionEntered(event: VaultPositionEntered): void {
  const vault = getOrCreateHedgingVault(event.address);
  const currentRound = getCurrentRound(vault);
  if (currentRound.gt(BIGINT_MINUS_ONE)) {
    createBlock(event.block.hash, event.block.number, event.block.timestamp);
    const round = getOrCreateRound(currentRound, vault.id);
    round.assetsInvested = event.params.principalAmountInvested;
    round.blockEntered = event.block.hash;
    round.save();
    vault.lastAssetsInvested = event.params.principalAmountInvested;
    vault.totalAssets = event.params.totalPrincipalAmount;
    vault.save();
    log.info(
      "PositionEntered for vault {}, with principalAmountInvested {} and totalPrincipalAmount {}",
      [
        vault.id.toHexString(),
        event.params.principalAmountInvested.toString(),
        event.params.totalPrincipalAmount.toString(),
      ]
    );
  }
}

function handleVaultPositionExited(event: VaultPositionExited): void {
  const vault = getOrCreateHedgingVault(event.address);
  const currentRound = getCurrentRound(vault);
  if (currentRound.gt(BIGINT_MINUS_ONE)) {
    createBlock(event.block.hash, event.block.number, event.block.timestamp);
    const round = getOrCreateRound(currentRound, vault.id);
    round.totalAssetsAtRoundEnd = event.params.newPrincipalAmount;
    round.blockExited = event.block.hash;
    round.save();
    vault.totalAssets = event.params.newPrincipalAmount;
    vault.save();
    log.info("PositionExited for vault {} with newPrincipalAmount {}", [
      vault.id.toHexString(),
      event.params.newPrincipalAmount.toString(),
    ]);
  }
}

function handleDeposit(event: Deposit): void {
  const vault = getOrCreateHedgingVault(event.address);
  const currentRound = getCurrentRound(vault);
  if (currentRound.gt(BIGINT_MINUS_ONE)) {
    createBlock(event.block.hash, event.block.number, event.block.timestamp);
    createDeposit(
      createRoundId(currentRound, event.address),
      event.params.assets,
      event.params.shares,
      event.block.hash,
      event.transaction.hash
    );
    log.info("Deposit created for vault {} round {}, assets {} and shares {}", [
      event.address.toHexString(),
      currentRound.toString(),
      event.params.assets.toString(),
      event.params.shares.toString(),
    ]);
  } else {
    log.error(
      "Tried to create a Deposit for vault {} that doesn't have yet a round",
      [event.address.toHexString()]
    );
  }
}

function handleWithdraw(event: Withdraw): void {
  const vault = getOrCreateHedgingVault(event.address);
  const currentRound = getCurrentRound(vault);
  if (currentRound.gt(BIGINT_MINUS_ONE)) {
    createBlock(event.block.hash, event.block.number, event.block.timestamp);
    createWithdrawal(
      createRoundId(currentRound, event.address),
      event.params.assets,
      event.params.shares,
      event.block.hash,
      event.transaction.hash
    );
    log.info(
      "Withdrawal created for vault {} round {}, assets {} and shares {}",
      [
        event.address.toHexString(),
        currentRound.toString(),
        event.params.assets.toString(),
        event.params.shares.toString(),
      ]
    );
  } else {
    log.error(
      "Tried to create a Withdrawal for vault {} that doesn't have yet a round",
      [event.address.toHexString()]
    );
  }
}

export {
  setCurrentRound,
  setLastAssetToShareRate,
  setLastShareToAssetRate,
  handleActionsAdded,
  handleVaultPositionEntered,
  handleVaultPositionExited,
  handleDeposit,
  handleWithdraw,
};
