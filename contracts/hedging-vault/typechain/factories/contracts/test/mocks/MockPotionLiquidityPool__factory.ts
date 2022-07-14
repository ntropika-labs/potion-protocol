/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockPotionLiquidityPool,
  MockPotionLiquidityPoolInterface,
} from "../../../../contracts/test/mocks/MockPotionLiquidityPool";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IOtoken",
        name: "",
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
        name: "",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "_maxPremium",
        type: "uint256",
      },
    ],
    name: "buyOtokens",
    outputs: [
      {
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
        name: "",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "maxPremium",
        type: "uint256",
      },
    ],
    name: "createAndBuyOtokens",
    outputs: [
      {
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IOtoken",
        name: "",
        type: "address",
      },
    ],
    name: "settleAfterExpiry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610421806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806315174544146100465780631d292c2e1461005e57806322d8755f14610089575b600080fd5b61005c6100543660046100bf565b506001600055565b005b61007761006c3660046102ef565b600160005592915050565b60405190815260200160405180910390f35b610077610097366004610348565b6001600055979650505050505050565b6001600160a01b03811681146100bc57600080fd5b50565b6000602082840312156100d157600080fd5b81356100dc816100a7565b9392505050565b634e487b7160e01b600052604160045260246000fd5b60405160a0810167ffffffffffffffff8111828210171561011c5761011c6100e3565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561014b5761014b6100e3565b604052919050565b8035801515811461016357600080fd5b919050565b600060a0828403121561017a57600080fd5b6101826100f9565b9050813561018f816100a7565b8152602082013561019f816100a7565b60208201526101b060408301610153565b6040820152606082013560608201526080820135608082015292915050565b600082601f8301126101e057600080fd5b8135602067ffffffffffffffff8211156101fc576101fc6100e3565b61020a818360051b01610122565b8281526101a0928302850182019282820191908785111561022a57600080fd5b8387015b858110156102e257808903828112156102475760008081fd5b61024f6100f9565b823561025a816100a7565b81528287013587820152604060a0603f19840181131561027a5760008081fd5b6102826100f9565b93508185013584526060808601358a86015260808087013584870152828701358287015260c08701358187015285848601526102c18f60e08901610168565b9185019190915261018086013590840152505085525092840192810161022e565b5090979650505050505050565b60008060006060848603121561030457600080fd5b833561030f816100a7565b9250602084013567ffffffffffffffff81111561032b57600080fd5b610337868287016101cf565b925050604084013590509250925092565b600080600080600080600080610100898b03121561036557600080fd5b8835610370816100a7565b97506020890135610380816100a7565b96506040890135610390816100a7565b955060608901359450608089013593506103ac60a08a01610153565b925060c089013567ffffffffffffffff8111156103c857600080fd5b6103d48b828c016101cf565b92505060e08901359050929598509295989093965056fea26469706673582212200bfb520dcedbfb0e5cd8fd5c17a5b41589745e3663f25594c8e024e625f52b8364736f6c634300080e0033";

type MockPotionLiquidityPoolConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockPotionLiquidityPoolConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockPotionLiquidityPool__factory extends ContractFactory {
  constructor(...args: MockPotionLiquidityPoolConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockPotionLiquidityPool> {
    return super.deploy(overrides || {}) as Promise<MockPotionLiquidityPool>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockPotionLiquidityPool {
    return super.attach(address) as MockPotionLiquidityPool;
  }
  override connect(signer: Signer): MockPotionLiquidityPool__factory {
    return super.connect(signer) as MockPotionLiquidityPool__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockPotionLiquidityPoolInterface {
    return new utils.Interface(_abi) as MockPotionLiquidityPoolInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockPotionLiquidityPool {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockPotionLiquidityPool;
  }
}
