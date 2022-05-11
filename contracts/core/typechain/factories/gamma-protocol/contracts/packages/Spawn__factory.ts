/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
  BytesLike,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Spawn,
  SpawnInterface,
} from "../../../../gamma-protocol/contracts/packages/Spawn";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "logicContract",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initializationCalldata",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
];

const _bytecode =
  "0x60806040526040516101f03803806101f08339818101604052604081101561002657600080fd5b81516020830180516040519294929383019291908464010000000082111561004d57600080fd5b90830190602082018581111561006257600080fd5b825164010000000081118282018810171561007c57600080fd5b82525081516020918201929091019080838360005b838110156100a9578181015183820152602001610091565b50505050905090810190601f1680156100d65780820380516001836020036101000a031916815260200191505b506040525050506000826001600160a01b0316826040518082805190602001908083835b602083106101195780518252601f1990920191602091820191016100fa565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d8060008114610179576040519150601f19603f3d011682016040523d82523d6000602084013e61017e565b606091505b5050905080610191573d6000803e3d6000fd5b6040805169363d3d373d3d3d363d7360b01b6020808301919091526001600160601b0319606087901b16602a8301526e5af43d82803e903d91602b57fd5bf360881b603e8301528251602d81840381018252604d9093019093528201f3fe";

type SpawnConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SpawnConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Spawn__factory extends ContractFactory {
  constructor(...args: SpawnConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    logicContract: string,
    initializationCalldata: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<Spawn> {
    return super.deploy(
      logicContract,
      initializationCalldata,
      overrides || {}
    ) as Promise<Spawn>;
  }
  override getDeployTransaction(
    logicContract: string,
    initializationCalldata: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      logicContract,
      initializationCalldata,
      overrides || {}
    );
  }
  override attach(address: string): Spawn {
    return super.attach(address) as Spawn;
  }
  override connect(signer: Signer): Spawn__factory {
    return super.connect(signer) as Spawn__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SpawnInterface {
    return new utils.Interface(_abi) as SpawnInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Spawn {
    return new Contract(address, _abi, signerOrProvider) as Spawn;
  }
}
