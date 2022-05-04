import { createMockedFunction } from "matchstick-as/assembly/index";
import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts";

const contractAddress = Address.fromString(
  "0x1111111111111111111111111111111111111111"
);

function mockName(name: string): void {
  createMockedFunction(contractAddress, "name", "name():(string)")
    .withArgs([])
    .returns([ethereum.Value.fromString(name)]);
}

function mockDecimals(decimals: number): void {
  createMockedFunction(contractAddress, "decimals", "decimals():(uint8)")
    .withArgs([])
    .returns([ethereum.Value.fromI32(decimals as i32)]);
}

function mockSymbol(symbol: string): void {
  createMockedFunction(contractAddress, "symbol", "symbol():(string)")
    .withArgs([])
    .returns([ethereum.Value.fromString(symbol)]);
}

function mockTotalSupply(totalSupply: BigInt): void {
  createMockedFunction(
    contractAddress,
    "totalSupply",
    "totalSupply():(uint256)"
  )
    .withArgs([])
    .returns([ethereum.Value.fromUnsignedBigInt(totalSupply)]);
}

function mockBalance(address: Address, balance: BigInt): void {
  createMockedFunction(
    contractAddress,
    "balanceOf",
    "balanceOf(address):(uint256)"
  )
    .withArgs([ethereum.Value.fromAddress(address)])
    .returns([ethereum.Value.fromUnsignedBigInt(balance)]);
}

export { mockBalance, mockName, mockDecimals, mockSymbol, mockTotalSupply };
