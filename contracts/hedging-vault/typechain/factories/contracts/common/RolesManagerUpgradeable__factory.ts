/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RolesManagerUpgradeable,
  RolesManagerUpgradeableInterface,
} from "../../../contracts/common/RolesManagerUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdmin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
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
        internalType: "address",
        name: "prevKeeper",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "KeeperChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "changeKeeper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getKeeper",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610348806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630977983814610051578063391b6f4e146100665780636e9960c31461008f5780638f283970146100a0575b600080fd5b61006461005f36600461029d565b6100b3565b005b6034546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b6033546001600160a01b0316610073565b6100646100ae36600461029d565b6101ad565b6033546001600160a01b0316336001600160a01b0316146100ef5760405162461bcd60e51b81526004016100e6906102cd565b60405180910390fd5b6001600160a01b03811661015b5760405162461bcd60e51b815260206004820152602d60248201527f4e6577206b656570657220616464726573732063616e6e6f742062652074686560448201526c206e756c6c206164647265737360981b60648201526084016100e6565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f068b48a2fe7f498b57ff6da64f075ae658fde8d77124b092e62b3dc58d91ce3590600090a35050565b6033546001600160a01b0316336001600160a01b0316146101e05760405162461bcd60e51b81526004016100e6906102cd565b6001600160a01b03811661024b5760405162461bcd60e51b815260206004820152602c60248201527f4e65772061646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b60648201526084016100e6565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b6000602082840312156102af57600080fd5b81356001600160a01b03811681146102c657600080fd5b9392505050565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b60608201526080019056fea2646970667358221220f6488408772461e9de28e8c46fd3cf8ec1812313147a76fd420e8a91b99b659964736f6c634300080e0033";

type RolesManagerUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RolesManagerUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RolesManagerUpgradeable__factory extends ContractFactory {
  constructor(...args: RolesManagerUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RolesManagerUpgradeable> {
    return super.deploy(overrides || {}) as Promise<RolesManagerUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RolesManagerUpgradeable {
    return super.attach(address) as RolesManagerUpgradeable;
  }
  override connect(signer: Signer): RolesManagerUpgradeable__factory {
    return super.connect(signer) as RolesManagerUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RolesManagerUpgradeableInterface {
    return new utils.Interface(_abi) as RolesManagerUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RolesManagerUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RolesManagerUpgradeable;
  }
}
