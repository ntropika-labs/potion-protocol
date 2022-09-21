/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ChainLinkPricer,
  ChainLinkPricerInterface,
} from "../../../../../gamma-protocol/contracts/pricers/ChainlinkPricer.sol/ChainLinkPricer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bot",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_aggregator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "aggregator",
    outputs: [
      {
        internalType: "contract AggregatorInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "aggregatorDecimals",
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
  {
    inputs: [],
    name: "asset",
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
    name: "bot",
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
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getHistoricalPrice",
    outputs: [
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
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPrice",
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
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract OracleInterface",
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
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "setExpiryPriceInOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610a3b380380610a3b8339818101604052608081101561003357600080fd5b50805160208201516040830151606090930151919290916001600160a01b03841661008f5760405162461bcd60e51b815260040180806020018281038252602c815260200180610a0f602c913960400191505060405180910390fd5b6001600160a01b0381166100d45760405162461bcd60e51b815260040180806020018281038252602f8152602001806109ad602f913960400191505060405180910390fd5b6001600160a01b0382166101195760405162461bcd60e51b81526004018080602001828103825260338152602001806109dc6033913960400191505060405180910390fd5b600480546001600160a01b03199081166001600160a01b03878116919091178355600180548316858316179055600280548316868316179081905560038054909316878316179092556040805163313ce56760e01b81529051929091169263313ce567928282019260209290829003018186803b15801561019957600080fd5b505afa1580156101ad573d6000803e3d6000fd5b505050506040513d60208110156101c357600080fd5b505160ff16600055505050506107cf806101de6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80637dc0d1d01161005b5780637dc0d1d0146100db57806398d5fdca146100e3578063b2b63d9f146100eb578063eec377c01461011c57610088565b806310814c371461008d578063245a7bfc146100b157806331b46c8b146100b957806338d52e0f146100d3575b600080fd5b61009561015e565b604080516001600160a01b039092168252519081900360200190f35b61009561016d565b6100c161017c565b60408051918252519081900360200190f35b610095610182565b610095610191565b6100c16101a0565b61011a6004803603604081101561010157600080fd5b508035906020013569ffffffffffffffffffff16610270565b005b6101456004803603602081101561013257600080fd5b503569ffffffffffffffffffff16610422565b6040805192835260208301919091528051918290030190f35b6004546001600160a01b031681565b6002546001600160a01b031681565b60005481565b6003546001600160a01b031681565b6001546001600160a01b031681565b600080600260009054906101000a90046001600160a01b03166001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b1580156101f157600080fd5b505afa158015610205573d6000803e3d6000fd5b505050506040513d60a081101561021b57600080fd5b50602001519050600081136102615760405162461bcd60e51b81526004018080602001828103825260268152602001806107536026913960400191505060405180910390fd5b61026a816104cd565b91505090565b6004546001600160a01b031633146102b95760405162461bcd60e51b815260040180806020018281038252602481526020018061072f6024913960400191505060405180910390fd5b60025460408051639a6fc8f560e01b815269ffffffffffffffffffff84166004820152905160009283926001600160a01b0390911691639a6fc8f59160248082019260a092909190829003018186803b15801561031557600080fd5b505afa158015610329573d6000803e3d6000fd5b505050506040513d60a081101561033f57600080fd5b5060208101516060909101519092509050808411156103a5576040805162461bcd60e51b815260206004820181905260248201527f436861696e4c696e6b5072696365723a20696e76616c696420726f756e644964604482015290519081900360640190fd5b6001546003546040805163ee53140960e01b81526001600160a01b03928316600482015260248101889052604481018690529051919092169163ee53140991606480830192600092919082900301818387803b15801561040457600080fd5b505af1158015610418573d6000803e3d6000fd5b5050505050505050565b60025460408051639a6fc8f560e01b815269ffffffffffffffffffff8416600482015290516000928392839283926001600160a01b031691639a6fc8f59160248083019260a0929190829003018186803b15801561047f57600080fd5b505afa158015610493573d6000803e3d6000fd5b505050506040513d60a08110156104a957600080fd5b50602081015160609091015190925090506104c3826104cd565b9350915050915091565b60006008600054111561050d57600080546104ef90600863ffffffff61054c16565b905061050583600a83900a63ffffffff61059716565b925050610548565b60086000541015610548576000805461052e9060089063ffffffff61054c16565b905061054483600a83900a63ffffffff6105d916565b9250505b5090565b600061058e83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610632565b90505b92915050565b600061058e83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506106c9565b6000826105e857506000610591565b828202828482816105f557fe5b041461058e5760405162461bcd60e51b81526004018080602001828103825260218152602001806107796021913960400191505060405180910390fd5b600081848411156106c15760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561068657818101518382015260200161066e565b50505050905090810190601f1680156106b35780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b600081836107185760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561068657818101518382015260200161066e565b50600083858161072457fe5b049594505050505056fe436861696e4c696e6b5072696365723a20756e617574686f72697a65642073656e646572436861696e4c696e6b5072696365723a207072696365206973206c6f776572207468616e2030536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a26469706673582212208b77b3a5c91b969f0d6d34c4a8329ad27f8e85d9dea05547ca01e8b0364c59d564736f6c634300060a0033436861696e4c696e6b5072696365723a2043616e6e6f742073657420302061646472657373206173206f7261636c65436861696e4c696e6b5072696365723a2043616e6e6f7420736574203020616464726573732061732061676772656761746f72436861696e4c696e6b5072696365723a2043616e6e6f74207365742030206164647265737320617320626f74";

type ChainLinkPricerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ChainLinkPricerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ChainLinkPricer__factory extends ContractFactory {
  constructor(...args: ChainLinkPricerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _bot: PromiseOrValue<string>,
    _asset: PromiseOrValue<string>,
    _aggregator: PromiseOrValue<string>,
    _oracle: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ChainLinkPricer> {
    return super.deploy(
      _bot,
      _asset,
      _aggregator,
      _oracle,
      overrides || {}
    ) as Promise<ChainLinkPricer>;
  }
  override getDeployTransaction(
    _bot: PromiseOrValue<string>,
    _asset: PromiseOrValue<string>,
    _aggregator: PromiseOrValue<string>,
    _oracle: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _bot,
      _asset,
      _aggregator,
      _oracle,
      overrides || {}
    );
  }
  override attach(address: string): ChainLinkPricer {
    return super.attach(address) as ChainLinkPricer;
  }
  override connect(signer: Signer): ChainLinkPricer__factory {
    return super.connect(signer) as ChainLinkPricer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ChainLinkPricerInterface {
    return new utils.Interface(_abi) as ChainLinkPricerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ChainLinkPricer {
    return new Contract(address, _abi, signerOrProvider) as ChainLinkPricer;
  }
}
