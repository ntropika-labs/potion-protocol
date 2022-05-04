import { assert, clearStore, test } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";

import { BigInt, Address } from "@graphprotocol/graph-ts";

import { handleTransfer } from "../../src/simpleErc20";
import { createTransferEvent, createOwner, createToken } from "./utils";
import {
  mockBalance,
  mockName,
  mockSymbol,
  mockDecimals,
  mockTotalSupply,
} from "./mocks";

test("Can call mappings with custom events", () => {
  // Mock data
  log.info("preparing data...", []);
  const name = "Test Token";
  const decimals = 18;
  const symbol = "TT";
  const totalSupply = BigInt.fromString("100000000000000000000000000");
  const senderAddress = "0x0000000000000000000000000000000000000002";
  const receiverAddress = "0x0000000000000000000000000000000000000003";
  const senderBalance = BigInt.fromString("666000000000000000000");
  const receiverBalance = BigInt.fromString("999000000000000000000");

  // Entities creation
  log.info("preparing entities...", []);
  createToken(
    "0x0000000000000000000000000000000000000001",
    name,
    decimals,
    symbol,
    totalSupply
  );
  createOwner(senderAddress, senderBalance);
  createOwner(receiverAddress, receiverBalance);

  // Mock contract calls
  log.info("mocking contract calls...", []);
  mockName(name);
  mockSymbol(symbol);
  mockDecimals(decimals);
  mockTotalSupply(totalSupply);
  mockBalance(Address.fromString(senderAddress), senderBalance);
  mockBalance(Address.fromString(receiverAddress), receiverBalance);

  // Mock the event
  log.info("mocking the event...", []);
  const newTransferEvent = createTransferEvent(
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000003",
    "1000000000000000000"
  );

  // Call the mapping function
  log.info("calling the handler...", []);
  handleTransfer(newTransferEvent);

  // Assertions
  log.info("checking handler result...", []);
  assert.fieldEquals(
    "Token",
    "0x0000000000000000000000000000000000000001",
    "name",
    "Test Token"
  );
  assert.fieldEquals(
    "Token",
    "0x0000000000000000000000000000000000000001",
    "decimals",
    "18"
  );
  assert.fieldEquals(
    "Token",
    "0x0000000000000000000000000000000000000001",
    "symbol",
    "TT"
  );
  assert.fieldEquals(
    "Token",
    "0x0000000000000000000000000000000000000001",
    "totalSupply",
    "100000000000000000000000000"
  );
  assert.fieldEquals(
    "Owner",
    "0x0000000000000000000000000000000000000002",
    "balance",
    "666000000000000000000"
  );
  assert.fieldEquals(
    "Owner",
    "0x0000000000000000000000000000000000000003",
    "balance",
    "999000000000000000000"
  );

  clearStore();
});
