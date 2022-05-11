import { createMockedFunction } from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function mockDecimals(address: string, decimals: string): void {
  createMockedFunction(
    Address.fromString(address),
    "decimals",
    "decimals():(uint8)"
  ).returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(decimals))]);
}
