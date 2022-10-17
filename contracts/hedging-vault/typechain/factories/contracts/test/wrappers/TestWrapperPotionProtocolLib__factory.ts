/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperPotionProtocolLib,
  TestWrapperPotionProtocolLibInterface,
} from "../../../../contracts/test/wrappers/TestWrapperPotionProtocolLib";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IPotionLiquidityPool",
        name: "potionLiquidityPoolManager",
        type: "address",
      },
      {
        internalType: "contract IOpynFactory",
        name: "opynFactory",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "strikePriceInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPremiumInUSDC",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "targetPotionAddress",
            type: "address",
          },
          {
            components: [
              {
                internalType: "address",
                name: "lp",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "poolId",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "int256",
                    name: "a_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "b_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "c_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "d_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "max_util_59x18",
                    type: "int256",
                  },
                ],
                internalType: "struct ICurveManager.Curve",
                name: "curve",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "underlyingAsset",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "strikeAsset",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "isPut",
                    type: "bool",
                  },
                  {
                    internalType: "uint256",
                    name: "maxStrikePercent",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxDurationInDays",
                    type: "uint256",
                  },
                ],
                internalType: "struct ICriteriaManager.Criteria",
                name: "criteria",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "orderSizeInOtokens",
                type: "uint256",
              },
            ],
            internalType: "struct IPotionLiquidityPool.CounterpartyDetails[]",
            name: "sellers",
            type: "tuple[]",
          },
          {
            internalType: "contract IERC20Upgradeable",
            name: "USDC",
            type: "address",
          },
        ],
        internalType: "struct TestWrapperPotionProtocolLib.BuyPotionParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "buyPotion",
    outputs: [
      {
        internalType: "uint256",
        name: "actualPremiumInUSDC",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPotionLiquidityPool",
        name: "potionLiquidityPoolManager",
        type: "address",
      },
      {
        internalType: "contract IOpynController",
        name: "opynController",
        type: "address",
      },
      {
        internalType: "address",
        name: "targetPotionAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalSizeInPotions",
        type: "uint256",
      },
    ],
    name: "redeemPotion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610fd9806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806304c95a661461003b578063ece59ab714610050575b600080fd5b61004e6100493660046109b3565b610075565b005b61006361005e366004610a04565b610087565b60405190815260200160405180910390f35b6100818484848461013a565b50505050565b6000610130848461009b6020860186610a6d565b6020860135604087013560608801356100ba60a08a0160808b01610a6d565b6100c760a08b018b610a8a565b808060200260200160405190810160405280939291908181526020016000905b82821015610114576101056101a08302860136819003810190610b8b565b815260200190600101906100e7565b5061012b93505060e08e0191505060c08d01610a6d565b610221565b90505b9392505050565b604051631a25eb9160e11b81526001600160a01b0383811660048301526000919086169063344bd72290602401602060405180830381865afa158015610184573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101a89190610c36565b905060006101b830858486610497565b604051635b0bf86360e11b81529091506001600160a01b0386169063b617f0c6906101e7908490600401610ca7565b600060405180830381600087803b15801561020157600080fd5b505af1158015610215573d6000803e3d6000fd5b50505050505050505050565b600061022e828b876105ba565b60006102466001600160a01b038b168a858b8b6106f6565b90506001600160a01b03811661038257600061026e6001600160a01b038c168b868c8c61077b565b9050856001600160a01b0316816001600160a01b0316146102fc5760405162461bcd60e51b815260206004820152603760248201527f4f746f6b656e20646f6573206e6f7420657869737420616e642074617267657460448201527f206164647265737320646f6573206e6f74206d6174636800000000000000000060648201526084015b60405180910390fd5b8b6001600160a01b03166322d8755f8b86878d8d60018c8f6040518963ffffffff1660e01b8152600401610337989796959493929190610e56565b6020604051808303816000875af1158015610356573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061037a9190610c36565b925050610475565b846001600160a01b0316816001600160a01b0316146103ff5760405162461bcd60e51b815260206004820152603360248201527f4f746f6b656e20646f65732065786973742062757420746172676574206164646044820152720e4cae6e640c8decae640dcdee840dac2e8c6d606b1b60648201526084016102f3565b604051630e94961760e11b81526001600160a01b038c1690631d292c2e9061042f90849088908b90600401610eb7565b6020604051808303816000875af115801561044e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104729190610c36565b91505b8582101561048957610489838c60006105ba565b509998505050505050505050565b60408051600180825281830190925260609160009190816020015b610516604080516101008101909152806000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001606081525090565b8152602001906001900390816104b2579050506040805161010081019091529091508060088152602001876001600160a01b03168152602001876001600160a01b03168152602001866001600160a01b031681526020018581526020018481526020016000815260200160405180602001604052806000815250815250816000815181106105a6576105a6610eeb565b602090810291909101015295945050505050565b8015806106345750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa15801561060e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106329190610c36565b155b61069f5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084016102f3565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b1790526106f19084906107b5565b505050565b6040516304551c1560e21b81526000906001600160a01b038716906311547054906107309088908890819089908990600190600401610f01565b602060405180830381865afa15801561074d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107719190610f3a565b9695505050505050565b604051632e1ae69960e21b81526000906001600160a01b0387169063b86b9a64906107309088908890819089908990600190600401610f01565b600061080a826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166108879092919063ffffffff16565b8051909150156106f157808060200190518101906108289190610f57565b6106f15760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016102f3565b60606101308484600085856001600160a01b0385163b6108e95760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102f3565b600080866001600160a01b031685876040516109059190610f74565b60006040518083038185875af1925050503d8060008114610942576040519150601f19603f3d011682016040523d82523d6000602084013e610947565b606091505b5091509150610957828286610962565b979650505050505050565b60608315610971575081610133565b8251156109815782518084602001fd5b8160405162461bcd60e51b81526004016102f39190610f90565b6001600160a01b03811681146109b057600080fd5b50565b600080600080608085870312156109c957600080fd5b84356109d48161099b565b935060208501356109e48161099b565b925060408501356109f48161099b565b9396929550929360600135925050565b600080600060608486031215610a1957600080fd5b8335610a248161099b565b92506020840135610a348161099b565b9150604084013567ffffffffffffffff811115610a5057600080fd5b840160e08187031215610a6257600080fd5b809150509250925092565b600060208284031215610a7f57600080fd5b81356101338161099b565b6000808335601e19843603018112610aa157600080fd5b83018035915067ffffffffffffffff821115610abc57600080fd5b60200191506101a081023603821315610ad457600080fd5b9250929050565b60405160a0810167ffffffffffffffff81118282101715610b0c57634e487b7160e01b600052604160045260246000fd5b60405290565b80151581146109b057600080fd5b600060a08284031215610b3257600080fd5b610b3a610adb565b90508135610b478161099b565b81526020820135610b578161099b565b60208201526040820135610b6a81610b12565b80604083015250606082013560608201526080820135608082015292915050565b60008183036101a0811215610b9f57600080fd5b610ba7610adb565b8335610bb28161099b565b81526020848101359082015260a0603f1983011215610bd057600080fd5b610bd8610adb565b915060408401358252606084013560208301526080840135604083015260a0840135606083015260c08401356080830152816040820152610c1c8560e08601610b20565b606082015261018093909301356080840152509092915050565b600060208284031215610c4857600080fd5b5051919050565b60005b83811015610c6a578181015183820152602001610c52565b838111156100815750506000910152565b60008151808452610c93816020860160208601610c4f565b601f01601f19169290920160200192915050565b60006020808301818452808551808352604092508286019150828160051b8701018488016000805b84811015610d7957603f198a850301865282516101008151600b8110610d0357634e487b7160e01b85526021600452602485fd5b8652818a01516001600160a01b039081168b8801528983015181168a880152606080840151909116908701526080808301519087015260a0808301519087015260c0808301519087015260e091820151918601819052610d6581870183610c7b565b978a01979550505091870191600101610ccf565b50919998505050505050505050565b600081518084526020808501945080840160005b83811015610e4b57815180516001600160a01b03908116895284820151858a01526040808301518051828c0152808701516060808d0191909152818301516080808e01919091528183015160a08e01529182015160c08d0152808501518051851660e08e015260208101519094166101008d01529183015115156101208c0152908201516101408b0152908101516101608a015201516101808801526101a09096019590820190600101610d9c565b509495945050505050565b6001600160a01b038981168252888116602083015287166040820152606081018690526080810185905283151560a082015261010060c08201819052600090610ea183820186610d88565b9150508260e08301529998505050505050505050565b6001600160a01b0384168152606060208201819052600090610edb90830185610d88565b9050826040830152949350505050565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b03968716815294861660208601529290941660408401526060830152608082019290925290151560a082015260c00190565b600060208284031215610f4c57600080fd5b81516101338161099b565b600060208284031215610f6957600080fd5b815161013381610b12565b60008251610f86818460208701610c4f565b9190910192915050565b6020815260006101336020830184610c7b56fea264697066735822122015836eb6425f7e5bf71c7d1269ae213942fa23c6f2fdb3542f38ed86d56e185f64736f6c634300080e0033";

type TestWrapperPotionProtocolLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperPotionProtocolLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperPotionProtocolLib__factory extends ContractFactory {
  constructor(...args: TestWrapperPotionProtocolLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperPotionProtocolLib> {
    return super.deploy(
      overrides || {}
    ) as Promise<TestWrapperPotionProtocolLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperPotionProtocolLib {
    return super.attach(address) as TestWrapperPotionProtocolLib;
  }
  override connect(signer: Signer): TestWrapperPotionProtocolLib__factory {
    return super.connect(signer) as TestWrapperPotionProtocolLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperPotionProtocolLibInterface {
    return new utils.Interface(_abi) as TestWrapperPotionProtocolLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperPotionProtocolLib {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperPotionProtocolLib;
  }
}
