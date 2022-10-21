/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  HedgingVaultOrchestrator,
  HedgingVaultOrchestratorInterface,
} from "../../../contracts/helpers/HedgingVaultOrchestrator";

const _abi = [
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
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610cf38061007e6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80639bc9b839116100715780639bc9b83914610120578063b508bd4b14610133578063f2b1626414610146578063f2fde38b14610159578063f473ecb91461016c578063fd94172c1461017f57600080fd5b8063058283a5146100ae578063715018a6146100cb57806380b88691146100d55780638da5cb5b146100e85780639957cf8e1461010d575b600080fd5b6100b6610192565b60405190151581526020015b60405180910390f35b6100d3610205565b005b6100d36100e336600461081f565b610244565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100c2565b6005546100f5906001600160a01b031681565b6001546100f5906001600160a01b031681565b6003546100f5906001600160a01b031681565b6100d36101543660046108ae565b6102cd565b6100d3610167366004610980565b610718565b6004546100f5906001600160a01b031681565b6002546100f5906001600160a01b031681565b600154604080516325385ba360e11b815290516000926001600160a01b031691634a70b7469160048083019260209291908290030181865afa1580156101dc573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061020091906109b0565b905090565b6000546001600160a01b031633146102385760405162461bcd60e51b815260040161022f906109cd565b60405180910390fd5b61024260006107b3565b565b6000546001600160a01b0316331461026e5760405162461bcd60e51b815260040161022f906109cd565b600180546001600160a01b03199081166001600160a01b03978816179091556002805482169587169590951790945560038054851693861693909317909255600480548416918516919091179055600580549092169216919091179055565b6000546001600160a01b031633146102f75760405162461bcd60e51b815260040161022f906109cd565b60015460408051635479cf7960e01b815290516000926001600160a01b031691635479cf799160048083019260209291908290030181865afa158015610341573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103659190610a02565b9050600281600281111561037b5761037b610a23565b036104bf57600254604051636d29753d60e11b81526001600160a01b039091169063da52ea7a906103b0908990600401610a62565b600060405180830381600087803b1580156103ca57600080fd5b505af11580156103de573d6000803e3d6000fd5b5050600354604051636d29753d60e11b81526001600160a01b03909116925063da52ea7a9150610412908690600401610a62565b600060405180830381600087803b15801561042c57600080fd5b505af1158015610440573d6000803e3d6000fd5b50505050600160009054906101000a90046001600160a01b03166001600160a01b031663997292166040518163ffffffff1660e01b81526004016020604051808303816000875af1158015610499573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104bd9190610afe565b505b60048054604080516347e4055360e01b815290516001600160a01b03909216926347e4055392828201926000929082900301818387803b15801561050257600080fd5b505af1158015610516573d6000803e3d6000fd5b50505050600560009054906101000a90046001600160a01b03166001600160a01b03166347e405536040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561056a57600080fd5b505af115801561057e573d6000803e3d6000fd5b505060025460405163cbec894760e01b81526001600160a01b03909116925063cbec894791506105b2908890600401610bfb565b600060405180830381600087803b1580156105cc57600080fd5b505af11580156105e0573d6000803e3d6000fd5b5050600254604051636d29753d60e11b81526001600160a01b03909116925063da52ea7a9150610614908790600401610a62565b600060405180830381600087803b15801561062e57600080fd5b505af1158015610642573d6000803e3d6000fd5b5050600354604051636d29753d60e11b81526001600160a01b03909116925063da52ea7a9150610676908590600401610a62565b600060405180830381600087803b15801561069057600080fd5b505af11580156106a4573d6000803e3d6000fd5b50505050600160009054906101000a90046001600160a01b03166001600160a01b0316633dc6eabf6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156106f857600080fd5b505af115801561070c573d6000803e3d6000fd5b50505050505050505050565b6000546001600160a01b031633146107425760405162461bcd60e51b815260040161022f906109cd565b6001600160a01b0381166107a75760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161022f565b6107b0816107b3565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b038116811461081a57600080fd5b919050565b600080600080600060a0868803121561083757600080fd5b61084086610803565b945061084e60208701610803565b935061085c60408701610803565b925061086a60608701610803565b915061087860808701610803565b90509295509295909350565b60006080828403121561089657600080fd5b50919050565b600060c0828403121561089657600080fd5b600080600080600060a086880312156108c657600080fd5b853567ffffffffffffffff808211156108de57600080fd5b6108ea89838a01610884565b9650602088013591508082111561090057600080fd5b61090c89838a0161089c565b9550604088013591508082111561092257600080fd5b61092e89838a01610884565b9450606088013591508082111561094457600080fd5b61095089838a01610884565b9350608088013591508082111561096657600080fd5b5061097388828901610884565b9150509295509295909350565b60006020828403121561099257600080fd5b61099b82610803565b9392505050565b80151581146107b057600080fd5b6000602082840312156109c257600080fd5b815161099b816109a2565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600060208284031215610a1457600080fd5b81516003811061099b57600080fd5b634e487b7160e01b600052602160045260246000fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260006001600160a01b0380610a7a85610803565b16602084015280610a8d60208601610803565b16604084015250604083013560608301526060830135601e19843603018112610ab557600080fd5b830160208101903567ffffffffffffffff811115610ad257600080fd5b803603821315610ae157600080fd5b608080850152610af560a085018284610a39565b95945050505050565b600060208284031215610b1057600080fd5b5051919050565b8183526000602080850194508260005b85811015610bf0576001600160a01b0380610b4184610803565b168852828401358489015260408084013590890152606080840135908901526080808401359089015260a0808401359089015260c0808401359089015260e081610b8c828601610803565b169089015261010081610ba0858301610803565b16908901525061012082810135610bb6816109a2565b1515908801526101408281013590880152610160808301359088015261018080830135908801526101a09687019690910190600101610b27565b509495945050505050565b6020815260008235601e19843603018112610c1557600080fd5b830160208101903567ffffffffffffffff811115610c3257600080fd5b6101a081023603821315610c4557600080fd5b60c06020850152610c5a60e085018284610b17565b915050610c6960208501610803565b6001600160a01b038116604085015250610c8560408501610803565b6001600160a01b03811660608501525060608401356080840152608084013560a084015260a084013560c0840152809150509291505056fea26469706673582212208a69a89023c91519822f0f70ee28b18757ba2a648970e2c4fbcb2260c06d125064736f6c634300080e0033";

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
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<HedgingVaultOrchestrator> {
    return super.deploy(overrides || {}) as Promise<HedgingVaultOrchestrator>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
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
