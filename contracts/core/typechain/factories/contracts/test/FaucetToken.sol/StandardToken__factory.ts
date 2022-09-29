/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory } from "ethers";
import type { BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  StandardToken,
  StandardTokenInterface,
} from "../../../../contracts/test/FaucetToken.sol/StandardToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_initialAmount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tokenName",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_decimalUnits",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "_tokenSymbol",
        type: "string",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
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
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    ],
    name: "balanceOf",
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
    name: "name",
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
    inputs: [],
    name: "symbol",
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
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051620008c8380380620008c8833981016040819052610031916101cc565b600384905533600090815260056020908152604082208690558451610059929186019061008b565b50805161006d90600190602084019061008b565b50506002805460ff191660ff92909216919091179055506102a09050565b8280546100979061024f565b90600052602060002090601f0160209004810192826100b957600085556100ff565b82601f106100d257805160ff19168380011785556100ff565b828001600101855582156100ff579182015b828111156100ff5782518255916020019190600101906100e4565b5061010b92915061010f565b5090565b5b8082111561010b5760008155600101610110565b600082601f830112610134578081fd5b81516001600160401b038082111561014e5761014e61028a565b604051601f8301601f19908116603f011681019082821181831017156101765761017661028a565b81604052838152602092508683858801011115610191578485fd5b8491505b838210156101b25785820183015181830184015290820190610195565b838211156101c257848385830101525b9695505050505050565b600080600080608085870312156101e1578384fd5b845160208601519094506001600160401b03808211156101ff578485fd5b61020b88838901610124565b94506040870151915060ff82168214610222578384fd5b606087015191935080821115610236578283fd5b5061024387828801610124565b91505092959194509250565b600181811c9082168061026357607f821691505b6020821081141561028457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61061880620002b06000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461010357806370a082311461012257806395d89b4114610142578063a9059cbb1461014a578063dd62ed3e1461015d57600080fd5b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100d957806323b872dd146100f0575b600080fd5b6100a0610188565b6040516100ad919061050f565b60405180910390f35b6100c96100c43660046104e6565b610216565b60405190151581526020016100ad565b6100e260035481565b6040519081526020016100ad565b6100c96100fe3660046104ab565b610282565b6002546101109060ff1681565b60405160ff90911681526020016100ad565b6100e261013036600461045f565b60056020526000908152604090205481565b6100a0610380565b6100c96101583660046104e6565b61038d565b6100e261016b366004610479565b600460209081526000928352604080842090915290825290205481565b6000805461019590610591565b80601f01602080910402602001604051908101604052809291908181526020018280546101c190610591565b801561020e5780601f106101e35761010080835404028352916020019161020e565b820191906000526020600020905b8154815290600101906020018083116101f157829003601f168201915b505050505081565b3360008181526004602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102719086815260200190565b60405180910390a350600192915050565b6001600160a01b03831660009081526004602090815260408083203384529091528120546102b09083610424565b6001600160a01b0385166000818152600460209081526040808320338452825280832094909455918152600590915220546102eb9083610424565b6001600160a01b03808616600090815260056020526040808220939093559085168152205461031a9083610437565b6001600160a01b0380851660008181526005602052604090819020939093559151908616907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9061036e9086815260200190565b60405180910390a35060019392505050565b6001805461019590610591565b336000908152600560205260408120546103a79083610424565b33600090815260056020526040808220929092556001600160a01b038516815220546103d39083610437565b6001600160a01b0384166000818152600560205260409081902092909255905133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906102719086815260200190565b6000610430828461057a565b9392505050565b60006104308284610562565b80356001600160a01b038116811461045a57600080fd5b919050565b600060208284031215610470578081fd5b61043082610443565b6000806040838503121561048b578081fd5b61049483610443565b91506104a260208401610443565b90509250929050565b6000806000606084860312156104bf578081fd5b6104c884610443565b92506104d660208501610443565b9150604084013590509250925092565b600080604083850312156104f8578182fd5b61050183610443565b946020939093013593505050565b6000602080835283518082850152825b8181101561053b5785810183015185820160400152820161051f565b8181111561054c5783604083870101525b50601f01601f1916929092016040019392505050565b60008219821115610575576105756105cc565b500190565b60008282101561058c5761058c6105cc565b500390565b600181811c908216806105a557607f821691505b602082108114156105c657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea264697066735822122058509ef8f97fff4177d2f57bc7cf8f2b2080fb20d53db5469cd054f06e1d70ff64736f6c63430008040033";

type StandardTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StandardTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StandardToken__factory extends ContractFactory {
  constructor(...args: StandardTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _initialAmount: PromiseOrValue<BigNumberish>,
    _tokenName: PromiseOrValue<string>,
    _decimalUnits: PromiseOrValue<BigNumberish>,
    _tokenSymbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<StandardToken> {
    return super.deploy(
      _initialAmount,
      _tokenName,
      _decimalUnits,
      _tokenSymbol,
      overrides || {}
    ) as Promise<StandardToken>;
  }
  override getDeployTransaction(
    _initialAmount: PromiseOrValue<BigNumberish>,
    _tokenName: PromiseOrValue<string>,
    _decimalUnits: PromiseOrValue<BigNumberish>,
    _tokenSymbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _initialAmount,
      _tokenName,
      _decimalUnits,
      _tokenSymbol,
      overrides || {}
    );
  }
  override attach(address: string): StandardToken {
    return super.attach(address) as StandardToken;
  }
  override connect(signer: Signer): StandardToken__factory {
    return super.connect(signer) as StandardToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StandardTokenInterface {
    return new utils.Interface(_abi) as StandardTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): StandardToken {
    return new Contract(address, _abi, signerOrProvider) as StandardToken;
  }
}
