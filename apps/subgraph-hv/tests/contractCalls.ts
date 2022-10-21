import { createMockedFunction } from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

function mockAsset(contractAddress: Address, assetAddress: Address): void {
  createMockedFunction(contractAddress, "asset", "asset():(address)").returns([
    ethereum.Value.fromAddress(assetAddress),
  ]);
}

function mockTotalAssets(contractAddress: Address, totalAssets: BigInt): void {
  createMockedFunction(
    contractAddress,
    "totalAssets",
    "totalAssets():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(totalAssets)]);
}

function mockTokenName(contractAddress: Address, name: string): void {
  createMockedFunction(contractAddress, "name", "name():(string)").returns([
    ethereum.Value.fromString(name),
  ]);
}

function mockTokenSymbol(contractAddress: Address, symbol: string): void {
  createMockedFunction(contractAddress, "symbol", "symbol():(string)").returns([
    ethereum.Value.fromString(symbol),
  ]);
}

function mockTokenDecimals(contractAddress: Address, decimals: BigInt): void {
  createMockedFunction(
    contractAddress,
    "decimals",
    "decimals():(uint8)"
  ).returns([ethereum.Value.fromUnsignedBigInt(decimals)]);
}

function mockNextCycleStartTimestamp(
  contractAddress: Address,
  nextCycleStartTimestamp: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "nextCycleStartTimestamp",
    "nextCycleStartTimestamp():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(nextCycleStartTimestamp)]);
}

function mockSwapSlippage(
  contractAddress: Address,
  swapSlippage: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "swapSlippage",
    "swapSlippage():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(swapSlippage)]);
}

function mockPremiumSlippage(
  contractAddress: Address,
  premiumSlippage: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "premiumSlippage",
    "premiumSlippage():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(premiumSlippage)]);
}

function mockMaxPremiumPercentage(
  contractAddress: Address,
  maxPremiumPercentage: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "maxPremiumPercentage",
    "maxPremiumPercentage():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(maxPremiumPercentage)]);
}

function mockMaxSwapDurationSecs(
  contractAddress: Address,
  maxSwapDurationSecs: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "maxSwapDurationSecs",
    "maxSwapDurationSecs():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(maxSwapDurationSecs)]);
}

function mockStrikePercentage(
  contractAddress: Address,
  strikePercentage: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "strikePercentage",
    "strikePercentage():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(strikePercentage)]);
}

function mockCycleDurationSecs(
  contractAddress: Address,
  cycleDurationSecs: BigInt
): void {
  createMockedFunction(
    contractAddress,
    "cycleDurationSecs",
    "cycleDurationSecs():(uint256)"
  ).returns([ethereum.Value.fromUnsignedBigInt(cycleDurationSecs)]);
}

function mockVault(contractAddress: Address, vaultAddress: Address): void {
  createMockedFunction(contractAddress, "vault", "vault():(address)").returns([
    ethereum.Value.fromAddress(vaultAddress),
  ]);
}

export {
  mockAsset,
  mockTotalAssets,
  mockTokenName,
  mockTokenSymbol,
  mockTokenDecimals,
  mockNextCycleStartTimestamp,
  mockSwapSlippage,
  mockPremiumSlippage,
  mockMaxPremiumPercentage,
  mockMaxSwapDurationSecs,
  mockStrikePercentage,
  mockCycleDurationSecs,
  mockVault,
};
