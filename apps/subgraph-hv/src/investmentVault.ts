import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  ActionsAdded,
  VaultPositionEntered,
  VaultPositionExited,
  InvestmentVault,
  Deposit,
  Withdraw,
  RoleGranted,
  RoleRevoked,
} from "../generated/InvestmentVault/InvestmentVault";

import { HedgingVault } from "../generated/schema";
import { getOrCreateToken } from "./token";
import { setVault, updateNextCycleTimestamp } from "./potionBuyAction";
import { getOrCreateRound, createRoundId } from "./rounds";
import { createBlock } from "./blocks";
import { createDeposit } from "./deposits";
import { createWithdrawal } from "./withdrawals";
import { getVaultRole } from "./roles";

const BIGINT_MINUS_ONE = BigInt.fromString("-1");

function createHedgingVault(id: Address): HedgingVault {
  const contract = InvestmentVault.bind(id);
  const vault = new HedgingVault(id);
  getOrCreateToken(contract.asset());
  getOrCreateToken(id);
  vault.underlying = contract.asset();
  vault.totalAssets = contract.totalAssets();
  vault.totalShares = contract.totalSupply();
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

function setLastShareToUnderlyingRate(id: Address, exchangeRate: BigInt): void {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    log.error("vault {} doesn't exists", [id.toHexString()]);
  } else {
    vault.lastShareToUnderlyingRate = exchangeRate;
    vault.save();
  }
}

function setLastUnderlyingToShareRate(id: Address, exchangeRate: BigInt): void {
  const vault = HedgingVault.load(id);
  if (vault == null) {
    log.error("vault {} doesn't exists", [id.toHexString()]);
  } else {
    vault.lastUnderlyingToShareRate = exchangeRate;
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
    round.underlyingsInvested = event.params.principalAmountInvested;
    round.blockEntered = event.block.hash;
    round.save();
    const contract = InvestmentVault.bind(event.address);
    vault.lastUnderlyingsInvested = event.params.principalAmountInvested;
    vault.totalAssets = event.params.totalPrincipalAmount;
    vault.totalShares = contract.totalSupply();
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
  if (vault.action) {
    const actionAddress = Address.fromBytes(vault.action as Bytes);
    updateNextCycleTimestamp(actionAddress);
  }
}

function handleVaultPositionExited(event: VaultPositionExited): void {
  const vault = getOrCreateHedgingVault(event.address);
  const currentRound = getCurrentRound(vault);
  if (currentRound.gt(BIGINT_MINUS_ONE)) {
    createBlock(event.block.hash, event.block.number, event.block.timestamp);
    const round = getOrCreateRound(currentRound, vault.id);
    round.totalUnderlyingsAtRoundEnd = event.params.newPrincipalAmount;
    round.blockExited = event.block.hash;
    round.save();
    const contract = InvestmentVault.bind(event.address);
    vault.totalAssets = event.params.newPrincipalAmount;
    vault.totalShares = contract.totalSupply();
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
    log.info(
      "Deposit created for vault {} round {}, underlyings {} and shares {}",
      [
        event.address.toHexString(),
        currentRound.toString(),
        event.params.assets.toString(),
        event.params.shares.toString(),
      ]
    );
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
      "Withdrawal created for vault {} round {}, underlyings {} and shares {}",
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

function handleRoleGranted(event: RoleGranted): void {
  addRoleVault(event.params.role, event.address, event.params.account);
}

function handleRoleRevoked(event: RoleRevoked): void {
  removeRoleVault(event.params.role, event.address, event.params.account);
}

function getUnderlyingDecimals(id: Address): BigInt {
  const vault = getOrCreateHedgingVault(id);
  const token = getOrCreateToken(Address.fromBytes(vault.underlying));
  return token.decimals;
}

function addRoleVault(
  role: Bytes,
  vaultAddress: Address,
  account: Address
): void {
  const vaultRole = getVaultRole(role, vaultAddress);
  const vault = HedgingVault.load(vaultAddress);
  if (vault != null) {
    if (vaultRole != "") {
      if (vaultRole == "admin") {
        vault.admin = account;
      } else if (vaultRole == "strategist") {
        vault.strategist = account;
      } else if (vaultRole == "operator") {
        vault.operator = account;
      }

      vault.save();

      log.info("Role {} set to account {} for vault {}", [
        vaultRole,
        account.toHexString(),
        vaultAddress.toHexString(),
      ]);
    } else {
      log.error("Tried setting role <{}> to account <{}> for vault <{}>", [
        role.toHexString(),
        account.toHexString(),
        vaultAddress.toHexString(),
      ]);
    }
  } else {
    log.error("vault {} doesn't exists", [vaultAddress.toHexString()]);
  }
}

function removeRoleVault(
  role: Bytes,
  vaultAddress: Address,
  account: Address
): void {
  const vaultRole = getVaultRole(role, vaultAddress);
  const vault = HedgingVault.load(vaultAddress);
  if (vault != null) {
    if (vaultRole != "") {
      if (vaultRole == "admin") {
        if (vault.admin == account) {
          vault.admin = null;
          vault.save();
        } else {
          log.error(
            "Tried to remove role admin for account {} and vault {} that is not assigned to that account",
            [account.toHexString(), vaultAddress.toHexString()]
          );
        }
      } else if (vaultRole == "strategist") {
        if (vault.strategist == account) {
          vault.strategist = null;
          vault.save();
        } else {
          log.error(
            "Tried to remove role strategist for account {} and vault {} that is not assigned to that account",
            [account.toHexString(), vaultAddress.toHexString()]
          );
        }
      } else if (vaultRole == "operator") {
        if (vault.operator == account) {
          vault.operator = null;
          vault.save();
        } else {
          log.error(
            "Tried to remove role operator for account {} and vault {} that is not assigned to that account",
            [account.toHexString(), vaultAddress.toHexString()]
          );
        }
      }
    } else {
      log.error("Tried setting role <{}> to account <{}> for vault <{}>", [
        role.toHexString(),
        account.toHexString(),
        vaultAddress.toHexString(),
      ]);
    }
  } else {
    log.error("vault {} doesn't exists", [vaultAddress.toHexString()]);
  }
}

export {
  setCurrentRound,
  setLastUnderlyingToShareRate,
  setLastShareToUnderlyingRate,
  handleActionsAdded,
  handleVaultPositionEntered,
  handleVaultPositionExited,
  handleDeposit,
  handleWithdraw,
  handleRoleGranted,
  handleRoleRevoked,
  getUnderlyingDecimals,
};
