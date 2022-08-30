/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ChainlinkAggregatorUSDC,
  ChainlinkAggregatorUSDCInterface,
} from "../../../contracts/test/ChainlinkAggregatorUSDC";

const _abi = [
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506101f6806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063313ce5671461005c57806354fd4d50146100705780637284e4161461007f5780639a6fc8f514610094578063feaf968c146100e9575b600080fd5b604051600881526020015b60405180910390f35b60405160018152602001610067565b6100876100f8565b6040516100679190610149565b6100b26100a2366004610118565b906305f5e1009060009042908290565b6040805169ffffffffffffffffffff968716815260208101959095528401929092526060830152909116608082015260a001610067565b60006305f5e1008142816100b2565b606060405180606001604052806024815260200161019d60249139905090565b600060208284031215610129578081fd5b813569ffffffffffffffffffff81168114610142578182fd5b9392505050565b6000602080835283518082850152825b8181101561017557858101830151858201604001528201610159565b818111156101865783604083870101525b50601f01601f191692909201604001939250505056fe506f74696f6e20436861696e6c696e6b2041676772656761746f7220666f722055534443a2646970667358221220c9c6fc54a9284c790b8aadcbe35db9382c8ef5843673eee01249fd6f54aa634364736f6c63430008040033";

type ChainlinkAggregatorUSDCConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ChainlinkAggregatorUSDCConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ChainlinkAggregatorUSDC__factory extends ContractFactory {
  constructor(...args: ChainlinkAggregatorUSDCConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ChainlinkAggregatorUSDC> {
    return super.deploy(overrides || {}) as Promise<ChainlinkAggregatorUSDC>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ChainlinkAggregatorUSDC {
    return super.attach(address) as ChainlinkAggregatorUSDC;
  }
  override connect(signer: Signer): ChainlinkAggregatorUSDC__factory {
    return super.connect(signer) as ChainlinkAggregatorUSDC__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ChainlinkAggregatorUSDCInterface {
    return new utils.Interface(_abi) as ChainlinkAggregatorUSDCInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ChainlinkAggregatorUSDC {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ChainlinkAggregatorUSDC;
  }
}
