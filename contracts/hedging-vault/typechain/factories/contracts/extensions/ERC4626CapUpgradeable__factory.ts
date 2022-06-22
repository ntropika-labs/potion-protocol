/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC4626CapUpgradeable,
  ERC4626CapUpgradeableInterface,
} from "../../../contracts/extensions/ERC4626CapUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdmin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
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
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevKeeper",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "KeeperChanged",
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
        internalType: "uint256",
        name: "prevCap",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newCap",
        type: "uint256",
      },
    ],
    name: "VaultCapChanged",
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
        name: "spender",
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
        name: "account",
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
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "changeKeeper",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
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
        name: "receiver",
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
    inputs: [],
    name: "getAdmin",
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
    name: "getKeeper",
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
    name: "getVaultCap",
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
        name: "receiver",
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
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
      {
        internalType: "address",
        name: "receiver",
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
    name: "previewMint",
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
    name: "previewRedeem",
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
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
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
    inputs: [
      {
        internalType: "uint256",
        name: "newCap",
        type: "uint256",
      },
    ],
    name: "setVaultCap",
    outputs: [],
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
        name: "to",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
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
  "0x608060405234801561001057600080fd5b50611af7806100206000396000f3fe608060405234801561001057600080fd5b50600436106101fb5760003560e01c806370a082311161011a578063b460af94116100ad578063ce96cb771161007c578063ce96cb77146103f6578063d905777e14610409578063dd62ed3e1461041c578063ef8b30f71461027b578063f0f5907d1461042f57600080fd5b8063b460af94146103bd578063ba087652146103d0578063c63d75b6146103e3578063c6e6f5921461027b57600080fd5b80639f8a3934116100e95780639f8a39341461038f578063a457c2d714610397578063a9059cbb146103aa578063b3d7f6b91461023057600080fd5b806370a08231146103385780638f2839701461036157806394bf804d1461037457806395d89b411461038757600080fd5b8063313ce56711610192578063402d267d11610161578063402d267d146103015780634cdad506146102305780636e553f65146103145780636e9960c31461032757600080fd5b8063313ce567146102a957806338d52e0f146102b8578063391b6f4e146102dd57806339509351146102ee57600080fd5b806309779838116101ce57806309779838146102665780630a28a4771461027b57806318160ddd1461028e57806323b872dd1461029657600080fd5b806301e1d1141461020057806306fdde031461021b57806307a2d13a14610230578063095ea7b314610243575b600080fd5b610208610442565b6040519081526020015b60405180910390f35b6102236104b4565b60405161021291906116d4565b61020861023e366004611707565b610546565b61025661025136600461173c565b610557565b6040519015158152602001610212565b610279610274366004611766565b61056f565b005b610208610289366004611707565b610669565b603554610208565b6102566102a4366004611781565b610674565b60405160128152602001610212565b6065546001600160a01b03165b6040516001600160a01b039091168152602001610212565b6098546001600160a01b03166102c5565b6102566102fc36600461173c565b61069a565b61020861030f366004611766565b6106bc565b6102086103223660046117bd565b6106ff565b6097546001600160a01b03166102c5565b610208610346366004611766565b6001600160a01b031660009081526033602052604090205490565b61027961036f366004611766565b610772565b6102086103823660046117bd565b610862565b6102236108d5565b60c954610208565b6102566103a536600461173c565b6108e4565b6102566103b836600461173c565b61096a565b6102086103cb3660046117e9565b610978565b6102086103de3660046117e9565b6109f4565b6102086103f1366004611766565b610a68565b610208610404366004611766565b610ab0565b610208610417366004611766565b610ad2565b61020861042a366004611825565b610af0565b61027961043d366004611707565b610b1b565b6065546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa15801561048b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104af919061184f565b905090565b6060603680546104c390611868565b80601f01602080910402602001604051908101604052809291908181526020018280546104ef90611868565b801561053c5780601f106105115761010080835404028352916020019161053c565b820191906000526020600020905b81548152906001019060200180831161051f57829003601f168201915b5050505050905090565b600061055182610b81565b92915050565b600033610565818585610c59565b5060019392505050565b6097546001600160a01b0316336001600160a01b0316146105ab5760405162461bcd60e51b81526004016105a2906118a2565b60405180910390fd5b6001600160a01b0381166106175760405162461bcd60e51b815260206004820152602d60248201527f4e6577206b656570657220616464726573732063616e6e6f742062652074686560448201526c206e756c6c206164647265737360981b60648201526084016105a2565b609880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f068b48a2fe7f498b57ff6da64f075ae658fde8d77124b092e62b3dc58d91ce3590600090a35050565b600061055182610d7d565b600033610682858285610e35565b61068d858585610eaf565b60019150505b9392505050565b6000336105658185856106ad8383610af0565b6106b791906118fd565b610c59565b6000806106d36106cb8461107d565b60c95461109b565b90506106dd610442565b8110156106ed5750600092915050565b6106f5610442565b6106939082611915565b600061070a826106bc565b8311156107595760405162461bcd60e51b815260206004820152601e60248201527f455243343632363a206465706f736974206d6f7265207468616e206d6178000060448201526064016105a2565b600061076484610669565b9050610693338486846110b1565b6097546001600160a01b0316336001600160a01b0316146107a55760405162461bcd60e51b81526004016105a2906118a2565b6001600160a01b0381166108105760405162461bcd60e51b815260206004820152602c60248201527f4e65772061646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b60648201526084016105a2565b609780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b600061086d82610a68565b8311156108bc5760405162461bcd60e51b815260206004820152601b60248201527f455243343632363a206d696e74206d6f7265207468616e206d6178000000000060448201526064016105a2565b60006108c784610546565b9050610693338483876110b1565b6060603780546104c390611868565b600033816108f28286610af0565b9050838110156109525760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105a2565b61095f8286868403610c59565b506001949350505050565b600033610565818585610eaf565b600061098382610ab0565b8411156109d25760405162461bcd60e51b815260206004820152601f60248201527f455243343632363a207769746864726177206d6f7265207468616e206d61780060448201526064016105a2565b60006109dd85610669565b90506109ec338585888561112f565b949350505050565b60006109ff82610ad2565b841115610a4e5760405162461bcd60e51b815260206004820152601d60248201527f455243343632363a2072656465656d206d6f7265207468616e206d617800000060448201526064016105a2565b6000610a5985610546565b90506109ec338585848961112f565b6000610a72610442565b60c9541015610a8357506000919050565b6000610aa5600019610a93610442565b60c954610aa09190611915565b61109b565b905061069381610d7d565b6001600160a01b03811660009081526033602052604081205461055190610b81565b6001600160a01b038116600090815260336020526040812054610551565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b6097546001600160a01b0316336001600160a01b031614610b4e5760405162461bcd60e51b81526004016105a2906118a2565b6040518190819081907f4d2401457be9e6122a73ae61656c5683178c9f48c9d3eef2de0542d09d35be7790600090a35050565b600080610b8d60355490565b90508015610bb75780610b9e610442565b610ba8908561192c565b610bb2919061194b565b610693565b610bc36012600a611a51565b606560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c16573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c3a9190611a60565b610c4590600a611a51565b610c4f908561192c565b610693919061194b565b6001600160a01b038316610cbb5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105a2565b6001600160a01b038216610d1c5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105a2565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600080610d8960355490565b9050821580610d96575080155b610dac57610da2610442565b610ba8828561192c565b606560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610dff573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e239190611a60565b610e2e90600a611a51565b6012610c3a565b6000610e418484610af0565b90506000198114610ea95781811015610e9c5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016105a2565b610ea98484848403610c59565b50505050565b6001600160a01b038316610f135760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105a2565b6001600160a01b038216610f755760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105a2565b6001600160a01b03831660009081526033602052604090205481811015610fed5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105a2565b6001600160a01b038085166000908152603360205260408082208585039055918516815290812080548492906110249084906118fd565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161107091815260200190565b60405180910390a3610ea9565b60006110876111e0565b611092576000610551565b60001992915050565b60008183106110aa5781610693565b5090919050565b6065546110c9906001600160a01b03168530856111fa565b6110d38382611265565b826001600160a01b0316846001600160a01b03167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78484604051611121929190918252602082015260400190565b60405180910390a350505050565b826001600160a01b0316856001600160a01b03161461115357611153838683610e35565b61115d8382611344565b606554611174906001600160a01b03168584611492565b826001600160a01b0316846001600160a01b0316866001600160a01b03167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db85856040516111cc929190918252602082015260400190565b60405180910390a45050505050565b505050565b6000806111eb610442565b11806104af5750506035541590565b6040516001600160a01b0380851660248301528316604482015260648101829052610ea99085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526114c2565b6001600160a01b0382166112bb5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105a2565b80603560008282546112cd91906118fd565b90915550506001600160a01b038216600090815260336020526040812080548392906112fa9084906118fd565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b0382166113a45760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016105a2565b6001600160a01b038216600090815260336020526040902054818110156114185760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016105a2565b6001600160a01b0383166000908152603360205260408120838303905560358054849290611447908490611915565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b6040516001600160a01b0383166024820152604481018290526111db90849063a9059cbb60e01b9060640161122e565b6000611517826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166115949092919063ffffffff16565b8051909150156111db57808060200190518101906115359190611a83565b6111db5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105a2565b60606109ec8484600085856001600160a01b0385163b6115f65760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105a2565b600080866001600160a01b031685876040516116129190611aa5565b60006040518083038185875af1925050503d806000811461164f576040519150601f19603f3d011682016040523d82523d6000602084013e611654565b606091505b509150915061166482828661166f565b979650505050505050565b6060831561167e575081610693565b82511561168e5782518084602001fd5b8160405162461bcd60e51b81526004016105a291906116d4565b60005b838110156116c35781810151838201526020016116ab565b83811115610ea95750506000910152565b60208152600082518060208401526116f38160408501602087016116a8565b601f01601f19169190910160400192915050565b60006020828403121561171957600080fd5b5035919050565b80356001600160a01b038116811461173757600080fd5b919050565b6000806040838503121561174f57600080fd5b61175883611720565b946020939093013593505050565b60006020828403121561177857600080fd5b61069382611720565b60008060006060848603121561179657600080fd5b61179f84611720565b92506117ad60208501611720565b9150604084013590509250925092565b600080604083850312156117d057600080fd5b823591506117e060208401611720565b90509250929050565b6000806000606084860312156117fe57600080fd5b8335925061180e60208501611720565b915061181c60408501611720565b90509250925092565b6000806040838503121561183857600080fd5b61184183611720565b91506117e060208401611720565b60006020828403121561186157600080fd5b5051919050565b600181811c9082168061187c57607f821691505b60208210810361189c57634e487b7160e01b600052602260045260246000fd5b50919050565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b60008219821115611910576119106118e7565b500190565b600082821015611927576119276118e7565b500390565b6000816000190483118215151615611946576119466118e7565b500290565b60008261196857634e487b7160e01b600052601260045260246000fd5b500490565b600181815b808511156119a857816000190482111561198e5761198e6118e7565b8085161561199b57918102915b93841c9390800290611972565b509250929050565b6000826119bf57506001610551565b816119cc57506000610551565b81600181146119e257600281146119ec57611a08565b6001915050610551565b60ff8411156119fd576119fd6118e7565b50506001821b610551565b5060208310610133831016604e8410600b8410161715611a2b575081810a610551565b611a35838361196d565b8060001904821115611a4957611a496118e7565b029392505050565b600061069360ff8416836119b0565b600060208284031215611a7257600080fd5b815160ff8116811461069357600080fd5b600060208284031215611a9557600080fd5b8151801515811461069357600080fd5b60008251611ab78184602087016116a8565b919091019291505056fea264697066735822122064d516ad065e92f17b8a35731e828f04073257350246d26647742e4ef312fa7f64736f6c634300080e0033";

type ERC4626CapUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC4626CapUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC4626CapUpgradeable__factory extends ContractFactory {
  constructor(...args: ERC4626CapUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC4626CapUpgradeable> {
    return super.deploy(overrides || {}) as Promise<ERC4626CapUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC4626CapUpgradeable {
    return super.attach(address) as ERC4626CapUpgradeable;
  }
  override connect(signer: Signer): ERC4626CapUpgradeable__factory {
    return super.connect(signer) as ERC4626CapUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC4626CapUpgradeableInterface {
    return new utils.Interface(_abi) as ERC4626CapUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC4626CapUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC4626CapUpgradeable;
  }
}
