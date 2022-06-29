/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperEmergencyLock,
  TestWrapperEmergencyLockInterface,
} from "../../../contracts/test-wrappers/TestWrapperEmergencyLock";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdminAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdminAddress",
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
        name: "prevOperatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOperatorAddress",
        type: "address",
      },
    ],
    name: "OperatorChanged",
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
        indexed: true,
        internalType: "address",
        name: "prevStrategistAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newStrategistAddress",
        type: "address",
      },
    ],
    name: "StrategistChanged",
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
    inputs: [
      {
        internalType: "address",
        name: "newAdminAddress",
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
        name: "newOperatorAddress",
        type: "address",
      },
    ],
    name: "changeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newStrategistAddress",
        type: "address",
      },
    ],
    name: "changeStrategist",
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
    name: "getOperator",
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
    name: "getStrategist",
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
        name: "adminAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "strategistAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "operatorAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x608060405234801561001057600080fd5b5061092c806100206000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c806372eb05b91161006657806372eb05b9146101115780638456cb59146101245780638f2839701461012c578063c0c53b8b1461013f578063e7f43c681461015257600080fd5b806306394c9b146100a357806334d9b2dc146100b85780633f4ba83a146100e25780635c975abb146100ea5780636e9960c314610100575b600080fd5b6100b66100b13660046107b3565b610163565b005b6035546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b6100b66101ab565b60655460ff1660405190151581526020016100d9565b6033546001600160a01b03166100c5565b6100b661011f3660046107b3565b6101e8565b6100b6610224565b6100b661013a3660046107b3565b61025f565b6100b661014d3660046107d5565b61029b565b6034546001600160a01b03166100c5565b6033546001600160a01b0316336001600160a01b03161461019f5760405162461bcd60e51b815260040161019690610818565b60405180910390fd5b6101a88161031e565b50565b6033546001600160a01b0316336001600160a01b0316146101de5760405162461bcd60e51b815260040161019690610818565b6101e66103de565b565b6033546001600160a01b0316336001600160a01b03161461021b5760405162461bcd60e51b815260040161019690610818565b6101a881610471565b6033546001600160a01b0316336001600160a01b0316146102575760405162461bcd60e51b815260040161019690610818565b6101e6610533565b6033546001600160a01b0316336001600160a01b0316146102925760405162461bcd60e51b815260040161019690610818565b6101a8816105ae565b60006102a7600161066b565b905080156102bf576000805461ff0019166101001790555b6102ca8484846106f8565b6102d261073f565b8015610318576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6001600160a01b03811661038c5760405162461bcd60e51b815260206004820152602f60248201527f4e6577204f70657261746f7220616464726573732063616e6e6f74206265207460448201526e6865206e756c6c206164647265737360881b6064820152608401610196565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907fd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c90600090a35050565b60655460ff166104275760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610196565b6065805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b0381166104e15760405162461bcd60e51b815260206004820152603160248201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560448201527020746865206e756c6c206164647265737360781b6064820152608401610196565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b60655460ff16156105795760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610196565b6065805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586104543390565b6001600160a01b0381166106195760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610196565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b60008054610100900460ff16156106b2578160ff16600114801561068e5750303b155b6106aa5760405162461bcd60e51b81526004016101969061085d565b506000919050565b60005460ff8084169116106106d95760405162461bcd60e51b81526004016101969061085d565b506000805460ff191660ff92909216919091179055600190565b919050565b600054610100900460ff1661071f5760405162461bcd60e51b8152600401610196906108ab565b610728836105ae565b61073182610471565b61073a8161031e565b505050565b600054610100900460ff166107665760405162461bcd60e51b8152600401610196906108ab565b6101e6600054610100900460ff166107905760405162461bcd60e51b8152600401610196906108ab565b6065805460ff19169055565b80356001600160a01b03811681146106f357600080fd5b6000602082840312156107c557600080fd5b6107ce8261079c565b9392505050565b6000806000606084860312156107ea57600080fd5b6107f38461079c565b92506108016020850161079c565b915061080f6040850161079c565b90509250925092565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea26469706673582212203ec766adae3d949928d6f6542209f4ec432c16ff00439834a077e63f982fba7764736f6c634300080e0033";

type TestWrapperEmergencyLockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperEmergencyLockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperEmergencyLock__factory extends ContractFactory {
  constructor(...args: TestWrapperEmergencyLockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperEmergencyLock> {
    return super.deploy(overrides || {}) as Promise<TestWrapperEmergencyLock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperEmergencyLock {
    return super.attach(address) as TestWrapperEmergencyLock;
  }
  override connect(signer: Signer): TestWrapperEmergencyLock__factory {
    return super.connect(signer) as TestWrapperEmergencyLock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperEmergencyLockInterface {
    return new utils.Interface(_abi) as TestWrapperEmergencyLockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperEmergencyLock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperEmergencyLock;
  }
}
