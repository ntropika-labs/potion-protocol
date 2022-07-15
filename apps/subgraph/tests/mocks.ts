import { createMockedFunction } from "matchstick-as/assembly/index";
import { Address, Bytes, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function mockDecimals(address: Bytes, decimals: string): void {
  createMockedFunction(
    Address.fromBytes(address),
    "decimals",
    "decimals():(uint8)"
  ).returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(decimals))]);
}

export function mockSymbol(address: string, symbol: string): void {
  createMockedFunction(
    Address.fromString(address),
    "symbol",
    "symbol():(string)"
  ).returns([ethereum.Value.fromString(symbol)]);
}

export function mockName(address: string, name: string): void {
  createMockedFunction(
    Address.fromString(address),
    "name",
    "name():(string)"
  ).returns([ethereum.Value.fromString(name)]);
}
