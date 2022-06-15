/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  EmergencyLockUpgradeable,
  EmergencyLockUpgradeableInterface,
} from "../../../contracts/common/EmergencyLockUpgradeable";

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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "adminRole",
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
    name: "keeperRole",
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
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506104cd806100206000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80635c975abb1161005b5780635c975abb146100ce5780638456cb59146100e45780638f283970146100ec578063eb429e67146100ff57600080fd5b80629f2f3c1461008157806309779838146100b15780633f4ba83a146100c6575b600080fd5b603354610094906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100c46100bf366004610422565b610112565b005b6100c46101dc565b60655460ff1660405190151581526020016100a8565b6100c4610219565b6100c46100fa366004610422565b610254565b603454610094906001600160a01b031681565b6033546001600160a01b0316336001600160a01b03161461014e5760405162461bcd60e51b815260040161014590610452565b60405180910390fd5b6001600160a01b0381166101ba5760405162461bcd60e51b815260206004820152602d60248201527f4e6577206b656570657220616464726573732063616e6e6f742062652074686560448201526c206e756c6c206164647265737360981b6064820152608401610145565b603480546001600160a01b0319166001600160a01b0392909216919091179055565b6033546001600160a01b0316336001600160a01b03161461020f5760405162461bcd60e51b815260040161014590610452565b610217610314565b565b6033546001600160a01b0316336001600160a01b03161461024c5760405162461bcd60e51b815260040161014590610452565b6102176103a7565b6033546001600160a01b0316336001600160a01b0316146102875760405162461bcd60e51b815260040161014590610452565b6001600160a01b0381166102f25760405162461bcd60e51b815260206004820152602c60248201527f4e65772061646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610145565b603380546001600160a01b0319166001600160a01b0392909216919091179055565b60655460ff1661035d5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610145565b6065805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b60655460ff16156103ed5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610145565b6065805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861038a3390565b60006020828403121561043457600080fd5b81356001600160a01b038116811461044b57600080fd5b9392505050565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b60608201526080019056fea26469706673582212207cc3e5149cb9d2d034485bb3a5790e9c58abc295d1a2aa55f0219661ca3623af64736f6c634300080e0033";

type EmergencyLockUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EmergencyLockUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EmergencyLockUpgradeable__factory extends ContractFactory {
  constructor(...args: EmergencyLockUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EmergencyLockUpgradeable> {
    return super.deploy(overrides || {}) as Promise<EmergencyLockUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): EmergencyLockUpgradeable {
    return super.attach(address) as EmergencyLockUpgradeable;
  }
  override connect(signer: Signer): EmergencyLockUpgradeable__factory {
    return super.connect(signer) as EmergencyLockUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EmergencyLockUpgradeableInterface {
    return new utils.Interface(_abi) as EmergencyLockUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EmergencyLockUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as EmergencyLockUpgradeable;
  }
}
