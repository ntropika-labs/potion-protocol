/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperRolesManager,
  TestWrapperRolesManagerInterface,
} from "../../../../contracts/test/wrappers/TestWrapperRolesManager";

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
        indexed: true,
        internalType: "address",
        name: "prevVaultAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newVaultAddress",
        type: "address",
      },
    ],
    name: "VaultChanged",
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
    inputs: [
      {
        internalType: "address",
        name: "newVaultAddress",
        type: "address",
      },
    ],
    name: "changeVault",
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
    inputs: [],
    name: "getVault",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610825806100206000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c806372eb05b91161006657806372eb05b9146100fa5780638d928af81461010d5780638f2839701461011e578063c0c53b8b14610131578063e7f43c681461014457600080fd5b806306394c9b1461009857806334d9b2dc146100ad57806360e232a9146100d65780636e9960c3146100e9575b600080fd5b6100ab6100a63660046106f7565b610155565b005b6034546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b6100ab6100e43660046106f7565b61019d565b6033546001600160a01b03166100ba565b6100ab6101083660046106f7565b6101d9565b6036546001600160a01b03166100ba565b6100ab61012c3660046106f7565b610215565b6100ab61013f366004610719565b610251565b6035546001600160a01b03166100ba565b6033546001600160a01b0316336001600160a01b0316146101915760405162461bcd60e51b81526004016101889061075c565b60405180910390fd5b61019a816102cc565b50565b6033546001600160a01b0316336001600160a01b0316146101d05760405162461bcd60e51b81526004016101889061075c565b61019a8161038c565b6033546001600160a01b0316336001600160a01b03161461020c5760405162461bcd60e51b81526004016101889061075c565b61019a81610449565b6033546001600160a01b0316336001600160a01b0316146102485760405162461bcd60e51b81526004016101889061075c565b61019a8161050b565b600061025d60016105c8565b90508015610275576000805461ff0019166101001790555b610280848484610655565b80156102c6576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6001600160a01b03811661033a5760405162461bcd60e51b815260206004820152602f60248201527f4e6577204f70657261746f7220616464726573732063616e6e6f74206265207460448201526e6865206e756c6c206164647265737360881b6064820152608401610188565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907fd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c90600090a35050565b6001600160a01b0381166103f75760405162461bcd60e51b815260206004820152602c60248201527f4e6577205661756c7420616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610188565b603680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f16e2accad9173abff57b295b56993ec5d86b3cbf791fea02f02a6616463754ea90600090a35050565b6001600160a01b0381166104b95760405162461bcd60e51b815260206004820152603160248201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560448201527020746865206e756c6c206164647265737360781b6064820152608401610188565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6001600160a01b0381166105765760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610188565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b60008054610100900460ff161561060f578160ff1660011480156105eb5750303b155b6106075760405162461bcd60e51b8152600401610188906107a1565b506000919050565b60005460ff8084169116106106365760405162461bcd60e51b8152600401610188906107a1565b506000805460ff191660ff92909216919091179055600190565b919050565b600054610100900460ff166106c05760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610188565b6106c98361050b565b6106d282610449565b6106db816102cc565b505050565b80356001600160a01b038116811461065057600080fd5b60006020828403121561070957600080fd5b610712826106e0565b9392505050565b60008060006060848603121561072e57600080fd5b610737846106e0565b9250610745602085016106e0565b9150610753604085016106e0565b90509250925092565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b60608201526080019056fea26469706673582212204f0441e0805fc0824c250f0d84f4c2abd14281ff03261a86db6b65eecae0584064736f6c634300080e0033";

type TestWrapperRolesManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperRolesManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperRolesManager__factory extends ContractFactory {
  constructor(...args: TestWrapperRolesManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperRolesManager> {
    return super.deploy(overrides || {}) as Promise<TestWrapperRolesManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperRolesManager {
    return super.attach(address) as TestWrapperRolesManager;
  }
  override connect(signer: Signer): TestWrapperRolesManager__factory {
    return super.connect(signer) as TestWrapperRolesManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperRolesManagerInterface {
    return new utils.Interface(_abi) as TestWrapperRolesManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperRolesManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperRolesManager;
  }
}
