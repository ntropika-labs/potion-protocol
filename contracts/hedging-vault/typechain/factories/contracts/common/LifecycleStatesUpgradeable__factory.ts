/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LifecycleStatesUpgradeable,
  LifecycleStatesUpgradeableInterface,
} from "../../../contracts/common/LifecycleStatesUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "enum LifecycleStatesUpgradeable.LifecycleState",
        name: "prevState",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "enum LifecycleStatesUpgradeable.LifecycleState",
        name: "newState",
        type: "uint8",
      },
    ],
    name: "LifecycleStateChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "getLifecycleState",
    outputs: [
      {
        internalType: "enum LifecycleStatesUpgradeable.LifecycleState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060aa8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635479cf7914602d575b600080fd5b60005462010000900460ff1660405160449190604d565b60405180910390f35b6020810160038310606e57634e487b7160e01b600052602160045260246000fd5b9190529056fea26469706673582212209e4c1523199ba915d042fa19d015552b747b598ccb6c76b35373a416bb78d2ed64736f6c634300080e0033";

type LifecycleStatesUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LifecycleStatesUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LifecycleStatesUpgradeable__factory extends ContractFactory {
  constructor(...args: LifecycleStatesUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LifecycleStatesUpgradeable> {
    return super.deploy(overrides || {}) as Promise<LifecycleStatesUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LifecycleStatesUpgradeable {
    return super.attach(address) as LifecycleStatesUpgradeable;
  }
  override connect(signer: Signer): LifecycleStatesUpgradeable__factory {
    return super.connect(signer) as LifecycleStatesUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LifecycleStatesUpgradeableInterface {
    return new utils.Interface(_abi) as LifecycleStatesUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LifecycleStatesUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as LifecycleStatesUpgradeable;
  }
}
