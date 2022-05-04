import { Address } from "@graphprotocol/graph-ts";
import {
  getOrCreateToken,
  getOrCreateOwner,
  getOrCreateTransaction,
} from "./getters";
import { SimpleERC20, Transfer } from "../generated/SimpleERC20/SimpleERC20";

// Upsert entities with values from contract and event
function upsertToken(address: Address, contract: SimpleERC20): void {
  const token = getOrCreateToken(address);
  token.name = contract.name();
  token.decimals = contract.decimals();
  token.symbol = contract.symbol();
  token.totalSupply = contract.totalSupply();
  token.save();
}

function upsertOwner(address: Address, contract: SimpleERC20): void {
  const owner = getOrCreateOwner(address);
  owner.balance = contract.balanceOf(address);
  owner.save();
}

function upsertTransaction(event: Transfer): void {
  const transaction = getOrCreateTransaction(event.transaction.hash);
  transaction.amount = event.params.value;
  transaction.timestamp = event.block.timestamp;
  transaction.block = event.block.number;
  transaction.from = event.params.from.toHexString();
  transaction.to = event.params.to.toHexString();
  transaction.save();
}

function handleTransfer(event: Transfer): void {
  const contract = SimpleERC20.bind(event.address);
  upsertToken(event.address, contract);
  upsertOwner(event.params.from, contract);
  upsertOwner(event.params.to, contract);
  upsertTransaction(event);
}

export { handleTransfer };
