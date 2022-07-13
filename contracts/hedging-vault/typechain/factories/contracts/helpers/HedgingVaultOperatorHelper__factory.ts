/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  HedgingVaultOperatorHelper,
  HedgingVaultOperatorHelperInterface,
} from "../../../contracts/helpers/HedgingVaultOperatorHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "hedgingVault_",
        type: "address",
      },
      {
        internalType: "address",
        name: "potionBuyAction_",
        type: "address",
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
    name: "canPositionBeEntered",
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
    name: "canPositionBeExited",
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
        name: "swapInfo",
        type: "tuple",
      },
      {
        components: [
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
            internalType: "uint256",
            name: "expectedPremiumInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInPotions",
            type: "uint256",
          },
        ],
        internalType: "struct PotionBuyInfo",
        name: "potionBuyInfo",
        type: "tuple",
      },
    ],
    name: "enterPosition",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "swapInfo",
        type: "tuple",
      },
    ],
    name: "exitPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "hedgingVault",
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
  "0x60c060405234801561001057600080fd5b50604051610bb4380380610bb483398101604081905261002f916100bb565b6100383361004f565b6001600160a01b039182166080521660a0526100ee565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146100b657600080fd5b919050565b600080604083850312156100ce57600080fd5b6100d78361009f565b91506100e56020840161009f565b90509250929050565b60805160a051610a71610143600039600081816101550152818161024a0152818161037a01526103f601526000818160e20152818161017b015281816102b30152818161046101526105100152610a716000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063715018a611610066578063715018a61461011c5780638da5cb5b14610124578063c9a461d614610135578063f2fde38b1461013d578063fd94172c1461015057600080fd5b80634a70b746146100985780634aa0bc20146100b557806358b76f8d146100ca5780635f4d3135146100dd575b600080fd5b6100a0610177565b60405190151581526020015b60405180910390f35b6100c86100c336600461066f565b610200565b005b6100c86100d83660046106ac565b610339565b6101047f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016100ac565b6100c86104d6565b6000546001600160a01b0316610104565b6100a061050c565b6100c861014b366004610733565b61056c565b6101047f000000000000000000000000000000000000000000000000000000000000000081565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316634a70b7466040518163ffffffff1660e01b8152600401602060405180830381865afa1580156101d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101fb9190610763565b905090565b6000546001600160a01b031633146102335760405162461bcd60e51b815260040161022a90610780565b60405180910390fd5b604051636d29753d60e11b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063da52ea7a9061027f9084906004016107de565b600060405180830381600087803b15801561029957600080fd5b505af11580156102ad573d6000803e3d6000fd5b505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663997292166040518163ffffffff1660e01b81526004016020604051808303816000875af1158015610311573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610335919061087a565b5050565b6000546001600160a01b031633146103635760405162461bcd60e51b815260040161022a90610780565b604051636dc6639d60e11b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063db8cc73a906103af908490600401610977565b600060405180830381600087803b1580156103c957600080fd5b505af11580156103dd573d6000803e3d6000fd5b5050604051636d29753d60e11b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016925063da52ea7a915061042d9085906004016107de565b600060405180830381600087803b15801561044757600080fd5b505af115801561045b573d6000803e3d6000fd5b505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316633dc6eabf6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156104ba57600080fd5b505af11580156104ce573d6000803e3d6000fd5b505050505050565b6000546001600160a01b031633146105005760405162461bcd60e51b815260040161022a90610780565b61050a6000610607565b565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c9a461d66040518163ffffffff1660e01b8152600401602060405180830381865afa1580156101d7573d6000803e3d6000fd5b6000546001600160a01b031633146105965760405162461bcd60e51b815260040161022a90610780565b6001600160a01b0381166105fb5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161022a565b61060481610607565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006080828403121561066957600080fd5b50919050565b60006020828403121561068157600080fd5b813567ffffffffffffffff81111561069857600080fd5b6106a484828501610657565b949350505050565b600080604083850312156106bf57600080fd5b823567ffffffffffffffff808211156106d757600080fd5b6106e386838701610657565b935060208501359150808211156106f957600080fd5b50830160e0818603121561070c57600080fd5b809150509250929050565b80356001600160a01b038116811461072e57600080fd5b919050565b60006020828403121561074557600080fd5b61074e82610717565b9392505050565b801515811461060457600080fd5b60006020828403121561077557600080fd5b815161074e81610755565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6020815260006001600160a01b03806107f685610717565b1660208401528061080960208601610717565b16604084015250604083013560608301526060830135601e1984360301811261083157600080fd5b830160208101903567ffffffffffffffff81111561084e57600080fd5b80360382131561085d57600080fd5b60808085015261087160a0850182846107b5565b95945050505050565b60006020828403121561088c57600080fd5b5051919050565b8183526000602080850194508260005b8581101561096c576001600160a01b03806108bd84610717565b168852828401358489015260408084013590890152606080840135908901526080808401359089015260a0808401359089015260c0808401359089015260e081610908828601610717565b16908901526101008161091c858301610717565b1690890152506101208281013561093281610755565b1515908801526101408281013590880152610160808301359088015261018080830135908801526101a096870196909101906001016108a3565b509495945050505050565b6020815260006001600160a01b038061098f85610717565b166020840152806109a260208601610717565b1660408401525060408301356060830152606083013560808301526080830135601e198436030181126109d457600080fd5b830160208101903567ffffffffffffffff8111156109f157600080fd5b6101a081023603821315610a0457600080fd5b60e060a0850152610a1a61010085018284610893565b91505060a084013560c084015260c084013560e0840152809150509291505056fea2646970667358221220677406b65e72d21b4285a9edf00181a72a30d8c3441eb7581bacfe5bf6a2051664736f6c634300080e0033";

type HedgingVaultOperatorHelperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HedgingVaultOperatorHelperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HedgingVaultOperatorHelper__factory extends ContractFactory {
  constructor(...args: HedgingVaultOperatorHelperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    hedgingVault_: string,
    potionBuyAction_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<HedgingVaultOperatorHelper> {
    return super.deploy(
      hedgingVault_,
      potionBuyAction_,
      overrides || {}
    ) as Promise<HedgingVaultOperatorHelper>;
  }
  override getDeployTransaction(
    hedgingVault_: string,
    potionBuyAction_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      hedgingVault_,
      potionBuyAction_,
      overrides || {}
    );
  }
  override attach(address: string): HedgingVaultOperatorHelper {
    return super.attach(address) as HedgingVaultOperatorHelper;
  }
  override connect(signer: Signer): HedgingVaultOperatorHelper__factory {
    return super.connect(signer) as HedgingVaultOperatorHelper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HedgingVaultOperatorHelperInterface {
    return new utils.Interface(_abi) as HedgingVaultOperatorHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HedgingVaultOperatorHelper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as HedgingVaultOperatorHelper;
  }
}
