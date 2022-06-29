/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperPotionProtocolLib,
  TestWrapperPotionProtocolLibInterface,
} from "../../../contracts/test-wrappers/TestWrapperPotionProtocolLib";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IPotionLiquidityPool",
        name: "potionLiquidityPoolManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "potion",
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
        internalType: "uint256",
        name: "expectedPremium",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slippage",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "USDC",
        type: "address",
      },
    ],
    name: "buyPotion",
    outputs: [
      {
        internalType: "uint256",
        name: "actualPremium",
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
        internalType: "address",
        name: "potion",
        type: "address",
      },
    ],
    name: "redeemPotion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610ba4806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063313d32331461003b578063c537876714610050575b600080fd5b61004e6100493660046105ac565b610075565b005b61006361005e3660046106de565b610083565b60405190815260200160405180910390f35b61007f828261009e565b5050565b60006100938787878787876100fd565b979650505050505050565b604051630545d15160e21b81526001600160a01b038281166004830152831690631517454490602401600060405180830381600087803b1580156100e157600080fd5b505af11580156100f5573d6000803e3d6000fd5b505050505050565b60008061010a85856101ab565b90506101178389836101e1565b604051630e94961760e11b81526001600160a01b03891690631d292c2e90610147908a908a90869060040161086d565b6020604051808303816000875af1158015610166573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061018a919061095a565b9150808210156101a0576101a0838960006101e1565b509695505050505050565b60006101d883836101be6006600a610a6d565b6101c9906064610a79565b6101d39190610a98565b610322565b90505b92915050565b80158061025b5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015610235573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610259919061095a565b155b6102cb5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084015b60405180910390fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b17905261031d90849061034f565b505050565b60006103306006600a610a6d565b61033b906064610a79565b6103458385610a79565b6101d89190610ab0565b60006103a4826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166104219092919063ffffffff16565b80519091501561031d57808060200190518101906103c29190610ad2565b61031d5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016102c2565b6060610430848460008561043a565b90505b9392505050565b60608247101561049b5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016102c2565b6001600160a01b0385163b6104f25760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102c2565b600080866001600160a01b0316858760405161050e9190610b1f565b60006040518083038185875af1925050503d806000811461054b576040519150601f19603f3d011682016040523d82523d6000602084013e610550565b606091505b50915091506100938282866060831561056a575081610433565b82511561057a5782518084602001fd5b8160405162461bcd60e51b81526004016102c29190610b3b565b6001600160a01b03811681146105a957600080fd5b50565b600080604083850312156105bf57600080fd5b82356105ca81610594565b915060208301356105da81610594565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60405160a0810167ffffffffffffffff8111828210171561061e5761061e6105e5565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561064d5761064d6105e5565b604052919050565b80151581146105a957600080fd5b600060a0828403121561067557600080fd5b61067d6105fb565b9050813561068a81610594565b8152602082013561069a81610594565b602082015260408201356106ad81610655565b80604083015250606082013560608201526080820135608082015292915050565b80356106d981610594565b919050565b60008060008060008060c087890312156106f757600080fd5b6107018735610594565b8635955060208088013561071481610594565b9550604088013567ffffffffffffffff8082111561073157600080fd5b818a0191508a601f83011261074557600080fd5b813581811115610757576107576105e5565b610765848260051b01610624565b81815284810192506101a090910283018401908c82111561078557600080fd5b928401925b8184101561084157838d036101a08112156107a457600080fd5b6107ac6105fb565b85356107b781610594565b8152858701358782015260a0603f19830112156107d357600080fd5b6107db6105fb565b9150604086013582526060860135878301526080860135604083015260a0860135606083015260c0860135608083015281604082015261081e8f60e08801610663565b606082015261018086013560808201528452506101a0909301929184019161078a565b975050505060608801359350506080870135915061086160a088016106ce565b90509295509295509295565b6001600160a01b038481168252606060208084018290528551848301819052600093608092909183870190898301875b828110156109415781518051871685528581015186860152604080820151805182880152808801518b880152808201518a8801528a81015160a088015289015160c08701528982015180516001600160a01b0390811660e08901526020820151166101008801529081015115156101208701526060810151610140870152608001516101608601528701516101808501526101a0909301929084019060010161089d565b5050508095505050505050826040830152949350505050565b60006020828403121561096c57600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b600181815b808511156109c45781600019048211156109aa576109aa610973565b808516156109b757918102915b93841c939080029061098e565b509250929050565b6000826109db575060016101db565b816109e8575060006101db565b81600181146109fe5760028114610a0857610a24565b60019150506101db565b60ff841115610a1957610a19610973565b50506001821b6101db565b5060208310610133831016604e8410600b8410161715610a47575081810a6101db565b610a518383610989565b8060001904821115610a6557610a65610973565b029392505050565b60006101d883836109cc565b6000816000190483118215151615610a9357610a93610973565b500290565b60008219821115610aab57610aab610973565b500190565b600082610acd57634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215610ae457600080fd5b815161043381610655565b60005b83811015610b0a578181015183820152602001610af2565b83811115610b19576000848401525b50505050565b60008251610b31818460208701610aef565b9190910192915050565b6020815260008251806020840152610b5a816040850160208701610aef565b601f01601f1916919091016040019291505056fea2646970667358221220f76fb0e564614c11e1ac32637375a2a9c8e0fb700eca0b426d27bcb3e62f820264736f6c634300080e0033";

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
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperPotionProtocolLib> {
    return super.deploy(
      overrides || {}
    ) as Promise<TestWrapperPotionProtocolLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
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
