import { Owner, Token, Transaction } from "../generated/schema";
import { Address, Bytes } from "@graphprotocol/graph-ts";

// Getters
function getOrCreateToken(address: Address): Token {
  const id = address.toHexString();
  let token = Token.load(id);

  if (!token) {
    token = new Token(id);
  }

  return token;
}

function getOrCreateOwner(address: Address): Owner {
  const id = address.toHexString();
  let owner = Owner.load(id);

  if (!owner) {
    owner = new Owner(id);
  }

  return owner;
}

function getOrCreateTransaction(hash: Bytes): Transaction {
  let transaction = Transaction.load(hash.toHexString());

  if (!transaction) {
    transaction = new Transaction(hash.toHexString());
  }

  return transaction;
}

export { getOrCreateToken, getOrCreateOwner, getOrCreateTransaction };
