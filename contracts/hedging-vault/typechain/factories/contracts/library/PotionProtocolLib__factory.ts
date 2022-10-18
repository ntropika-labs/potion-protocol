/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  PotionProtocolLib,
  PotionProtocolLibInterface,
} from "../../../contracts/library/PotionProtocolLib";

const _abi = [
  {
    inputs: [],
    name: "OTOKEN_DECIMALS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6087610038600b82828239805160001a607314602b57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063179eaf21146038575b600080fd5b603f600881565b60405190815260200160405180910390f3fea26469706673582212206c59b78a752b165dd221cdee70c2b975694df8e60e7b9fbb7e7741549959a51e64736f6c634300080e0033";

type PotionProtocolLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PotionProtocolLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PotionProtocolLib__factory extends ContractFactory {
  constructor(...args: PotionProtocolLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PotionProtocolLib> {
    return super.deploy(overrides || {}) as Promise<PotionProtocolLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PotionProtocolLib {
    return super.attach(address) as PotionProtocolLib;
  }
  override connect(signer: Signer): PotionProtocolLib__factory {
    return super.connect(signer) as PotionProtocolLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PotionProtocolLibInterface {
    return new utils.Interface(_abi) as PotionProtocolLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PotionProtocolLib {
    return new Contract(address, _abi, signerOrProvider) as PotionProtocolLib;
  }
}
