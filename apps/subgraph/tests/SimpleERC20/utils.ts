import { newMockEvent } from "matchstick-as/assembly/index";

import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

import { Transfer } from "../../generated/SimpleERC20/SimpleERC20";
import { Owner, Token } from "../../generated/schema";
import { handleTransfer } from "../../src/simpleErc20";

function handleTransfers(events: Transfer[]): void {
  events.forEach((event) => {
    handleTransfer(event);
  });
}

function createTransferEvent(
  from: string,
  to: string,
  value: string
): Transfer {
  const newTransferEvent = changetype<Transfer>(newMockEvent());
  newTransferEvent.address = Address.fromString(
    "0x1111111111111111111111111111111111111111"
  );

  newTransferEvent.parameters = [];
  const fromParam = new ethereum.EventParam(
    "from",
    ethereum.Value.fromAddress(Address.fromString(from))
  );
  const toParam = new ethereum.EventParam(
    "to",
    ethereum.Value.fromAddress(Address.fromString(to))
  );
  const valueParam = new ethereum.EventParam(
    "value",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(value))
  );

  newTransferEvent.parameters.push(fromParam);
  newTransferEvent.parameters.push(toParam),
    newTransferEvent.parameters.push(valueParam);

  return newTransferEvent;
}

function createToken(
  id: string,
  name: string,
  decimals: number,
  symbol: string,
  totalSupply: BigInt
): Token {
  const token = new Token(id);
  token.name = name;
  token.decimals = decimals as i32;
  token.symbol = symbol;
  token.totalSupply = totalSupply;
  token.save();
  return token;
}

function createOwner(address: string, balance: BigInt): Owner {
  const owner = new Owner(address);
  owner.balance = balance;
  owner.save();
  return owner;
}

export { createTransferEvent, handleTransfers, createOwner, createToken };
