/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  FaucetToken,
  FaucetTokenInterface,
} from "../../../../contracts/test/FaucetToken.sol/FaucetToken";

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
        name: "_owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "allocateTo",
    outputs: [],
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
  "0x60806040523480156200001157600080fd5b50604051620009aa380380620009aa8339810160408190526200003491620001fa565b60038490553360009081526005602090815260408220869055845186928692869286926200006892909190860190620000a1565b5080516200007e906001906020840190620000a1565b50506002805460ff191660ff9290921691909117905550620002d8945050505050565b828054620000af9062000285565b90600052602060002090601f016020900481019282620000d357600085556200011e565b82601f10620000ee57805160ff19168380011785556200011e565b828001600101855582156200011e579182015b828111156200011e57825182559160200191906001019062000101565b506200012c92915062000130565b5090565b5b808211156200012c576000815560010162000131565b600082601f83011262000158578081fd5b81516001600160401b0380821115620001755762000175620002c2565b604051601f8301601f19908116603f01168101908282118183101715620001a057620001a0620002c2565b81604052838152602092508683858801011115620001bc578485fd5b8491505b83821015620001df5785820183015181830184015290820190620001c0565b83821115620001f057848385830101525b9695505050505050565b6000806000806080858703121562000210578384fd5b845160208601519094506001600160401b03808211156200022f578485fd5b6200023d8883890162000147565b94506040870151915060ff8216821462000255578384fd5b6060870151919350808211156200026a578283fd5b50620002798782880162000147565b91505092959194509250565b600181811c908216806200029a57607f821691505b60208210811415620002bc57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6106c280620002e86000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063313ce56711610066578063313ce5671461012357806370a082311461014257806395d89b4114610162578063a9059cbb1461016a578063dd62ed3e1461017d57600080fd5b806306fdde03146100a357806308bca566146100c1578063095ea7b3146100d657806318160ddd146100f957806323b872dd14610110575b600080fd5b6100ab6101a8565b6040516100b891906105b9565b60405180910390f35b6100d46100cf366004610590565b610236565b005b6100e96100e4366004610590565b6102c0565b60405190151581526020016100b8565b61010260035481565b6040519081526020016100b8565b6100e961011e366004610555565b61032c565b6002546101309060ff1681565b60405160ff90911681526020016100b8565b610102610150366004610509565b60056020526000908152604090205481565b6100ab61042a565b6100e9610178366004610590565b610437565b61010261018b366004610523565b600460209081526000928352604080842090915290825290205481565b600080546101b59061063b565b80601f01602080910402602001604051908101604052809291908181526020018280546101e19061063b565b801561022e5780601f106102035761010080835404028352916020019161022e565b820191906000526020600020905b81548152906001019060200180831161021157829003601f168201915b505050505081565b6001600160a01b0382166000908152600560205260408120805483929061025e90849061060c565b925050819055508060036000828254610277919061060c565b90915550506040518181526001600160a01b0383169030907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b3360008181526004602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061031b9086815260200190565b60405180910390a350600192915050565b6001600160a01b038316600090815260046020908152604080832033845290915281205461035a90836104ce565b6001600160a01b03851660008181526004602090815260408083203384528252808320949094559181526005909152205461039590836104ce565b6001600160a01b0380861660009081526005602052604080822093909355908516815220546103c490836104e1565b6001600160a01b0380851660008181526005602052604090819020939093559151908616907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906104189086815260200190565b60405180910390a35060019392505050565b600180546101b59061063b565b3360009081526005602052604081205461045190836104ce565b33600090815260056020526040808220929092556001600160a01b0385168152205461047d90836104e1565b6001600160a01b0384166000818152600560205260409081902092909255905133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9061031b9086815260200190565b60006104da8284610624565b9392505050565b60006104da828461060c565b80356001600160a01b038116811461050457600080fd5b919050565b60006020828403121561051a578081fd5b6104da826104ed565b60008060408385031215610535578081fd5b61053e836104ed565b915061054c602084016104ed565b90509250929050565b600080600060608486031215610569578081fd5b610572846104ed565b9250610580602085016104ed565b9150604084013590509250925092565b600080604083850312156105a2578182fd5b6105ab836104ed565b946020939093013593505050565b6000602080835283518082850152825b818110156105e5578581018301518582016040015282016105c9565b818111156105f65783604083870101525b50601f01601f1916929092016040019392505050565b6000821982111561061f5761061f610676565b500190565b60008282101561063657610636610676565b500390565b600181811c9082168061064f57607f821691505b6020821081141561067057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220f8532d80dfbd091bd3fc58436e7215a1a8f203cd72135b2bf4f9d39987ea560264736f6c63430008040033";

type FaucetTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FaucetTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FaucetToken__factory extends ContractFactory {
  constructor(...args: FaucetTokenConstructorParams) {
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
  ): Promise<FaucetToken> {
    return super.deploy(
      _initialAmount,
      _tokenName,
      _decimalUnits,
      _tokenSymbol,
      overrides || {}
    ) as Promise<FaucetToken>;
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
  override attach(address: string): FaucetToken {
    return super.attach(address) as FaucetToken;
  }
  override connect(signer: Signer): FaucetToken__factory {
    return super.connect(signer) as FaucetToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FaucetTokenInterface {
    return new utils.Interface(_abi) as FaucetTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FaucetToken {
    return new Contract(address, _abi, signerOrProvider) as FaucetToken;
  }
}
