import { Deployments } from "@potion-protocol/hedging-vault";
import { utils, type BigNumberish } from "ethers";

import { ethereumNetwork } from "./";

//@ts-expect-error iterator is not defined
export const contractsAddresses = Deployments[ethereumNetwork].contracts;

function assert(input: boolean, message?: string): asserts input {
  if (!input) throw new Error(message ? message : "assertion failed");
}
export class SwapStep {
  public static registry = new Map<string, SwapStep>();

  constructor(public tokenAddress: string, public poolFee: BigNumberish) {
    SwapStep.registry.set(this.toKeccak256(), this);
  }

  // Returned values and order must match the struct declaration in CriteriaManager.hashCriteria()
  toArray(): (string | BigNumberish)[] {
    const values = [this.tokenAddress, this.poolFee];

    // Check for an out of date solidityTypes()
    assert(
      values.length === SwapStep.solidityTypes().length,
      "criteria: # of solidity types != # of members"
    );
    return values;
  }

  static solidityTypes(): string[] {
    const types = ["address", "uint256"];
    return types;
  }

  toKeccak256(): string {
    return utils.solidityKeccak256(SwapStep.solidityTypes(), this.toArray());
  }
}

export class Swap {
  public static registry = new Map<string, Swap>();

  constructor(
    public inputToken: string,
    public fee: BigNumberish,
    public outputToken: string
  ) {
    Swap.registry.set(this.toKeccak256(), this);
  }

  // Returned values and order must match the struct declaration in CriteriaManager.hashCriteria()
  toArray(): (string | BigNumberish)[] {
    const values = [this.inputToken, this.fee, this.outputToken];

    // Check for an out of date solidityTypes()
    assert(
      values.length === Swap.solidityTypes().length,
      "swap: # of solidity types != # of members"
    );
    return values;
  }

  static solidityTypes(): string[] {
    return ["address", "uint256", "address"];
  }

  toKeccak256(): string {
    return utils.solidityKeccak256(Swap.solidityTypes(), this.toArray());
  }
}

export class MultihopSwap {
  public hashes: string[];
  public static registry = new Map<string, Set<SwapStep>>();

  constructor(unsortedHashes: string[]) {
    this.hashes = [...unsortedHashes].sort(); // Taking care not to sort the input array, for easier testing
    const mySet = new Set<SwapStep>();

    for (const h of this.hashes) {
      mySet.add(SwapStep.registry.get(h) as SwapStep);
    }
    MultihopSwap.registry.set(this.toKeccak256(), mySet);
  }

  toArray(): string[] {
    return this.hashes;
  }

  static solidityTypes(): string[] {
    return ["bytes32[]"];
  }

  toKeccak256(): string {
    return utils.solidityKeccak256(MultihopSwap.solidityTypes(), [
      this.toArray(),
    ]);
  }
}
