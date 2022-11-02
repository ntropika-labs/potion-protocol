/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  MockERC4626,
  MockERC4626Interface,
} from "../../../../contracts/test/mocks/MockERC4626";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "address",
        name: "asset_",
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
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Deposit",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
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
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "convertToAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
    name: "maxDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "maxMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "maxRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "maxWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    name: "mockSetBalanceOf",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
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
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "totalAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
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
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162000c1f38038062000c1f8339810160408190526200003491620001f1565b80838381600390805190602001906200004f9291906200007e565b508051620000659060049060208401906200007e565b5050506001600160a01b031660805250620002ba915050565b8280546200008c906200027e565b90600052602060002090601f016020900481019282620000b05760008555620000fb565b82601f10620000cb57805160ff1916838001178555620000fb565b82800160010185558215620000fb579182015b82811115620000fb578251825591602001919060010190620000de565b50620001099291506200010d565b5090565b5b808211156200010957600081556001016200010e565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200014c57600080fd5b81516001600160401b038082111562000169576200016962000124565b604051601f8301601f19908116603f0116810190828211818310171562000194576200019462000124565b81604052838152602092508683858801011115620001b157600080fd5b600091505b83821015620001d55785820183015181830184015290820190620001b6565b83821115620001e75760008385830101525b9695505050505050565b6000806000606084860312156200020757600080fd5b83516001600160401b03808211156200021f57600080fd5b6200022d878388016200013a565b945060208601519150808211156200024457600080fd5b5062000253868287016200013a565b604086015190935090506001600160a01b03811681146200027357600080fd5b809150509250925092565b600181811c908216806200029357607f821691505b602082108103620002b457634e487b7160e01b600052602260045260246000fd5b50919050565b608051610949620002d6600039600061028501526109496000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c806370a08231116100f9578063ba08765211610097578063ce96cb7711610071578063ce96cb77146102d7578063d905777e146102d7578063dd62ed3e1461038e578063ef8b30f71461023257600080fd5b8063ba08765214610368578063c63d75b6146102d7578063c6e6f5921461037b57600080fd5b8063a457c2d7116100d3578063a457c2d714610342578063a9059cbb14610208578063b3d7f6b9146102ec578063b460af941461035557600080fd5b806370a082311461031257806394bf804d1461032757806395d89b411461033a57600080fd5b8063313ce567116101665780633b30cbd2116101405780633b30cbd2146102c2578063402d267d146102d75780634cdad506146102ec5780636e553f65146102ff57600080fd5b8063313ce5671461026957806338d52e0f1461027857806339509351146102af57600080fd5b8063095ea7b3116101a2578063095ea7b3146102085780630a28a4771461023257806318160ddd1461024557806323b872dd1461024d57600080fd5b806301e1d114146101c957806306fdde03146101e057806307a2d13a146101f5575b600080fd5b6000195b6040519081526020015b60405180910390f35b6101e86103a1565b6040516101d791906106cd565b6101cd610203366004610722565b610433565b610222610216366004610757565b50506001600581905590565b60405190151581526020016101d7565b6101cd610240366004610722565b610446565b6002546101cd565b61022261025b366004610781565b600160058190559392505050565b604051601281526020016101d7565b6040516001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001681526020016101d7565b6102226102bd366004610757565b610451565b6102d56102d0366004610722565b600655565b005b6101cd6102e53660046107bd565b5060001990565b6101cd6102fa366004610722565b61047d565b6101cd61030d3660046107d8565b610488565b6101cd6103203660046107bd565b5060065490565b6101cd6103353660046107d8565b61049f565b6101e86104af565b610222610350366004610757565b6104be565b6101cd610363366004610804565b610549565b6101cd610376366004610804565b610561565b6101cd610389366004610722565b610571565b6101cd61039c366004610840565b61057e565b6060600380546103b09061086a565b80601f01602080910402602001604051908101604052809291908181526020018280546103dc9061086a565b80156104295780601f106103fe57610100808354040283529160200191610429565b820191906000526020600020905b81548152906001019060200180831161040c57829003601f168201915b5050505050905090565b60006104406002836108ba565b92915050565b600061044082610571565b600033610473818585610464838361057e565b61046e91906108dc565b6105a9565b5060019392505050565b600061044082610433565b6001600555600061049883610571565b9392505050565b6001600555600061049883610433565b6060600480546103b09061086a565b600033816104cc828661057e565b9050838110156105315760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61053e82868684036105a9565b506001949350505050565b6001600555600061055984610571565b949350505050565b6001600555600061055984610433565b60006104408260026108f4565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b03831661060b5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610528565b6001600160a01b03821661066c5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610528565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600060208083528351808285015260005b818110156106fa578581018301518582016040015282016106de565b8181111561070c576000604083870101525b50601f01601f1916929092016040019392505050565b60006020828403121561073457600080fd5b5035919050565b80356001600160a01b038116811461075257600080fd5b919050565b6000806040838503121561076a57600080fd5b6107738361073b565b946020939093013593505050565b60008060006060848603121561079657600080fd5b61079f8461073b565b92506107ad6020850161073b565b9150604084013590509250925092565b6000602082840312156107cf57600080fd5b6104988261073b565b600080604083850312156107eb57600080fd5b823591506107fb6020840161073b565b90509250929050565b60008060006060848603121561081957600080fd5b833592506108296020850161073b565b91506108376040850161073b565b90509250925092565b6000806040838503121561085357600080fd5b61085c8361073b565b91506107fb6020840161073b565b600181811c9082168061087e57607f821691505b60208210810361089e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000826108d757634e487b7160e01b600052601260045260246000fd5b500490565b600082198211156108ef576108ef6108a4565b500190565b600081600019048311821515161561090e5761090e6108a4565b50029056fea2646970667358221220520abab3a9c627187e470960757b3b82781ccbec9c416f40f7a4301d9a6f3d4864736f6c634300080e0033";

type MockERC4626ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC4626ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC4626__factory extends ContractFactory {
  constructor(...args: MockERC4626ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    asset_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC4626> {
    return super.deploy(
      name,
      symbol,
      asset_,
      overrides || {}
    ) as Promise<MockERC4626>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    asset_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, asset_, overrides || {});
  }
  override attach(address: string): MockERC4626 {
    return super.attach(address) as MockERC4626;
  }
  override connect(signer: Signer): MockERC4626__factory {
    return super.connect(signer) as MockERC4626__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC4626Interface {
    return new utils.Interface(_abi) as MockERC4626Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC4626 {
    return new Contract(address, _abi, signerOrProvider) as MockERC4626;
  }
}