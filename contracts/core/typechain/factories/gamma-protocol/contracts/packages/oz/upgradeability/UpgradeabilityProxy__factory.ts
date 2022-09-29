/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory } from "ethers";
import type { Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  UpgradeabilityProxy,
  UpgradeabilityProxyInterface,
} from "../../../../../../gamma-protocol/contracts/packages/oz/upgradeability/UpgradeabilityProxy";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "impl",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610106806100206000396000f3fe608060405260043610601c5760003560e01c80635c60da1b14605c575b60006024608a565b90506001600160a01b038116603857600080fd5b60405136600082376000803683855af43d806000843e8180156058578184f35b8184fd5b348015606757600080fd5b50606e608a565b604080516001600160a01b039092168252519081900360200190f35b60008060405180806100ae6023913960405190819003602301902054939250505056fe6f72672e7a657070656c696e6f732e70726f78792e696d706c656d656e746174696f6ea2646970667358221220b140971b6780543755d8ab1af148ee50be3978754ad1625ba9e7cae7e1b9b98164736f6c634300060a0033";

type UpgradeabilityProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UpgradeabilityProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UpgradeabilityProxy__factory extends ContractFactory {
  constructor(...args: UpgradeabilityProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<UpgradeabilityProxy> {
    return super.deploy(overrides || {}) as Promise<UpgradeabilityProxy>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): UpgradeabilityProxy {
    return super.attach(address) as UpgradeabilityProxy;
  }
  override connect(signer: Signer): UpgradeabilityProxy__factory {
    return super.connect(signer) as UpgradeabilityProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UpgradeabilityProxyInterface {
    return new utils.Interface(_abi) as UpgradeabilityProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UpgradeabilityProxy {
    return new Contract(address, _abi, signerOrProvider) as UpgradeabilityProxy;
  }
}
