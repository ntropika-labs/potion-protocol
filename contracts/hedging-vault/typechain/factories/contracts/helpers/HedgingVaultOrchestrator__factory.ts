/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  HedgingVaultOrchestrator,
  HedgingVaultOrchestratorInterface,
  IVaultV0,
} from "../../../contracts/helpers/HedgingVaultOrchestrator";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[]",
            name: "actionsIndexes",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "principalPercentages",
            type: "uint256[]",
          },
        ],
        internalType: "struct IVaultV0.Strategy",
        name: "potionBuyStrategy_",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256[]",
            name: "actionsIndexes",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "principalPercentages",
            type: "uint256[]",
          },
        ],
        internalType: "struct IVaultV0.Strategy",
        name: "swapToUSDCStrategy_",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "canEnterNextRound",
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
    name: "investmentVault",
    outputs: [
      {
        internalType: "contract IVault",
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
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "potionBuyExitSwapInfo",
        type: "tuple",
      },
      {
        components: [
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
            internalType: "address",
            name: "targetPotionAddress",
            type: "address",
          },
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
            name: "expectedPremiumInUSDC",
            type: "uint256",
          },
        ],
        internalType: "struct PotionBuyInfo",
        name: "potionBuyEnterBuyInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "potionBuyEnterSwapInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "swapToUSDCExitSwapInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "swapToUSDCEnterSwapInfo",
        type: "tuple",
      },
    ],
    name: "nextRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "potionBuyAction",
    outputs: [
      {
        internalType: "contract IPotionBuyAction",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "potionBuyStrategy",
    outputs: [
      {
        components: [
          {
            internalType: "uint256[]",
            name: "actionsIndexes",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "principalPercentages",
            type: "uint256[]",
          },
        ],
        internalType: "struct IVaultV0.Strategy",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "roundsInputVault",
    outputs: [
      {
        internalType: "contract IRoundsInputVault",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "roundsOutputVault",
    outputs: [
      {
        internalType: "contract IRoundsOutputVault",
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
        name: "investmentVault_",
        type: "address",
      },
      {
        internalType: "address",
        name: "potionBuyAction_",
        type: "address",
      },
      {
        internalType: "address",
        name: "swapToUSDCAction_",
        type: "address",
      },
      {
        internalType: "address",
        name: "roundsInputVault_",
        type: "address",
      },
      {
        internalType: "address",
        name: "roundsOutputVault_",
        type: "address",
      },
    ],
    name: "setSystemAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapToUSDCAction",
    outputs: [
      {
        internalType: "contract ISwapToUSDCAction",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapToUSDCStrategy",
    outputs: [
      {
        components: [
          {
            internalType: "uint256[]",
            name: "actionsIndexes",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "principalPercentages",
            type: "uint256[]",
          },
        ],
        internalType: "struct IVaultV0.Strategy",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200135f3803806200135f8339810160408190526200003491620002be565b6200003f33620000ba565b8151805183916006916200005b9183916020909101906200010a565b5060208281015180516200007692600185019201906200010a565b50508151805183925060089162000093918391602001906200010a565b506020828101518051620000ae92600185019201906200010a565b50905050505062000328565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b82805482825590600052602060002090810192821562000148579160200282015b82811115620001485782518255916020019190600101906200012b565b50620001569291506200015a565b5090565b5b808211156200015657600081556001016200015b565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200019957600080fd5b815160206001600160401b0380831115620001b857620001b862000171565b8260051b604051601f19603f83011681018181108482111715620001e057620001e062000171565b604052938452858101830193838101925087851115620001ff57600080fd5b83870191505b84821015620002205781518352918301919083019062000205565b979650505050505050565b6000604082840312156200023e57600080fd5b604080519081016001600160401b03808211838310171562000264576200026462000171565b8160405282935084519150808211156200027d57600080fd5b6200028b8683870162000187565b83526020850151915080821115620002a257600080fd5b50620002b18582860162000187565b6020830152505092915050565b60008060408385031215620002d257600080fd5b82516001600160401b0380821115620002ea57600080fd5b620002f8868387016200022b565b935060208501519150808211156200030f57600080fd5b506200031e858286016200022b565b9150509250929050565b61102780620003386000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80639a6fe70e1161008c578063f2b1626411610066578063f2b1626414610189578063f2fde38b1461019c578063f473ecb9146101af578063fd94172c146101c257600080fd5b80639a6fe70e1461015b5780639bc9b83914610163578063b508bd4b1461017657600080fd5b8063058283a5146100d457806345620687146100f1578063715018a61461010657806380b88691146101105780638da5cb5b146101235780639957cf8e14610148575b600080fd5b6100dc6101d5565b60405190151581526020015b60405180910390f35b6100f9610248565b6040516100e89190610ace565b61010e610315565b005b61010e61011e366004610b2c565b610380565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100e8565b600554610130906001600160a01b031681565b6100f9610439565b600154610130906001600160a01b031681565b600354610130906001600160a01b031681565b61010e610197366004610bbb565b610502565b61010e6101aa366004610c8d565b610978565b600454610130906001600160a01b031681565b600254610130906001600160a01b031681565b600154604080516325385ba360e11b815290516000926001600160a01b031691634a70b7469160048083019260209291908290030181865afa15801561021f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102439190610cbd565b905090565b60408051808201909152606080825260208201526040805160068054606060208202840181018552938301818152929391928492909184918401828280156102af57602002820191906000526020600020905b81548152602001906001019080831161029b575b505050505081526020016001820180548060200260200160405190810160405280929190818152602001828054801561030757602002820191906000526020600020905b8154815260200190600101908083116102f3575b505050505081525050905090565b6000546001600160a01b031633146103745760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b61037e6000610a43565b565b6000546001600160a01b031633146103da5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036b565b600180546001600160a01b03199081166001600160a01b03978816179091556002805482169587169590951790945560038054851693861693909317909255600480548416918516919091179055600580549092169216919091179055565b60408051808201909152606080825260208201526040805160088054606060208202840181018552938301818152929391928492909184918401828280156102af576020028201919060005260206000209081548152602001906001019080831161029b57505050505081526020016001820180548060200260200160405190810160405280929190818152602001828054801561030757602002820191906000526020600020908154815260200190600101908083116102f357505050505081525050905090565b6000546001600160a01b0316331461055c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036b565b60015460408051635479cf7960e01b815290516000926001600160a01b031691635479cf799160048083019260209291908290030181865afa1580156105a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105ca9190610cda565b905060028160028111156105e0576105e0610cfb565b0361072457600254604051636d29753d60e11b81526001600160a01b039091169063da52ea7a90610615908990600401610d3a565b600060405180830381600087803b15801561062f57600080fd5b505af1158015610643573d6000803e3d6000fd5b5050600354604051636d29753d60e11b81526001600160a01b03909116925063da52ea7a9150610677908690600401610d3a565b600060405180830381600087803b15801561069157600080fd5b505af11580156106a5573d6000803e3d6000fd5b50505050600160009054906101000a90046001600160a01b03166001600160a01b031663997292166040518163ffffffff1660e01b81526004016020604051808303816000875af11580156106fe573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107229190610dcd565b505b60048054604080516347e4055360e01b815290516001600160a01b03909216926347e4055392828201926000929082900301818387803b15801561076757600080fd5b505af115801561077b573d6000803e3d6000fd5b50505050600560009054906101000a90046001600160a01b03166001600160a01b03166347e405536040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156107cf57600080fd5b505af11580156107e3573d6000803e3d6000fd5b505060025460405163cbec894760e01b81526001600160a01b03909116925063cbec89479150610817908890600401610ebf565b600060405180830381600087803b15801561083157600080fd5b505af1158015610845573d6000803e3d6000fd5b5050600254604051636d29753d60e11b81526001600160a01b03909116925063da52ea7a9150610879908790600401610d3a565b600060405180830381600087803b15801561089357600080fd5b505af11580156108a7573d6000803e3d6000fd5b5050600354604051636d29753d60e11b81526001600160a01b03909116925063da52ea7a91506108db908590600401610d3a565b600060405180830381600087803b1580156108f557600080fd5b505af1158015610909573d6000803e3d6000fd5b505060015460405163fa6c955160e01b81526001600160a01b03909116925063fa6c9551915061093e90600690600401610fb6565b600060405180830381600087803b15801561095857600080fd5b505af115801561096c573d6000803e3d6000fd5b50505050505050505050565b6000546001600160a01b031633146109d25760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161036b565b6001600160a01b038116610a375760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161036b565b610a4081610a43565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600081518084526020808501945080840160005b83811015610ac357815187529582019590820190600101610aa7565b509495945050505050565b602081526000825160406020840152610aea6060840182610a93565b90506020840151601f19848303016040850152610b078282610a93565b95945050505050565b80356001600160a01b0381168114610b2757600080fd5b919050565b600080600080600060a08688031215610b4457600080fd5b610b4d86610b10565b9450610b5b60208701610b10565b9350610b6960408701610b10565b9250610b7760608701610b10565b9150610b8560808701610b10565b90509295509295909350565b600060808284031215610ba357600080fd5b50919050565b600060c08284031215610ba357600080fd5b600080600080600060a08688031215610bd357600080fd5b853567ffffffffffffffff80821115610beb57600080fd5b610bf789838a01610b91565b96506020880135915080821115610c0d57600080fd5b610c1989838a01610ba9565b95506040880135915080821115610c2f57600080fd5b610c3b89838a01610b91565b94506060880135915080821115610c5157600080fd5b610c5d89838a01610b91565b93506080880135915080821115610c7357600080fd5b50610c8088828901610b91565b9150509295509295909350565b600060208284031215610c9f57600080fd5b610ca882610b10565b9392505050565b8015158114610a4057600080fd5b600060208284031215610ccf57600080fd5b8151610ca881610caf565b600060208284031215610cec57600080fd5b815160038110610ca857600080fd5b634e487b7160e01b600052602160045260246000fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260006001600160a01b0380610d5285610b10565b16602084015280610d6560208601610b10565b16604084015250604083013560608301526060830135601e19843603018112610d8d57600080fd5b830160208101903567ffffffffffffffff811115610daa57600080fd5b803603821315610db957600080fd5b608080850152610b0760a085018284610d11565b600060208284031215610ddf57600080fd5b5051919050565b8183526000602080850194508260005b85811015610ac3576001600160a01b0380610e1084610b10565b168852828401358489015260408084013590890152606080840135908901526080808401359089015260a0808401359089015260c0808401359089015260e081610e5b828601610b10565b169089015261010081610e6f858301610b10565b16908901525061012082810135610e8581610caf565b1515908801526101408281013590880152610160808301359088015261018080830135908801526101a09687019690910190600101610df6565b6020815260008235601e19843603018112610ed957600080fd5b830160208101903567ffffffffffffffff811115610ef657600080fd5b6101a081023603821315610f0957600080fd5b60c06020850152610f1e60e085018284610de6565b915050610f2d60208501610b10565b6001600160a01b038116604085015250610f4960408501610b10565b6001600160a01b03811660608501525060608401356080840152608084013560a084015260a084013560c08401528091505092915050565b6000815480845260208085019450836000528060002060005b83811015610ac357815487529582019560019182019101610f9a565b60208152604060208201526000610fd06060830184610f81565b828103601f19016040840152610fe98160018601610f81565b94935050505056fea26469706673582212208e6b52df1ee781434fe316762a13cd51f0c2a736e31f91d10c57ce9ed85d11e264736f6c634300080e0033";

type HedgingVaultOrchestratorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HedgingVaultOrchestratorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HedgingVaultOrchestrator__factory extends ContractFactory {
  constructor(...args: HedgingVaultOrchestratorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    potionBuyStrategy_: IVaultV0.StrategyStruct,
    swapToUSDCStrategy_: IVaultV0.StrategyStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<HedgingVaultOrchestrator> {
    return super.deploy(
      potionBuyStrategy_,
      swapToUSDCStrategy_,
      overrides || {}
    ) as Promise<HedgingVaultOrchestrator>;
  }
  override getDeployTransaction(
    potionBuyStrategy_: IVaultV0.StrategyStruct,
    swapToUSDCStrategy_: IVaultV0.StrategyStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      potionBuyStrategy_,
      swapToUSDCStrategy_,
      overrides || {}
    );
  }
  override attach(address: string): HedgingVaultOrchestrator {
    return super.attach(address) as HedgingVaultOrchestrator;
  }
  override connect(signer: Signer): HedgingVaultOrchestrator__factory {
    return super.connect(signer) as HedgingVaultOrchestrator__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HedgingVaultOrchestratorInterface {
    return new utils.Interface(_abi) as HedgingVaultOrchestratorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HedgingVaultOrchestrator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as HedgingVaultOrchestrator;
  }
}
