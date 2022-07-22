/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperLifecycleStates,
  TestWrapperLifecycleStatesInterface,
} from "../../../contracts/test-wrappers/TestWrapperLifecycleStates";

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
        internalType: "enum ILifecycleStates.LifecycleState",
        name: "prevState",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "enum ILifecycleStates.LifecycleState",
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
        internalType: "enum ILifecycleStates.LifecycleState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ILifecycleStates.LifecycleState",
        name: "newState",
        type: "uint8",
      },
    ],
    name: "setLifecycleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061037b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80635479cf79146100465780638129fc1c14610068578063d0f1ee4a14610072575b600080fd5b60005462010000900460ff1660405161005f91906102a7565b60405180910390f35b610070610085565b005b6100706100803660046102cf565b6100fa565b60006100916001610103565b905080156100a9576000805461ff0019166101001790555b6100b1610194565b80156100f7576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b6100f78161020d565b60008054610100900460ff1615610153578160ff1660011480156101265750303b155b61014b5760405162461bcd60e51b8152600401610142906102f7565b60405180910390fd5b506000919050565b60005460ff80841691161061017a5760405162461bcd60e51b8152600401610142906102f7565b506000805460ff191660ff92909216919091179055600190565b600054610100900460ff166101ff5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610142565b6000805462ff000019169055565b600080546201000080820460ff16928492909162ff0000199091169083600281111561023b5761023b610291565b021790555081600281111561025257610252610291565b81600281111561026457610264610291565b6040517f49ae30fb84f2b304d16bac648a934e08ecb34691a12c4fb9f38ecbe380ca4fd190600090a35050565b634e487b7160e01b600052602160045260246000fd5b60208101600383106102c957634e487b7160e01b600052602160045260246000fd5b91905290565b6000602082840312156102e157600080fd5b8135600381106102f057600080fd5b9392505050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b60608201526080019056fea264697066735822122058098c4e20d030d6b80a698fee2b628d91368291592a233478a1988fbacd0e3864736f6c634300080e0033";

type TestWrapperLifecycleStatesConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperLifecycleStatesConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperLifecycleStates__factory extends ContractFactory {
  constructor(...args: TestWrapperLifecycleStatesConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperLifecycleStates> {
    return super.deploy(overrides || {}) as Promise<TestWrapperLifecycleStates>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperLifecycleStates {
    return super.attach(address) as TestWrapperLifecycleStates;
  }
  override connect(signer: Signer): TestWrapperLifecycleStates__factory {
    return super.connect(signer) as TestWrapperLifecycleStates__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperLifecycleStatesInterface {
    return new utils.Interface(_abi) as TestWrapperLifecycleStatesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperLifecycleStates {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperLifecycleStates;
  }
}
